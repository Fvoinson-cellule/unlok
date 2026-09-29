ALTER VIEW public.coaching_upcoming_sessions SET (security_invoker = false, security_barrier = true);
ALTER VIEW public.coaching_availability SET (security_invoker = false, security_barrier = true);