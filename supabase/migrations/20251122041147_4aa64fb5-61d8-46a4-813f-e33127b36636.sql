-- Create past_events table
CREATE TABLE public.past_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  summary TEXT NOT NULL,
  impact TEXT NOT NULL,
  attendees INTEGER NOT NULL DEFAULT 0,
  speaker TEXT,
  event_image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.past_events ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to visible events
CREATE POLICY "Anyone can view visible past events" 
ON public.past_events 
FOR SELECT 
USING (is_visible = true);

-- Create policies for admin management
CREATE POLICY "Only admins can manage past events" 
ON public.past_events 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_past_events_updated_at
BEFORE UPDATE ON public.past_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();