DROP INDEX public.coaching_bookings_trial_email_key;

CREATE UNIQUE INDEX coaching_bookings_trial_email_key
ON public.coaching_bookings (slot_id, email)
WHERE booking_type = 'trial';

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
      OR (b.booking_type = 'trial' AND b.session_date = v_session_date)
    );

  IF v_taken >= v_capacity THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'full');
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.coaching_bookings b
    WHERE b.slot_id = p_slot_id
      AND b.email = v_email
      AND b.booking_type = p_booking_type
  ) THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'duplicate');
  END IF;

  INSERT INTO public.coaching_bookings (
    slot_id, booking_type, session_date, full_name, email, phone
  ) VALUES (
    p_slot_id,
    p_booking_type,
    CASE WHEN p_booking_type = 'trial' THEN v_session_date ELSE NULL END,
    v_name,
    v_email,
    v_phone
  )
  RETURNING * INTO v_booking;

  RETURN jsonb_build_object(
    'ok', true,
    'booking_id', v_booking.id,
    'booking_type', p_booking_type,
    'session_date', v_session_date,
    'taken', v_taken + 1,
    'capacity', v_capacity
  );
END;
$function$;