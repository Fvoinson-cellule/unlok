UPDATE public.coaching_slots
SET excluded_dates = ARRAY['2026-10-06', '2026-10-07']::date[]
WHERE location ILIKE '%Basket Center%';