-- Séances découverte : créneaux, places limitées et inscriptions directes.

create table public.discovery_sessions (
  id uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null,
  day_label text not null,
  time_label text not null,
  location text not null,
  capacity integer not null default 6 check (capacity > 0),
  price_eur integer not null default 15 check (price_eur >= 0),
  stripe_url text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

GRANT SELECT ON public.discovery_sessions TO anon, authenticated;
GRANT ALL ON public.discovery_sessions TO service_role;

ALTER TABLE public.discovery_sessions ENABLE ROW LEVEL SECURITY;

create policy "Les séances découverte sont publiques"
  on public.discovery_sessions for select
  to anon, authenticated
  using (is_active);

create table public.discovery_bookings (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.discovery_sessions(id) on delete cascade,
  full_name text not null check (char_length(trim(full_name)) >= 2),
  email text not null check (email ~* '^[^@[:space:]]+@[^@[:space:]]+\\.[^@[:space:]]+$'),
  phone text,
  created_at timestamptz not null default now()
);

create unique index discovery_bookings_session_email_key
  on public.discovery_bookings (session_id, email);
create index discovery_bookings_session_idx
  on public.discovery_bookings (session_id);

-- Coordonnées personnelles : aucune lecture directe, même authentifiée.
GRANT ALL ON public.discovery_bookings TO service_role;

ALTER TABLE public.discovery_bookings ENABLE ROW LEVEL SECURITY;

-- Le nombre de places prises est seul exposé au public, jamais les coordonnées.
create or replace view public.discovery_availability as
  select
    s.id as session_id,
    s.capacity,
    count(b.id)::integer as booked,
    greatest(s.capacity - count(b.id)::integer, 0) as remaining
  from public.discovery_sessions s
  left join public.discovery_bookings b on b.session_id = s.id
  group by s.id;

GRANT SELECT ON public.discovery_availability TO anon, authenticated;

-- Inscription atomique : verrou par séance, plafond de 6 contrôlé à l'insertion.
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

insert into public.discovery_sessions (id, starts_at, day_label, time_label, location, capacity, price_eur, stripe_url)
values
  ('11111111-1111-4111-8111-111111111101', '2026-09-28 18:30:00+02', 'Lundi 28 septembre', '18h30 – 19h30', 'Cosec de Kaysersberg', 6, 15, 'https://buy.stripe.com/14AfZh3nB50l2f00hU6sw04'),
  ('11111111-1111-4111-8111-111111111102', '2026-09-30 17:00:00+02', 'Mercredi 30 septembre', '17h00 – 18h00', 'Basket Center de Strasbourg', 6, 15, 'https://buy.stripe.com/14AfZh3nB50l2f00hU6sw04')
on conflict (id) do nothing;