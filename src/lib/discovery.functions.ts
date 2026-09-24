import { createClient } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { Database } from "@/integrations/supabase/types";

/**
 * Séances découverte : lecture des créneaux et inscription directe, sans
 * compte à créer. Les coordonnées restent lisibles uniquement côté serveur,
 * le public ne voit que le nombre de places restantes.
 */

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const bookingSchema = z.object({
  sessionId: z.string().uuid(),
  fullName: z.string().trim().min(2, "Indique ton prénom et ton nom.").max(80),
  email: z
    .string()
    .trim()
    .max(160)
    .regex(EMAIL_PATTERN, "Cette adresse email semble incomplète."),
  phone: z.string().trim().max(20),
  // Champ piège : un visiteur réel ne le remplit jamais.
  website: z.string().max(0).optional(),
});

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

function publicClient() {
  return createClient<Database>(
    process.env["SUPABASE_URL"]!,
    process.env["SUPABASE_PUBLISHABLE_KEY"]!,
    {
      auth: {
        storage: undefined,
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}

export const listDiscoverySessions = createServerFn({ method: "GET" }).handler(
  async (): Promise<DiscoverySession[]> => {
    const supabase = publicClient();

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
  },
);

export const bookDiscoverySession = createServerFn({ method: "POST" })
  .validator((data: unknown) => bookingSchema.parse(data))
  .handler(async ({ data }): Promise<BookingResult> => {
    if (data.website) return { ok: false, reason: "rejected" };

    const supabase = publicClient();

    const { data: result, error } = await supabase.rpc(
      "book_discovery_session",
      {
        p_session_id: data.sessionId,
        p_full_name: data.fullName,
        p_email: data.email,
        p_phone: data.phone || undefined,
      },
    );

    if (error) throw error;

    const outcome = (result ?? {}) as {
      ok?: boolean;
      reason?: string;
      remaining?: number;
    };

    if (!outcome.ok) {
      const reason = outcome.reason as BookingReason | undefined;
      return {
        ok: false,
        reason: reason && reason !== "missing_fields" ? reason : "not_found",
      };
    }

    const { data: session, error: sessionError } = await supabase
      .from("discovery_availability")
      .select("day_label, time_label, location, price_eur, stripe_url, remaining")
      .eq("session_id", data.sessionId)
      .maybeSingle();

    if (sessionError) throw sessionError;

    return {
      ok: true,
      remaining: session?.remaining ?? outcome.remaining ?? 0,
      session: {
        dayLabel: session?.day_label ?? "",
        timeLabel: session?.time_label ?? "",
        location: session?.location ?? "",
        priceEur: session?.price_eur ?? 15,
        stripeUrl: session?.stripe_url ?? "",
      },
    };
  });
