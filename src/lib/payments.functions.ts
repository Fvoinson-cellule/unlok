import { createServerFn } from "@tanstack/react-start";
import { type StripeEnv, createStripeClient, getStripeErrorMessage } from "@/lib/stripe.server";

type CheckoutSessionResult =
  | { clientSecret: string }
  | { error: string };

// Catalogue UNLOK : identifiants lisibles, stables entre test et production.
export const PRICE_IDS = {
  trial: "unlok_trial_once",
  subscription: "unlok_subscription_monthly",
  card5: "unlok_card5_once",
  card10: "unlok_card10_once",
  card5_vip: "unlok_card5_vip_once",
  card10_vip: "unlok_card10_vip_once",
} as const;

export const PROMO_CODES = ["VIP25"] as const;

export const createCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((data: {
    priceId: string;
    customerEmail: string;
    bookingId: string;
    slotId: string;
    sessionDate: string | null;
    bookingType: "trial" | "subscription" | "card5" | "card10";
    returnUrl: string;
    environment: StripeEnv;
  }) => {
    if (!/^[a-zA-Z0-9_-]+$/.test(data.priceId)) throw new Error("Invalid priceId");
    if (!/^[0-9a-fA-F-]{36}$/.test(data.bookingId)) throw new Error("Invalid bookingId");
    if (!/^[0-9a-fA-F-]{36}$/.test(data.slotId)) throw new Error("Invalid slotId");
    return data;
  })
  .handler(async ({ data }): Promise<CheckoutSessionResult> => {
    try {
      const stripe = createStripeClient(data.environment);

      const prices = await stripe.prices.list({ lookup_keys: [data.priceId] });
      if (!prices.data.length) throw new Error("Price not found");
      const stripePrice = prices.data[0]!;
      const isRecurring = stripePrice.type === "recurring";

      const metadata = {
        bookingId: data.bookingId,
        slotId: data.slotId,
        bookingType: data.bookingType,
        sessionDate: data.sessionDate ?? "",
      };

      // Achat anonyme (pas de compte utilisateur) : customer_email suffit.
      // Le compte Stripe est créé par Stripe à partir de l'email.
      const session = await stripe.checkout.sessions.create({
        line_items: [{ price: stripePrice!.id, quantity: 1 }],
        mode: isRecurring ? "subscription" : "payment",
        ui_mode: "embedded_page",
        return_url: data.returnUrl,
        customer_email: data.customerEmail,
        metadata,
        // Séances en personne : le traitement fiscal automatique de Stripe
        // n'est pas éligible. TVA non applicable (art. 293 B du CGI), aucun
        // paramètre fiscal sur la session.
        ...(isRecurring && {
          subscription_data: {
            metadata: { bookingId: data.bookingId, slotId: data.slotId },
          },
        }),
      } as Parameters<typeof stripe.checkout.sessions.create>[0]);

      return { clientSecret: session.client_secret ?? "" };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });

// Réservation liée à une session de paiement (page de retour).
export const getBookingByCheckoutSession = createServerFn({ method: "GET" })
  .inputValidator((data: { sessionId: string }) => {
    if (!/^cs_[A-Za-z0-9_-]{10,}$/.test(data.sessionId)) throw new Error("Invalid sessionId");
    return data;
  })
  .handler(async ({ data }) => {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env['SUPABASE_URL']!,
      process.env['SUPABASE_SERVICE_ROLE_KEY']!,
    );
    const { data: row, error } = await supabase
      .from("coaching_bookings")
      .select(
        "id, slot_id, booking_type, session_date, full_name, email, paid_at, pending_card_type, card_id",
      )
      .eq("checkout_session_id", data.sessionId)
      .limit(1)
      .maybeSingle();
    if (error) return { error: "lookup_failed" };
    if (!row) return { error: "not_found" };

    let cardRemaining: number | null = null;
    let cardExpiresOn: string | null = null;
    if (row.card_id) {
      const { data: card } = await supabase
        .from("coaching_cards")
        .select("total_sessions, used_sessions, expires_on")
        .eq("id", row.card_id)
        .limit(1)
        .maybeSingle();
      if (card) {
        cardRemaining = card.total_sessions - card.used_sessions;
        cardExpiresOn = card.expires_on;
      }
    }

    let dayLabel: string | null = null;
    let timeLabel: string | null = null;
    let location: string | null = null;
    if (row.slot_id) {
      const { data: slot } = await supabase
        .from("coaching_slots")
        .select("day_label, time_label, location")
        .eq("id", row.slot_id)
        .limit(1)
        .maybeSingle();
      dayLabel = slot?.day_label ?? null;
      timeLabel = slot?.time_label ?? null;
      location = slot?.location ?? null;
    }

    return {
      booking: {
        type: row.booking_type,
        sessionDate: row.session_date,
        fullName: row.full_name,
        paid: Boolean(row.paid_at),
        cardRemaining,
        cardExpiresOn,
        dayLabel,
        timeLabel,
        location,
      },
    };
  });
