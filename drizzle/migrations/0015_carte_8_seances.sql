-- Carte 8 séances vendue par lien de paiement privé (non affichée sur le site)
ALTER TABLE public.coaching_cards ADD COLUMN IF NOT EXISTS checkout_session_id text UNIQUE;
--> statement-breakpoint
ALTER TABLE public.coaching_cards DROP CONSTRAINT IF EXISTS coaching_cards_card_type_check;
--> statement-breakpoint
ALTER TABLE public.coaching_cards
  ADD CONSTRAINT coaching_cards_card_type_check CHECK (card_type IN ('card5', 'card8', 'card10'));
--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.credit_link_card(
  p_email text,
  p_full_name text,
  p_card_type text,
  p_sessions integer,
  p_amount_cents integer,
  p_checkout_session_id text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_email text := lower(trim(coalesce(p_email, '')));
  v_card public.coaching_cards;
BEGIN
  IF v_email = '' OR p_card_type NOT IN ('card5', 'card8', 'card10') OR coalesce(p_sessions, 0) <= 0 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid');
  END IF;
  PERFORM pg_advisory_xact_lock(hashtext(coalesce(p_checkout_session_id, '')));
  IF EXISTS (SELECT 1 FROM public.coaching_cards WHERE checkout_session_id = p_checkout_session_id) THEN
    RETURN jsonb_build_object('ok', true, 'already', true);
  END IF;
  INSERT INTO public.coaching_cards (email, full_name, card_type, total_sessions, used_sessions, price_eur, expires_on, checkout_session_id)
  VALUES (v_email, coalesce(nullif(trim(p_full_name), ''), v_email), p_card_type, p_sessions, 0,
          GREATEST(coalesce(p_amount_cents, 0), 0) / 100,
          (now() AT TIME ZONE 'Europe/Paris')::date + interval '5 months',
          p_checkout_session_id)
  RETURNING * INTO v_card;
  RETURN jsonb_build_object('ok', true, 'card_id', v_card.id);
END;
$function$;
--> statement-breakpoint
REVOKE EXECUTE ON FUNCTION public.credit_link_card(text, text, text, integer, integer, text) FROM PUBLIC, anon, authenticated;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION public.credit_link_card(text, text, text, integer, integer, text) TO service_role;
