-- Create table for site statistics
CREATE TABLE public.site_stats (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stat_key text NOT NULL UNIQUE,
  stat_value text NOT NULL,
  stat_label text NOT NULL,
  icon_name text NOT NULL DEFAULT 'Users',
  display_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view visible stats"
ON public.site_stats
FOR SELECT
USING (is_visible = true);

CREATE POLICY "Only admins can manage stats"
ON public.site_stats
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Create trigger for updated_at
CREATE TRIGGER update_site_stats_updated_at
BEFORE UPDATE ON public.site_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create table for featured quotes
CREATE TABLE public.featured_quotes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_text text NOT NULL,
  author_name text NOT NULL,
  author_role text NOT NULL,
  author_organization text,
  display_order integer NOT NULL DEFAULT 0,
  is_featured boolean NOT NULL DEFAULT false,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.featured_quotes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view visible quotes"
ON public.featured_quotes
FOR SELECT
USING (is_visible = true);

CREATE POLICY "Only admins can manage quotes"
ON public.featured_quotes
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Create trigger for updated_at
CREATE TRIGGER update_featured_quotes_updated_at
BEFORE UPDATE ON public.featured_quotes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default stats
INSERT INTO public.site_stats (stat_key, stat_value, stat_label, icon_name, display_order) VALUES
  ('students_impacted', '500', 'Students Impacted', 'GraduationCap', 1),
  ('workshops_held', '25', 'Workshops Held', 'Presentation', 2),
  ('volunteer_hours', '1000', 'Volunteer Hours', 'Clock', 3);