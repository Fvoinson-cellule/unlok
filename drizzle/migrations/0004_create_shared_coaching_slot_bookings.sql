CREATE TABLE public.coaching_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_label text NOT NULL,
  time_label text NOT NULL,
  location text NOT NULL,
  day_order integer NOT NULL,
  next_session_at timestamptz,
  capacity integer NOT NULL DEFAULT 6 CHECK (capacity > 0),
  trial_price_eur integer NOT NULL DEFAULT 15 CHECK (trial_price_eur >= 0),
  trial_stripe_url text NOT NULL,
  subscription_price_eur integer NOT NULL DEFAULT 100 CHECK (subscription_price_eur >= 0),
  subscription_stripe_url text NOT NULL,
  booking_open boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.coaching_slots TO anon, authenticated;
GRANT ALL ON public.coaching_slots TO service_role;

ALTER TABLE public.coaching_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les créneaux de coaching sont publics"
  ON public.coaching_slots FOR SELECT
  TO anon, authenticated
  USING (is_active);

CREATE TABLE public.coaching_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id uuid NOT NULL REFERENCES public.coaching_slots(id) ON DELETE CASCADE,
  booking_type text NOT NULL CHECK (booking_type IN ('trial', 'subscription')),
  session_date date,
  full_name text NOT NULL CHECK (char_length(trim(full_name)) >= 2),
  email text NOT NULL,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (
    (booking_type = 'trial' AND session_date IS NOT NULL)
    OR (booking_type = 'subscription' AND session_date IS NULL)
  )
);

GRANT ALL ON public.coaching_bookings TO service_role;

ALTER TABLE public.coaching_bookings ENABLE ROW LEVEL SECURITY;

CREATE INDEX coaching_bookings_slot_idx
  ON public.coaching_bookings (slot_id);
CREATE UNIQUE INDEX coaching_bookings_subscription_email_key
  ON public.coaching_bookings (slot_id, email)
  WHERE booking_type = 'subscription';
CREATE UNIQUE INDEX coaching_bookings_trial_email_key
  ON public.coaching_bookings (slot_id, session_date, email)
  WHERE booking_type = 'trial';

CREATE VIEW public.coaching_availability
WITH (security_invoker = true)
AS
  SELECT
    s.id AS slot_id,
    s.day_label,
    s.time_label,
    s.location,
    s.day_order,
    s.next_session_at,
    s.capacity,
    s.trial_price_eur,
    s.trial_stripe_url,
    s.subscription_price_eur,
    s.subscription_stripe_url,
    s.booking_open,
    count(b.id) FILTER (
      WHERE b.booking_type = 'subscription'
         OR (
           b.booking_type = 'trial'
           AND b.session_date = (s.next_session_at AT TIME ZONE 'Europe/Paris')::date
         )
    )::integer AS booked,
    greatest(
      s.capacity - count(b.id) FILTER (
        WHERE b.booking_type = 'subscription'
           OR (
             b.booking_type = 'trial'
             AND b.session_date = (s.next_session_at AT TIME ZONE 'Europe/Paris')::date
           )
      )::integer,
      0
    ) AS remaining
  FROM public.coaching_slots s
  LEFT JOIN public.coaching_bookings b ON b.slot_id = s.id
  WHERE s.is_active
  GROUP BY s.id;

GRANT SELECT ON public.coaching_availability TO anon, authenticated;

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

  IF v_slot.next_session_at < now() THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'past');
  END IF;

  v_session_date := CASE
    WHEN p_booking_type = 'trial'
      THEN (v_slot.next_session_at AT TIME ZONE 'Europe/Paris')::date
    ELSE NULL
  END;

  PERFORM pg_advisory_xact_lock(hashtext(p_slot_id::text));

  SELECT count(*) INTO v_taken
  FROM public.coaching_bookings
  WHERE slot_id = p_slot_id
    AND (
      booking_type = 'subscription'
      OR (booking_type = 'trial' AND session_date = (v_slot.next_session_at AT TIME ZONE 'Europe/Paris')::date)
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