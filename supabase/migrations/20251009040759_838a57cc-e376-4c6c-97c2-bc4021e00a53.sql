-- Add registration type and Google Form URL to seminars table
ALTER TABLE seminars 
ADD COLUMN registration_type text NOT NULL DEFAULT 'website',
ADD COLUMN google_form_url text;

-- Add constraint to ensure registration_type is either 'website' or 'google_form'
ALTER TABLE seminars
ADD CONSTRAINT registration_type_check CHECK (registration_type IN ('website', 'google_form'));