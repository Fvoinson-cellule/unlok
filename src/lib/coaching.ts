import { supabase } from "@/integrations/supabase/client";

/**
 * Créneaux réguliers : essai et abonnement partagent les 6 places.
 * Appels directs depuis le navigateur (le site est hébergé en statique).
 */

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export type BookingType = "trial" | "subscription" | "card5" | "card10" | "card_session";

export const CARD_OFFERS = {
  card5: {
    label: "Carte 5 séances",
    price: 250,
    sessions: 5,
    unit: "50 € / séance",
    stripeUrl: "https://buy.stripe.com/fZu14n5vJ78t9Hsd4G6sw01",
  },
  card10: {
    label: "Carte 10 séances",
    price: 400,
    sessions: 10,
    unit: "40 € / séance",
    stripeUrl: "https://buy.stripe.com/cNidR9gancsN1aWaWy6sw02",
  },
} as const;

export type CardBalance =
  | { found: false }
  | { found: true; remaining: number; expiresOn: string; fullName: string };

export async function getCardBalance(email: string): Promise<CardBalance> {
  const { data, error } = await supabase.rpc("get_card_balance", { p_email: email.trim() });
  if (error) throw error;
  const row = (data ?? {}) as {
    found?: boolean;
    remaining?: number;
    expires_on?: string;
    full_name?: string;
  };
  if (!row.found) return { found: false };
  return {
    found: true,
    remaining: row.remaining ?? 0,
    expiresOn: row.expires_on ?? "",
    fullName: row.full_name ?? "",
  };
}

export type CoachingSession = {
  date: string;
  at: string;
  capacity: number;
  booked: number;
  remaining: number;
};

export type CoachingSlot = {
  id: string;
  dayLabel: string;
  timeLabel: string;
  location: string;
  nextSessionAt: string | null;
  bookingOpen: boolean;
  capacity: number;
  booked: number;
  remaining: number;
  trialPrice: number;
  trialUrl: string;
  subscriptionPrice: number;
  subscriptionUrl: string;
  sessions: CoachingSession[];
};

export type CoachingReason =
  | "full"
  | "duplicate"
  | "past"
  | "not_found"
  | "missing_fields"
  | "invalid_email"
  | "invalid_type"
  | "schedule_pending"
  | "season_ended"
  | "no_card"
  | "rejected";

export type CoachingResult =
  | { ok: true; cardRemaining: number | null; cardExpiresOn: string | null }
  | { ok: false; reason: CoachingReason };

export async function listCoachingSlots(): Promise<CoachingSlot[]> {
  const [slotsRes, sessionsRes] = await Promise.all([
    supabase.from("coaching_availability").select("*").order("day_order", { ascending: true }),
    supabase.from("coaching_upcoming_sessions").select("*").order("position", { ascending: true }),
  ]);
  if (slotsRes.error) throw slotsRes.error;
  if (sessionsRes.error) throw sessionsRes.error;

  const sessionsBySlot = new Map<string, CoachingSession[]>();
  for (const row of sessionsRes.data ?? []) {
    if (!row.slot_id || !row.session_date) continue;
    const list = sessionsBySlot.get(row.slot_id) ?? [];
    list.push({
      date: row.session_date,
      at: row.session_at ?? row.session_date,
      capacity: row.capacity ?? 6,
      booked: row.booked ?? 0,
      remaining: row.remaining ?? 0,
    });
    sessionsBySlot.set(row.slot_id, list);
  }

  return (slotsRes.data ?? []).flatMap((row) =>
    row.slot_id && row.day_label
      ? [
          {
            id: row.slot_id,
            dayLabel: row.day_label,
            timeLabel: row.time_label ?? "Horaire à définir",
            location: row.location ?? "",
            nextSessionAt: row.next_session_at,
            bookingOpen: Boolean(row.booking_open),
            capacity: row.capacity ?? 6,
            booked: row.booked ?? 0,
            remaining: row.remaining ?? 0,
            trialPrice: row.trial_price_eur ?? 15,
            trialUrl: row.trial_stripe_url ?? "",
            subscriptionPrice: row.subscription_price_eur ?? 100,
            subscriptionUrl: row.subscription_stripe_url ?? "",
            sessions: sessionsBySlot.get(row.slot_id) ?? [],
          },
        ]
      : [],
  );
}

export async function bookCoachingSlot(input: {
  slotId: string;
  type: BookingType;
  sessionDate: string | null;
  fullName: string;
  email: string;
  phone: string;
  website: string;
}): Promise<CoachingResult> {
  if (input.website) return { ok: false, reason: "rejected" };
  const fullName = input.fullName.trim().slice(0, 80);
  const email = input.email.trim().slice(0, 160);
  const phone = input.phone.trim().slice(0, 20);
  if (fullName.length < 2) return { ok: false, reason: "missing_fields" };
  if (!EMAIL_PATTERN.test(email)) return { ok: false, reason: "invalid_email" };

  const { data, error } = await supabase.rpc("book_coaching_session", {
    p_slot_id: input.slotId,
    p_booking_type: input.type,
    p_session_date: input.sessionDate as string,
    p_full_name: fullName,
    p_email: email,
    ...(phone ? { p_phone: phone } : {}),
  });
  if (error) throw error;

  const outcome = (data ?? {}) as {
    ok?: boolean;
    reason?: string;
    card_remaining?: number;
    card_expires_on?: string;
  };
  if (outcome.ok) {
    return {
      ok: true,
      cardRemaining: outcome.card_remaining ?? null,
      cardExpiresOn: outcome.card_expires_on ?? null,
    };
  }
  return { ok: false, reason: (outcome.reason as CoachingReason) ?? "rejected" };
}
