-- Update RLS policy to allow public read access for admin functionality
DROP POLICY "Authenticated users can view submissions" ON public.submissions;

-- Create new policy that allows anyone to view submissions (for admin access)
CREATE POLICY "Anyone can view submissions" 
ON public.submissions 
FOR SELECT 
USING (true);