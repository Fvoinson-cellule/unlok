-- Cartes de séances (5 ou 10) avec décompte automatique du solde
CREATE TABLE IF NOT EXISTS public.coaching_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  full_name text NOT NULL,
  phone text,
  card_type text NOT NULL CHECK (card_type IN ('card5', 'card10')),
  total_sessions integer NOT NULL,
  used_sessions integer NOT NULL DEFAULT 0,
  price_eur integer NOT NULL,
  expires_on date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.coaching_cards TO service_role;
ALTER TABLE public.coaching_cards ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS coaching_cards_email_idx ON public.coaching_cards (email);

-- Les réservations consommant une carte
ALTER TABLE public.coaching_bookings
  ADD COLUMN IF NOT EXISTS card_id uuid REFERENCES public.coaching_cards(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS coaching_bookings_card_unique
  ON public.coaching_bookings (slot_id, session_date, email)
  WHERE booking_type = 'card';

-- Les cartes comptent une place sur la date réservée
CREATE OR REPLACE VIEW public.coaching_availability
WITH (security_invoker = true) AS
WITH rolling_slots AS (
  SELECT s_1.*,
    CASE
      WHEN (s_1.next_session_at IS NULL) THEN NULL::timestamptz
      WHEN (s_1.next_session_at >= now()) THEN s_1.next_session_at
      ELSE (s_1.next_session_at + (((ceil((EXTRACT(epoch FROM (now() - s_1.next_session_at)) / 604800.0)))::integer)::double precision * '7 days'::interval))
    END AS effective_session_at
  FROM public.coaching_slots s_1
)
SELECT s.id AS slot_id,
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
  (s.booking_open AND (s.effective_session_at IS NOT NULL) AND ((s.season_ends_on IS NULL) OR (((s.effective_session_at AT TIME ZONE 'Europe/Paris'))::date <= s.season_ends_on))) AS booking_open,
  counts.booked,
  GREATEST((s.capacity - counts.booked), 0) AS remaining,
  s.season_ends_on
FROM (rolling_slots s
  CROSS JOIN LATERAL ( SELECT (count(*))::integer AS booked
      FROM public.coaching_bookings b
      WHERE ((b.slot_id = s.id) AND ((b.booking_type = 'subscription')
        OR (b.booking_type IN ('trial', 'card') AND (b.session_date = ((s.effective_session_at AT TIME ZONE 'Europe/Paris'))::date))))) counts)
WHERE s.is_active;

CREATE OR REPLACE VIEW public.coaching_upcoming_sessions
WITH (security_invoker = true) AS
WITH rolling AS (
  SELECT s.*,
    CASE
      WHEN (s.next_session_at IS NULL) THEN NULL::timestamptz
      WHEN (s.next_session_at >= now()) THEN s.next_session_at
      ELSE (s.next_session_at + (((ceil((EXTRACT(epoch FROM (now() - s.next_session_at)) / 604800.0)))::integer)::double precision * '7 days'::interval))
    END AS base_at
  FROM public.coaching_slots s
  WHERE (s.is_active AND s.booking_open)
), occurrences AS (
  SELECT r_1.id AS slot_id,
    (r_1.base_at + ((g.i)::double precision * '7 days'::interval)) AS session_at
  FROM (rolling r_1 CROSS JOIN generate_series(0, 9) g(i))
  WHERE (r_1.base_at IS NOT NULL)
), valid AS (
  SELECT o.slot_id,
    o.session_at,
    ((o.session_at AT TIME ZONE 'Europe/Paris'))::date AS session_date,
    row_number() OVER (PARTITION BY o.slot_id ORDER BY o.session_at) AS "position"
  FROM (occurrences o JOIN rolling r_1 ON ((r_1.id = o.slot_id)))
  WHERE ((NOT (((o.session_at AT TIME ZONE 'Europe/Paris'))::date = ANY (r_1.excluded_dates)))
    AND ((r_1.season_ends_on IS NULL) OR (((o.session_at AT TIME ZONE 'Europe/Paris'))::date <= r_1.season_ends_on)))
)
SELECT r.id AS slot_id,
  r.day_order,
  v.session_at,
  v.session_date,
  (v."position")::integer AS "position",
  r.capacity,
  counts.booked,
  GREATEST((r.capacity - counts.booked), 0) AS remaining
FROM ((rolling r
  JOIN valid v ON (((v.slot_id = r.id) AND (v."position" <= 2))))
  CROSS JOIN LATERAL ( SELECT (count(*))::integer AS booked
      FROM public.coaching_bookings b
      WHERE ((b.slot_id = r.id) AND ((b.booking_type = 'subscription')
        OR (b.booking_type IN ('trial', 'card') AND (b.session_date = v.session_date))))) counts);

-- Solde public d'une carte, consultable par email
CREATE OR REPLACE FUNCTION public.get_card_balance(p_email text)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_email text := lower(trim(coalesce(p_email, '')));
  v_remaining integer;
  v_expires date;
  v_name text;
BEGIN
  IF v_email = '' THEN
    RETURN jsonb_build_object('found', false);
  END IF;

  SELECT coalesce(sum(c.total_sessions - c.used_sessions), 0)::integer,
         max(c.expires_on),
         max(c.full_name)
    INTO v_remaining, v_expires, v_name
  FROM public.coaching_cards c
  WHERE c.email = v_email
    AND c.expires_on >= (now() AT TIME ZONE 'Europe/Paris')::date
    AND c.used_sessions < c.total_sessions;

  IF v_expires IS NULL THEN
    RETURN jsonb_build_object('found', false);
  END IF;

  RETURN jsonb_build_object(
    'found', true,
    'remaining', v_remaining,
    'expires_on', v_expires,
    'full_name', v_name
  );
END;
$function$;

GRANT EXECUTE ON FUNCTION public.get_card_balance(text) TO anon, authenticated;

-- Réservation : essai, abonnement, achat de carte (5/10) et utilisation du solde
CREATE OR REPLACE FUNCTION public.book_coaching_session(p_slot_id uuid, p_booking_type text, p_session_date date, p_full_name text, p_email text, p_phone text DEFAULT NULL::text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_slot public.coaching_slots;
  v_taken integer;
  v_capacity integer;
  v_email text := lower(trim(coalesce(p_email, '')));
  v_name text := trim(coalesce(p_full_name, ''));
  v_phone text := nullif(trim(coalesce(p_phone, '')), '');
  v_session_date date;
  v_booking public.coaching_bookings;
  v_card public.coaching_cards;
  v_card_id uuid;
  v_card_remaining integer;
  v_card_expires date;
  v_today date := (now() AT TIME ZONE 'Europe/Paris')::date;
BEGIN
  IF p_booking_type NOT IN ('trial', 'subscription', 'card5', 'card10', 'card_session') THEN
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

  SELECT * INTO v_slot FROM public.coaching_slots WHERE id = p_slot_id AND is_active;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_found');
  END IF;

  IF NOT v_slot.booking_open OR v_slot.next_session_at IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'schedule_pending');
  END IF;

  SELECT u.session_date, u.capacity INTO v_session_date, v_capacity
  FROM public.coaching_upcoming_sessions u
  WHERE u.slot_id = p_slot_id
    AND (p_session_date IS NULL OR u.session_date = p_session_date)
  ORDER BY u.position
  LIMIT 1;

  IF v_session_date IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'past');
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext(p_slot_id::text || v_session_date::text));

  SELECT count(*) INTO v_taken
  FROM public.coaching_bookings b
  WHERE b.slot_id = p_slot_id
    AND (
      b.booking_type = 'subscription'
      OR (b.booking_type IN ('trial', 'card') AND b.session_date = v_session_date)
    );

  IF v_taken >= v_capacity THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'full');
  END IF;

  IF p_booking_type IN ('trial', 'subscription') THEN
    IF EXISTS (
      SELECT 1 FROM public.coaching_bookings b
      WHERE b.slot_id = p_slot_id AND b.email = v_email AND b.booking_type = p_booking_type
    ) THEN
      RETURN jsonb_build_object('ok', false, 'reason', 'duplicate');
    END IF;

    INSERT INTO public.coaching_bookings (slot_id, booking_type, session_date, full_name, email, phone)
    VALUES (
      p_slot_id,
      p_booking_type,
      CASE WHEN p_booking_type = 'trial' THEN v_session_date ELSE NULL END,
      v_name, v_email, v_phone
    )
    RETURNING * INTO v_booking;

    RETURN jsonb_build_object(
      'ok', true, 'booking_id', v_booking.id, 'booking_type', p_booking_type,
      'session_date', v_session_date, 'taken', v_taken + 1, 'capacity', v_capacity
    );
  END IF;

  -- Les séances déjà réservées sur cette date avec une carte
  IF EXISTS (
    SELECT 1 FROM public.coaching_bookings b
    WHERE b.slot_id = p_slot_id AND b.email = v_email
      AND b.booking_type = 'card' AND b.session_date = v_session_date
  ) THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'duplicate');
  END IF;

  IF p_booking_type IN ('card5', 'card10') THEN
    INSERT INTO public.coaching_cards (email, full_name, phone, card_type, total_sessions, used_sessions, price_eur, expires_on)
    VALUES (
      v_email, v_name, v_phone, p_booking_type,
      CASE WHEN p_booking_type = 'card5' THEN 5 ELSE 10 END,
      1,
      CASE WHEN p_booking_type = 'card5' THEN 250 ELSE 400 END,
      v_today + interval '5 months'
    )
    RETURNING * INTO v_card;

    v_card_id := v_card.id;
    v_card_remaining := v_card.total_sessions - v_card.used_sessions;
    v_card_expires := v_card.expires_on;
  ELSE
    SELECT * INTO v_card
    FROM public.coaching_cards c
    WHERE c.email = v_email
      AND c.expires_on >= v_session_date
      AND c.used_sessions < c.total_sessions
    ORDER BY c.expires_on
    LIMIT 1
    FOR UPDATE;

    IF NOT FOUND THEN
      RETURN jsonb_build_object('ok', false, 'reason', 'no_card');
    END IF;

    UPDATE public.coaching_cards
    SET used_sessions = used_sessions + 1
    WHERE id = v_card.id
    RETURNING * INTO v_card;

    v_card_id := v_card.id;
    v_card_expires := v_card.expires_on;

    SELECT coalesce(sum(c.total_sessions - c.used_sessions), 0)::integer INTO v_card_remaining
    FROM public.coaching_cards c
    WHERE c.email = v_email
      AND c.expires_on >= v_today
      AND c.used_sessions < c.total_sessions;
  END IF;

  INSERT INTO public.coaching_bookings (slot_id, booking_type, session_date, full_name, email, phone, card_id)
  VALUES (p_slot_id, 'card', v_session_date, v_name, v_email, v_phone, v_card_id)
  RETURNING * INTO v_booking;

  RETURN jsonb_build_object(
    'ok', true,
    'booking_id', v_booking.id,
    'booking_type', p_booking_type,
    'session_date', v_session_date,
    'taken', v_taken + 1,
    'capacity', v_capacity,
    'card_remaining', v_card_remaining,
    'card_expires_on', v_card_expires
  );
END;
$function$;

GRANT EXECUTE ON FUNCTION public.book_coaching_session(uuid, text, date, text, text, text) TO anon, authenticated;