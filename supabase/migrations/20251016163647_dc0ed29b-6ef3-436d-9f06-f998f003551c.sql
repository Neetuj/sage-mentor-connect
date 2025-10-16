-- Add explicit deny policy for unauthenticated access to profiles table
CREATE POLICY "Deny unauthenticated access to profiles"
ON public.profiles
AS RESTRICTIVE
FOR ALL
TO anon
USING (false);

-- Add explicit deny policy for non-admin access to submissions table (SELECT)
CREATE POLICY "Deny non-admin SELECT on submissions"
ON public.submissions
AS RESTRICTIVE
FOR SELECT
TO authenticated
USING (is_admin());

-- Add explicit deny policy for unauthenticated access to submissions table
-- Note: We need to allow INSERT for the submission form, but deny everything else
CREATE POLICY "Deny unauthenticated access to submissions except INSERT"
ON public.submissions
AS RESTRICTIVE
FOR ALL
TO anon
USING (false)
WITH CHECK (form_type IS NOT NULL);