-- Create site_settings table for global configuration
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read settings (public data)
CREATE POLICY "Anyone can view site settings" 
ON public.site_settings 
FOR SELECT 
USING (true);

-- Only allow managing site settings (this is admin-only, no auth yet)
CREATE POLICY "Anyone can manage site settings" 
ON public.site_settings 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Insert default setting for seminar visibility
INSERT INTO public.site_settings (setting_key, setting_value) 
VALUES ('seminar_section_visible', '{"visible": false}')
ON CONFLICT (setting_key) DO NOTHING;

-- Add trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();