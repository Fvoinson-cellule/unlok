CREATE TABLE public.customers (
  id uuid primary key default gen_random_uuid(),
  segment text not null check (segment in ('coach','club','joueur')),
  email text not null,
  name text,
  detail text,
  amount_cents integer,
  source_id text unique,
  created_at timestamptz not null default now()
);
GRANT ALL ON public.customers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 60),
  role text check (char_length(role) <= 60),
  rating integer not null check (rating between 1 and 5),
  message text not null check (char_length(message) between 5 and 800),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);
GRANT SELECT, INSERT ON public.reviews TO anon, authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Avis validés publics" ON public.reviews FOR SELECT TO anon, authenticated USING (approved);
CREATE POLICY "Tout le monde peut laisser un avis" ON public.reviews FOR INSERT TO anon, authenticated WITH CHECK (approved = false);

CREATE OR REPLACE FUNCTION public.club_lead_to_customer() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.customers(segment, email, detail, source_id, created_at)
  VALUES ('club', lower(NEW.email), NEW.club, 'club:' || NEW.id, NEW.created_at)
  ON CONFLICT (source_id) DO NOTHING;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_club_lead_customer AFTER INSERT ON public.club_guide_leads
FOR EACH ROW EXECUTE FUNCTION public.club_lead_to_customer();

INSERT INTO public.customers(segment, email, detail, source_id, created_at)
SELECT 'club', lower(email), club, 'club:' || id, created_at FROM public.club_guide_leads
ON CONFLICT (source_id) DO NOTHING;