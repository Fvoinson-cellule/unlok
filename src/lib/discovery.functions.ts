import { supabase } from "@/integrations/supabase/client";

/**
 * Séances découverte : appels directs à la base depuis le navigateur, pour
 * fonctionner aussi sur un hébergement statique (GitHub Pages). Les
 * coordonnées ne sont jamais lisibles publiquement : seule la vue des places
 * restantes l'est, et l'inscription passe par une fonction sécurisée.
 */

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export type DiscoverySession = {
  id: string;
  startsAt: string;
  dayLabel: string;
  timeLabel: string;
  location: string;
  capacity: number;
  priceEur: number;
  stripeUrl: string;
  booked: number;
  remaining: number;
};

export type BookingReason =
  | "full"
  | "duplicate"
  | "past"
  | "not_found"
  | "missing_fields"
  | "invalid_email"
  | "rejected";

export type BookingResult =
  | {
      ok: true;
      remaining: number;
      session: {
        dayLabel: string;
        timeLabel: string;
        location: string;
        priceEur: number;
        stripeUrl: string;
      };
    }
  | { ok: false; reason: BookingReason };

export async function listDiscoverySessions(): Promise<DiscoverySession[]> {
  const { data, error } = await supabase
    .from("discovery_availability")
    .select(
      "session_id, starts_at, day_label, time_label, location, capacity, price_eur, stripe_url, booked, remaining",
    )
    .gt("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true });

  if (error) throw error;

  return (data ?? []).flatMap((row) => {
    if (
      !row.session_id ||
      !row.starts_at ||
      !row.day_label ||
      !row.time_label ||
      !row.location ||
      !row.stripe_url
    ) {
      return [];
    }
    return [
      {
        id: row.session_id,
        startsAt: row.starts_at,
        dayLabel: row.day_label,
        timeLabel: row.time_label,
        location: row.location,
        capacity: row.capacity ?? 6,
        priceEur: row.price_eur ?? 15,
        stripeUrl: row.stripe_url,
        booked: row.booked ?? 0,
        remaining: row.remaining ?? 0,
      },
    ];
  });
}

export async function bookDiscoverySession(input: {
  sessionId: string;
  fullName: string;
  email: string;
  phone: string;
  website: string;
}): Promise<BookingResult> {
  if (input.website) return { ok: false, reason: "rejected" };

  const fullName = input.fullName.trim().slice(0, 80);
  const email = input.email.trim().slice(0, 160);
  const phone = input.phone.trim().slice(0, 20);
  if (fullName.length < 2) return { ok: false, reason: "missing_fields" };
  if (!EMAIL_PATTERN.test(email)) return { ok: false, reason: "invalid_email" };

  const { data: result, error } = await supabase.rpc("book_discovery_session", {
    p_session_id: input.sessionId,
    p_full_name: fullName,
    p_email: email,
    ...(phone ? { p_phone: phone } : {}),
  });

  if (error) throw error;

  const outcome = (result ?? {}) as { ok?: boolean; reason?: string };
  if (!outcome.ok) {
    return {
      ok: false,
      reason: (outcome.reason as BookingReason | undefined) ?? "rejected",
    };
  }

  const { data: session } = await supabase
    .from("discovery_availability")
    .select("day_label, time_label, location, price_eur, stripe_url, remaining")
    .eq("session_id", input.sessionId)
    .maybeSingle();

  return {
    ok: true,
    remaining: session?.remaining ?? 0,
    session: {
      dayLabel: session?.day_label ?? "",
      timeLabel: session?.time_label ?? "",
      location: session?.location ?? "",
      priceEur: session?.price_eur ?? 15,
      stripeUrl:
        session?.stripe_url ?? "https://buy.stripe.com/14AfZh3nB50l2f00hU6sw04",
    },
  };
}
