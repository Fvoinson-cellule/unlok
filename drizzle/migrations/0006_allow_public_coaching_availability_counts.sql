CREATE OR REPLACE VIEW public.coaching_availability
WITH (security_invoker = false, security_barrier = true)
AS
  WITH rolling_slots AS (
    SELECT
      s.*,
      CASE
        WHEN s.next_session_at IS NULL THEN NULL
        WHEN s.next_session_at >= now() THEN s.next_session_at
        ELSE s.next_session_at
          + ceil(extract(epoch FROM (now() - s.next_session_at)) / 604800.0)::integer * interval '7 days'
      END AS effective_session_at
    FROM public.coaching_slots s
  )
  SELECT
    s.id AS slot_id,
    s.day_label,
    s.time_label,
    s.location,
    s.day_order,
    s.effective_session_at AS next_session_at,
    s.capacity,
    s.trial_price_eur,
    s.trial_stripe_url,
    s.subscription_price_eur,
    s.subscription_stripe_url,
    (
      s.booking_open
      AND s.effective_session_at IS NOT NULL
      AND (s.season_ends_on IS NULL OR (s.effective_session_at AT TIME ZONE 'Europe/Paris')::date <= s.season_ends_on)
    ) AS booking_open,
    counts.booked,
    greatest(s.capacity - counts.booked, 0) AS remaining,
    s.season_ends_on
  FROM rolling_slots s
  CROSS JOIN LATERAL (
    SELECT count(*)::integer AS booked
    FROM public.coaching_bookings b
    WHERE b.slot_id = s.id
      AND (
        b.booking_type = 'subscription'
        OR (
          b.booking_type = 'trial'
          AND b.session_date = (s.effective_session_at AT TIME ZONE 'Europe/Paris')::date
        )
      )
  ) counts
  WHERE s.is_active;

GRANT SELECT ON public.coaching_availability TO anon, authenticated;