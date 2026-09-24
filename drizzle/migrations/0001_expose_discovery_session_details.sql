-- La vue publique expose désormais les informations d'une séance avec ses places restantes.
drop view if exists public.discovery_availability;

create view public.discovery_availability as
  select
    s.id as session_id,
    s.starts_at,
    s.day_label,
    s.time_label,
    s.location,
    s.capacity,
    s.price_eur,
    s.stripe_url,
    count(b.id)::integer as booked,
    greatest(s.capacity - count(b.id)::integer, 0) as remaining
  from public.discovery_sessions s
  left join public.discovery_bookings b on b.session_id = s.id
  where s.is_active
  group by s.id;

GRANT SELECT ON public.discovery_availability TO anon, authenticated;