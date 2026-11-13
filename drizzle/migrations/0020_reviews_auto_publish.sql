ALTER TABLE public.reviews ALTER COLUMN approved SET DEFAULT true;
DROP POLICY IF EXISTS "Tout le monde peut laisser un avis" ON public.reviews;
CREATE POLICY "Tout le monde peut laisser un avis" ON public.reviews FOR INSERT TO anon, authenticated WITH CHECK (approved = true AND rating BETWEEN 1 AND 5 AND char_length(message) <= 800 AND char_length(name) <= 60);