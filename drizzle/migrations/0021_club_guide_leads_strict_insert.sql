DROP POLICY IF EXISTS "Anyone can request the guide" ON public.club_guide_leads;
CREATE POLICY "Anyone can request the guide" ON public.club_guide_leads FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(email) BETWEEN 5 AND 200
  AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND (club IS NULL OR char_length(club) <= 120)
);