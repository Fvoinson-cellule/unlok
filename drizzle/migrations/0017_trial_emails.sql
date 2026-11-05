CREATE TABLE public.trial_emails (
  email text PRIMARY KEY,
  checkout_session_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.trial_emails TO service_role;
ALTER TABLE public.trial_emails ENABLE ROW LEVEL SECURITY;