-- Create partners table
CREATE TABLE public.partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text NOT NULL,
  website_url text,
  display_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Anyone can view visible partners" ON public.partners
  FOR SELECT TO public USING (is_visible = true);

-- Admin manage
CREATE POLICY "Only admins can manage partners" ON public.partners
  FOR ALL TO public USING (is_admin()) WITH CHECK (is_admin());

-- Updated at trigger
CREATE TRIGGER update_partners_updated_at
  BEFORE UPDATE ON public.partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for partner logos
INSERT INTO storage.buckets (id, name, public) VALUES ('partner-logos', 'partner-logos', true);

-- Storage policies
CREATE POLICY "Anyone can view partner logos" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'partner-logos');

CREATE POLICY "Admins can upload partner logos" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'partner-logos' AND is_admin());

CREATE POLICY "Admins can delete partner logos" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'partner-logos' AND is_admin());