ALTER TABLE public.coaching_slots
  ADD COLUMN season_ends_on date;

CREATE OR REPLACE VIEW public.coaching_availability
WITH (security_invoker = true)
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

CREATE OR REPLACE FUNCTION public.book_coaching_slot(
  p_slot_id uuid,
  p_booking_type text,
  p_full_name text,
  p_email text,
  p_phone text DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_slot public.coaching_slots;
  v_effective_session_at timestamptz;
  v_taken integer;
  v_email text := lower(trim(coalesce(p_email, '')));
  v_name text := trim(coalesce(p_full_name, ''));
  v_phone text := nullif(trim(coalesce(p_phone, '')), '');
  v_session_date date;
  v_booking public.coaching_bookings;
BEGIN
  IF p_booking_type NOT IN ('trial', 'subscription') THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid_type');
  END IF;

  IF v_name = '' OR v_email = '' THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'missing_fields');
  END IF;

  IF position(' ' in v_email) > 0
     OR position('@' in v_email) < 2
     OR position('.' in split_part(v_email, '@', 2)) < 1 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid_email');
  END IF;

  SELECT * INTO v_slot
  FROM public.coaching_slots
  WHERE id = p_slot_id AND is_active;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_found');
  END IF;

  IF NOT v_slot.booking_open OR v_slot.next_session_at IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'schedule_pending');
  END IF;

  v_effective_session_at := CASE
    WHEN v_slot.next_session_at >= now() THEN v_slot.next_session_at
    ELSE v_slot.next_session_at
      + ceil(extract(epoch FROM (now() - v_slot.next_session_at)) / 604800.0)::integer * interval '7 days'
  END;

  IF v_slot.season_ends_on IS NOT NULL
     AND (v_effective_session_at AT TIME ZONE 'Europe/Paris')::date > v_slot.season_ends_on THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'season_ended');
  END IF;

  v_session_date := CASE
    WHEN p_booking_type = 'trial'
      THEN (v_effective_session_at AT TIME ZONE 'Europe/Paris')::date
    ELSE NULL
  END;

  PERFORM pg_advisory_xact_lock(hashtext(p_slot_id::text));

  SELECT count(*) INTO v_taken
  FROM public.coaching_bookings
  WHERE slot_id = p_slot_id
    AND (
      booking_type = 'subscription'
      OR (booking_type = 'trial' AND session_date = (v_effective_session_at AT TIME ZONE 'Europe/Paris')::date)
    );

  IF v_taken >= v_slot.capacity THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'full');
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.coaching_bookings
    WHERE slot_id = p_slot_id
      AND email = v_email
      AND (
        (p_booking_type = 'subscription' AND booking_type = 'subscription')
        OR (
          p_booking_type = 'trial'
          AND booking_type = 'trial'
          AND session_date = v_session_date
        )
      )
  ) THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'duplicate');
  END IF;

  INSERT INTO public.coaching_bookings (
    slot_id,
    booking_type,
    session_date,
    full_name,
    email,
    phone
  ) VALUES (
    p_slot_id,
    p_booking_type,
    v_session_date,
    v_name,
    v_email,
    v_phone
  )
  RETURNING * INTO v_booking;

  RETURN jsonb_build_object(
    'ok', true,
    'booking_id', v_booking.id,
    'booking_type', p_booking_type,
    'taken', v_taken + 1,
    'capacity', v_slot.capacity
  );
END;
$$;

REVOKE ALL ON FUNCTION public.book_coaching_slot(uuid, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.book_coaching_slot(uuid, text, text, text, text) TO anon, authenticated;