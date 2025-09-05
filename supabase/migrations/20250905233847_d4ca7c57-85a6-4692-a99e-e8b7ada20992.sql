-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  organization TEXT,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_visible BOOLEAN NOT NULL DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies for testimonials access
CREATE POLICY "Anyone can view visible testimonials" 
ON public.testimonials 
FOR SELECT 
USING (is_visible = true);

CREATE POLICY "Only admins can manage testimonials" 
ON public.testimonials 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample testimonials
INSERT INTO public.testimonials (name, role, organization, content, rating) VALUES 
('Sarah Johnson', 'Parent', 'Lincoln Elementary', 'SAGE has been incredible for my daughter. Her tutor helped her fall in love with math and science. The program is well-organized and the tutors are amazing!', 5),
('David Chen', 'Student', '7th Grade', 'My tutor made engineering so fun! I learned how to build robots and now I want to be an engineer when I grow up.', 5),
('Maria Rodriguez', 'Teacher', 'Roosevelt Middle School', 'I recommend SAGE to all my students. The tutors are knowledgeable, patient, and really care about helping kids succeed.', 5),
('Alex Thompson', 'Parent', 'Washington Elementary', 'The difference in my son''s confidence and grades has been remarkable since he started with SAGE. Highly recommended!', 5);