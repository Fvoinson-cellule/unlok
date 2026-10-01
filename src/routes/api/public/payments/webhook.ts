import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { type StripeEnv, verifyWebhook } from "@/lib/stripe.server";
import type { Database } from "@/integrations/supabase/types";

// Defer client construction until first use so env var availability is not
// assumed at module load time.
let _supabase: ReturnType<typeof createClient<Database>> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient<Database>(
      process.env['SUPABASE_URL']!,
      process.env['SUPABASE_SERVICE_ROLE_KEY']!,
    );
  }
  return _supabase;
}

async function handleCheckoutCompleted(session: any, env: StripeEnv) {
  // SEPA et autres paiements différés : ne confirmer que si le paiement
  // n'est pas en attente. no_payment_required = total zéro, à confirmer.
  if (session.payment_status === "unpaid") return;

  const bookingId = session.metadata?.bookingId;
  if (!bookingId) {
    console.error("checkout.session.completed sans bookingId");
    return;
  }
  const { error } = await getSupabase().rpc("confirm_paid_booking", {
    p_booking_id: bookingId,
    p_checkout_session_id: session.id,
    p_amount_cents: session.amount_total ?? null,
  });
  if (error) console.error("confirm_paid_booking a échoué", error, env);
}

async function handleSubscriptionCreated(subscription: any, _env: StripeEnv) {
  const bookingId = subscription.metadata?.bookingId;
  if (!bookingId) return;
  await getSupabase()
    .from("coaching_bookings")
    .update({ stripe_subscription_id: subscription.id })
    .eq("id", bookingId);
}

async function handleSubscriptionDeleted(subscription: any, _env: StripeEnv) {
  const bookingId = subscription.metadata?.bookingId;
  if (!bookingId) {
    console.error("customer.subscription.deleted sans bookingId");
    return;
  }
  const { error } = await getSupabase().rpc("release_subscription_booking", {
    p_booking_id: bookingId,
  });
  if (error) console.error("release_subscription_booking a échoué", error);
}

async function handleWebhook(req: Request, env: StripeEnv) {
  const event = await verifyWebhook(req, env);

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object, env);
      break;
    case "customer.subscription.created":
      await handleSubscriptionCreated(event.data.object, env);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object, env);
      break;
    case "customer.subscription.updated":
    case "checkout.session.async_payment_succeeded":
    case "invoice.paid":
    case "invoice.payment_failed":
      // L'état d'abonnement utile ici est l'annulation finale (deleted).
      break;
    default:
      console.log("Événement non géré :", event.type);
  }
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          console.error("Webhook reçu avec un paramètre env invalide :", rawEnv);
          return Response.json({ received: true, ignored: "invalid env" });
        }
        const env: StripeEnv = rawEnv;
        try {
          await handleWebhook(request, env);
          return Response.json({ received: true });
        } catch (e) {
          console.error("Erreur webhook :", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
