ALTER TABLE public.coaching_bookings
  DROP CONSTRAINT IF EXISTS coaching_bookings_booking_type_check;

ALTER TABLE public.coaching_bookings
  ADD CONSTRAINT coaching_bookings_booking_type_check
  CHECK (booking_type IN ('trial', 'subscription', 'card'));