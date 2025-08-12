-- Fix critical security vulnerability: Remove overly permissive site_settings policy
-- This policy allows anyone to modify critical site configuration
DROP POLICY IF EXISTS "Anyone can manage site settings" ON public.site_settings;

-- Keep the view policy for reading settings
-- Keep the admin-only policy for modifications
-- This ensures only admins can modify site settings while anyone can read them