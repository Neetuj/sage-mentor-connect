-- Add image fields to seminars table and make date nullable for TBD functionality
ALTER TABLE public.seminars 
ADD COLUMN topic_image_url text,
ADD COLUMN host_image_url text;