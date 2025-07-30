-- Create tutors table
CREATE TABLE public.tutors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  school TEXT NOT NULL,
  specialty TEXT NOT NULL,
  rating DECIMAL(2,1) NOT NULL DEFAULT 5.0,
  students INTEGER NOT NULL DEFAULT 0,
  experience TEXT NOT NULL,
  bio TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  availability BOOLEAN NOT NULL DEFAULT true,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create seminars table
CREATE TABLE public.seminars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  speaker TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  audience TEXT NOT NULL,
  registered INTEGER NOT NULL DEFAULT 0,
  capacity INTEGER NOT NULL DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seminars ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view tutors" 
ON public.tutors 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view seminars" 
ON public.seminars 
FOR SELECT 
USING (true);

-- For now, allow anyone to insert/update/delete (we can restrict this later with proper admin auth)
CREATE POLICY "Anyone can manage tutors" 
ON public.tutors 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Anyone can manage seminars" 
ON public.seminars 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_tutors_updated_at
  BEFORE UPDATE ON public.tutors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_seminars_updated_at
  BEFORE UPDATE ON public.seminars
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();