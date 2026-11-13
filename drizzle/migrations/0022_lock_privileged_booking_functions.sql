REVOKE EXECUTE ON FUNCTION public.book_coaching_session(uuid,text,date,text,text,text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_card_balance(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.confirm_paid_booking(uuid,text,integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.release_subscription_booking(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.book_coaching_session(uuid,text,date,text,text,text) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_card_balance(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.confirm_paid_booking(uuid,text,integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.release_subscription_booking(uuid) TO service_role;