-- 0013 : la place n'est confirmée qu'après paiement ; annulation d'abonnement libère la place
ALTER TABLE public.coaching_bookings
  ADD COLUMN IF NOT EXISTS paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS pending_card_type text,
  ADD COLUMN IF NOT EXISTS checkout_session_id text,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text;

-- Réservations créées avant ce changement : considérées comme payées.
UPDATE public.coaching_bookings SET paid_at = created_at WHERE paid_at IS NULL;

CREATE OR REPLACE FUNCTION public.book_coaching_session(
  p_slot_id uuid,
  p_booking_type text,
  p_session_date date,
  p_full_name text,
  p_email text,
  p_phone text DEFAULT NULL::text
)
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

  -- Une place est occupée si la réservation est payée, ou en attente de
  -- paiement depuis moins de 30 minutes (délai de réservation).
  SELECT count(*) INTO v_taken
  FROM public.coaching_bookings b
  WHERE b.slot_id = p_slot_id
    AND (b.paid_at IS NOT NULL OR b.created_at > now() - interval '30 minutes')
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
        AND (b.paid_at IS NOT NULL OR b.created_at > now() - interval '30 minutes')
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

  -- Séance déjà réservée sur cette date avec une carte (payée ou en attente).
  IF EXISTS (
    SELECT 1 FROM public.coaching_bookings b
    WHERE b.slot_id = p_slot_id AND b.email = v_email
      AND b.booking_type = 'card' AND b.session_date = v_session_date
      AND (b.paid_at IS NOT NULL OR b.created_at > now() - interval '30 minutes')
  ) THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'duplicate');
  END IF;

  IF p_booking_type IN ('card5', 'card10') THEN
    -- La carte n'est créée qu'après le paiement (confirm_paid_booking).
    INSERT INTO public.coaching_bookings (slot_id, booking_type, session_date, full_name, email, phone, pending_card_type)
    VALUES (
      p_slot_id, 'card', v_session_date, v_name, v_email, v_phone, p_booking_type
    )
    RETURNING * INTO v_booking;

    RETURN jsonb_build_object(
      'ok', true, 'booking_id', v_booking.id, 'booking_type', p_booking_type,
      'session_date', v_session_date, 'taken', v_taken + 1, 'capacity', v_capacity,
      'card_remaining', NULL::integer, 'card_expires_on', NULL::text
    );
  END IF;

  -- card_session : la séance est décomptée immédiatement (déjà payée avec la carte).
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

  INSERT INTO public.coaching_bookings (slot_id, booking_type, session_date, full_name, email, phone, card_id, paid_at)
  VALUES (p_slot_id, 'card', v_session_date, v_name, v_email, v_phone, v_card_id, now())
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

-- Confirmation après paiement : appelée uniquement par le webhook.
CREATE OR REPLACE FUNCTION public.confirm_paid_booking(
  p_booking_id uuid,
  p_checkout_session_id text,
  p_amount_cents integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_booking public.coaching_bookings;
  v_card public.coaching_cards;
  v_today date := (now() AT TIME ZONE 'Europe/Paris')::date;
BEGIN
  SELECT * INTO v_booking FROM public.coaching_bookings WHERE id = p_booking_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_found');
  END IF;

  IF v_booking.paid_at IS NOT NULL THEN
    RETURN jsonb_build_object('ok', true, 'already_paid', true);
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext(v_booking.slot_id::text || coalesce(v_booking.session_date::text, '')));

  UPDATE public.coaching_bookings
  SET paid_at = now(), checkout_session_id = p_checkout_session_id
  WHERE id = p_booking_id
  RETURNING * INTO v_booking;

  IF v_booking.pending_card_type IN ('card5', 'card10') THEN
    INSERT INTO public.coaching_cards (email, full_name, phone, card_type, total_sessions, used_sessions, price_eur, expires_on)
    VALUES (
      v_booking.email, v_booking.full_name, v_booking.phone, v_booking.pending_card_type,
      CASE WHEN v_booking.pending_card_type = 'card5' THEN 5 ELSE 10 END,
      1,
      GREATEST(coalesce(p_amount_cents, 0), 0) / 100,
      v_today + interval '5 months'
    )
    RETURNING * INTO v_card;

    UPDATE public.coaching_bookings SET card_id = v_card.id WHERE id = p_booking_id;

    RETURN jsonb_build_object(
      'ok', true,
      'card_id', v_card.id,
      'card_remaining', v_card.total_sessions - v_card.used_sessions,
      'card_expires_on', v_card.expires_on
    );
  END IF;

  RETURN jsonb_build_object('ok', true);
END;
$function$;
REVOKE EXECUTE ON FUNCTION public.confirm_paid_booking(uuid, text, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_paid_booking(uuid, text, integer) TO service_role;

-- Annulation d'abonnement : libère la place réservée.
CREATE OR REPLACE FUNCTION public.release_subscription_booking(p_booking_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  DELETE FROM public.coaching_bookings
  WHERE id = p_booking_id AND booking_type = 'subscription';
  RETURN jsonb_build_object('ok', true, 'released', FOUND);
END;
$function$;
REVOKE EXECUTE ON FUNCTION public.release_subscription_booking(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.release_subscription_booking(uuid) TO service_role;

-- Les vues ne comptent que les places confirmées (payées) ou en attente de
-- paiement depuis moins de 30 minutes.
CREATE OR REPLACE VIEW public.coaching_availability
WITH (security_invoker = true) AS
WITH rolling_slots AS (
  SELECT s.id,
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
    s.is_active,
    s.created_at,
    s.season_ends_on,
    s.excluded_dates,
    CASE
      WHEN s.next_session_at IS NULL THEN NULL::timestamptz
      WHEN s.next_session_at >= now() THEN s.next_session_at
      ELSE s.next_session_at + ceil(EXTRACT(epoch FROM now() - s.next_session_at) / 604800.0)::integer * interval '7 days'
    END AS effective_session_at
  FROM coaching_slots s
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
  s.booking_open AND s.effective_session_at IS NOT NULL
    AND (s.season_ends_on IS NULL OR (s.effective_session_at AT TIME ZONE 'Europe/Paris')::date <= s.season_ends_on) AS booking_open,
  counts.booked,
  GREATEST(s.capacity - counts.booked, 0) AS remaining,
  s.season_ends_on
FROM rolling_slots s
CROSS JOIN LATERAL (
  SELECT count(*)::integer AS booked
  FROM coaching_bookings b
  WHERE b.slot_id = s.id
    AND (b.paid_at IS NOT NULL OR b.created_at > now() - interval '30 minutes')
    AND (b.booking_type = 'subscription' OR (b.booking_type IN ('trial', 'card') AND b.session_date = (s.effective_session_at AT TIME ZONE 'Europe/Paris')::date))
) counts
WHERE s.is_active;

DROP VIEW public.coaching_upcoming_sessions;
CREATE VIEW public.coaching_upcoming_sessions
WITH (security_invoker = true) AS
WITH rolling AS (
  SELECT s.id,
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
    s.is_active,
    s.created_at,
    s.season_ends_on,
    s.excluded_dates,
    CASE
      WHEN s.next_session_at IS NULL THEN NULL::timestamptz
      WHEN s.next_session_at >= now() THEN s.next_session_at
      ELSE s.next_session_at + ceil(EXTRACT(epoch FROM now() - s.next_session_at) / 604800.0)::integer * interval '7 days'
    END AS base_at
  FROM coaching_slots s
  WHERE s.is_active AND s.booking_open
),
occurrences AS (
  SELECT r.id AS slot_id, r.base_at + g.i * interval '7 days' AS session_at
  FROM rolling r
  CROSS JOIN generate_series(0, 9) g(i)
  WHERE r.base_at IS NOT NULL
),
valid AS (
  SELECT o.slot_id,
    o.session_at,
    (o.session_at AT TIME ZONE 'Europe/Paris')::date AS session_date,
    row_number() OVER (PARTITION BY o.slot_id ORDER BY o.session_at) AS position
  FROM occurrences o
  JOIN rolling r ON r.id = o.slot_id
  WHERE NOT ((o.session_at AT TIME ZONE 'Europe/Paris')::date = ANY (r.excluded_dates))
    AND (r.season_ends_on IS NULL OR (o.session_at AT TIME ZONE 'Europe/Paris')::date <= r.season_ends_on)
)
SELECT r.id AS slot_id,
  r.day_order,
  v.session_at,
  v.session_date,
  v.position::integer AS position,
  r.capacity,
  counts.booked,
  GREATEST(r.capacity - counts.booked, 0) AS remaining
FROM rolling r
JOIN valid v ON v.slot_id = r.id AND v.position <= 2
CROSS JOIN LATERAL (
  SELECT count(*)::integer AS booked
  FROM coaching_bookings b
  WHERE b.slot_id = r.id
    AND (b.paid_at IS NOT NULL OR b.created_at > now() - interval '30 minutes')
    AND (b.booking_type = 'subscription' OR (b.booking_type IN ('trial', 'card') AND b.session_date = v.session_date))
) counts;

GRANT SELECT ON public.coaching_availability TO anon, authenticated;
GRANT SELECT ON public.coaching_upcoming_sessions TO anon, authenticated;