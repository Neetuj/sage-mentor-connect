-- Create submissions table for storing form data
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_type TEXT NOT NULL CHECK (form_type IN ('student', 'tutor', 'volunteer')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  school TEXT,
  grade_level TEXT,
  interests TEXT,
  additional_info TEXT,
  parent_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert submissions (for public form access)
CREATE POLICY "Anyone can insert submissions" 
ON public.submissions 
FOR INSERT 
WITH CHECK (true);

-- Only authenticated users can view submissions (for admin access later)
CREATE POLICY "Authenticated users can view submissions" 
ON public.submissions 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Create index for better query performance
CREATE INDEX idx_submissions_form_type ON public.submissions(form_type);
CREATE INDEX idx_submissions_created_at ON public.submissions(created_at DESC);