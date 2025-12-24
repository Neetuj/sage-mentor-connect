-- Add registration_status column to seminars table
ALTER TABLE public.seminars 
ADD COLUMN registration_status text NOT NULL DEFAULT 'open';

-- Add comment for documentation
COMMENT ON COLUMN public.seminars.registration_status IS 'Status of registration: open, not_open_yet, or closed';