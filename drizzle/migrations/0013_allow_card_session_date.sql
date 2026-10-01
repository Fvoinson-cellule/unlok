ALTER TABLE public.coaching_bookings DROP CONSTRAINT IF EXISTS coaching_bookings_check;

ALTER TABLE public.coaching_bookings
  ADD CONSTRAINT coaching_bookings_check
  CHECK (
    (booking_type = 'trial' AND session_date IS NOT NULL)
    OR (booking_type = 'card' AND session_date IS NOT NULL)
    OR (booking_type = 'subscription' AND session_date IS NULL)
  );