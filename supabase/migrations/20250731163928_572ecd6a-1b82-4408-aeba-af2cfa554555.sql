-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create secure RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing dangerous RLS policies
DROP POLICY IF EXISTS "Anyone can manage seminars" ON public.seminars;
DROP POLICY IF EXISTS "Anyone can view seminars" ON public.seminars;
DROP POLICY IF EXISTS "Anyone can manage site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Anyone can view site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Anyone can delete submissions" ON public.submissions;
DROP POLICY IF EXISTS "Anyone can insert submissions" ON public.submissions;
DROP POLICY IF EXISTS "Anyone can view submissions" ON public.submissions;
DROP POLICY IF EXISTS "Anyone can manage tutors" ON public.tutors;
DROP POLICY IF EXISTS "Anyone can view tutors" ON public.tutors;

-- Create secure RLS policies for seminars
CREATE POLICY "Anyone can view seminars" 
ON public.seminars 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage seminars" 
ON public.seminars 
FOR ALL 
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Create secure RLS policies for tutors
CREATE POLICY "Anyone can view tutors" 
ON public.tutors 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage tutors" 
ON public.tutors 
FOR ALL 
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Create secure RLS policies for submissions
CREATE POLICY "Anyone can submit forms" 
ON public.submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only admins can view submissions" 
ON public.submissions 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Only admins can delete submissions" 
ON public.submissions 
FOR DELETE 
USING (public.is_admin());

-- Create secure RLS policies for site_settings
CREATE POLICY "Anyone can view site settings" 
ON public.site_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage site settings" 
ON public.site_settings 
FOR ALL 
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create trigger for profile updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();