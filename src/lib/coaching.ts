import { supabase } from "@/integrations/supabase/client";

/**
 * Créneaux réguliers : essai et abonnement partagent les 6 places.
 * Appels directs depuis le navigateur (le site est hébergé en statique).
 */

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export type BookingType = "trial" | "subscription";

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
  | "rejected";

export type CoachingResult = { ok: true } | { ok: false; reason: CoachingReason };

export async function listCoachingSlots(): Promise<CoachingSlot[]> {
  const { data, error } = await supabase
    .from("coaching_availability")
    .select("*")
    .order("day_order", { ascending: true });
  if (error) throw error;

  return (data ?? []).flatMap((row) =>
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
          },
        ]
      : [],
  );
}

export async function bookCoachingSlot(input: {
  slotId: string;
  type: BookingType;
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

  const { data, error } = await supabase.rpc("book_coaching_slot", {
    p_slot_id: input.slotId,
    p_booking_type: input.type,
    p_full_name: fullName,
    p_email: email,
    ...(phone ? { p_phone: phone } : {}),
  });
  if (error) throw error;

  const outcome = (data ?? {}) as { ok?: boolean; reason?: string };
  if (outcome.ok) return { ok: true };
  return { ok: false, reason: (outcome.reason as CoachingReason) ?? "rejected" };
}
