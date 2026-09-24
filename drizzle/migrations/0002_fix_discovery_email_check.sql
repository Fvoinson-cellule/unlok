-- Le contrôle d'email était trop strict (échappement regex) : on le remplace par une vérification simple,
-- la validation complète restant côté application.
alter table public.discovery_bookings
  drop constraint if exists discovery_bookings_email_check;

alter table public.discovery_bookings
  add constraint discovery_bookings_email_check
  check (position('@' in email) > 1 and position('.' in split_part(email, '@', 2)) > 0);