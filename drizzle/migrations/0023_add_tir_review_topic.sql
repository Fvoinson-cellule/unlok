ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_topic_check;
ALTER TABLE public.reviews ADD CONSTRAINT reviews_topic_check CHECK (topic IN ('seances', 'ramp', 'tir'));