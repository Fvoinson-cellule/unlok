CREATE TABLE public.club_guide_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL CHECK (char_length(email) BETWEEN 5 AND 200 AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  club text CHECK (club IS NULL OR char_length(club) <= 120),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.club_guide_leads TO anon, authenticated;
GRANT ALL ON public.club_guide_leads TO service_role;
ALTER TABLE public.club_guide_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can request the guide" ON public.club_guide_leads FOR INSERT TO anon, authenticated WITH CHECK (true);