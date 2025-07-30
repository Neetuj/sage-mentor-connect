-- Add 'seminar' to the allowed form_type values
ALTER TABLE public.submissions 
DROP CONSTRAINT submissions_form_type_check;

ALTER TABLE public.submissions 
ADD CONSTRAINT submissions_form_type_check 
CHECK (form_type = ANY (ARRAY['student'::text, 'tutor'::text, 'volunteer'::text, 'seminar'::text]));