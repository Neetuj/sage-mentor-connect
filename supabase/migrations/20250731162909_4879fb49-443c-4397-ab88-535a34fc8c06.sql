-- Update RLS policies for submissions to allow deletion
DROP POLICY IF EXISTS "Anyone can insert submissions" ON public.submissions;
DROP POLICY IF EXISTS "Anyone can view submissions" ON public.submissions;

-- Create new policies
CREATE POLICY "Anyone can insert submissions" 
ON public.submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view submissions" 
ON public.submissions 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can delete submissions" 
ON public.submissions 
FOR DELETE 
USING (true);