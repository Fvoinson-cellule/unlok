-- Le contrôle d'email en base était trop strict et faisait échouer l'inscription :
-- on le retire, la forme de l'email est désormais vérifiée dans la fonction d'inscription,
-- qui renvoie un message clair au lieu de bloquer l'écriture.

alter table public.discovery_bookings
  drop constraint if exists discovery_bookings_email_check;

create or replace function public.book_discovery_session(
  p_session_id uuid,
  p_full_name text,
  p_email text,
  p_phone text default null
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_session public.discovery_sessions;
  v_taken integer;
  v_email text := lower(trim(coalesce(p_email, '')));
  v_name text := trim(coalesce(p_full_name, ''));
  v_phone text := nullif(trim(coalesce(p_phone, '')), '');
  v_booking public.discovery_bookings;
begin
  if v_name = '' or v_email = '' then
    return jsonb_build_object('ok', false, 'reason', 'missing_fields');
  end if;

  if position(' ' in v_email) > 0
     or position('@' in v_email) < 2
     or position('.' in split_part(v_email, '@', 2)) < 1 then
    return jsonb_build_object('ok', false, 'reason', 'invalid_email');
  end if;

  select * into v_session
  from public.discovery_sessions
  where id = p_session_id and is_active;

  if not found then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;

  if v_session.starts_at < now() then
    return jsonb_build_object('ok', false, 'reason', 'past');
  end if;

  perform pg_advisory_xact_lock(hashtext(p_session_id::text));

  select count(*) into v_taken
  from public.discovery_bookings
  where session_id = p_session_id;

  if v_taken >= v_session.capacity then
    return jsonb_build_object('ok', false, 'reason', 'full');
  end if;

  if exists (
    select 1 from public.discovery_bookings
    where session_id = p_session_id and email = v_email
  ) then
    return jsonb_build_object('ok', false, 'reason', 'duplicate');
  end if;

  insert into public.discovery_bookings (session_id, full_name, email, phone)
  values (p_session_id, v_name, v_email, v_phone)
  returning * into v_booking;

  return jsonb_build_object(
    'ok', true,
    'booking_id', v_booking.id,
    'taken', v_taken + 1,
    'capacity', v_session.capacity
  );
end;
$$;

REVOKE ALL ON FUNCTION public.book_discovery_session(uuid, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.book_discovery_session(uuid, text, text, text) TO anon, authenticated;