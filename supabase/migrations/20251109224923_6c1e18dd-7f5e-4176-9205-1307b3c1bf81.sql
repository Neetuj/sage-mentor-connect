-- Add city and state columns to submissions table
ALTER TABLE public.submissions 
ADD COLUMN city text,
ADD COLUMN state text;