-- Enable realtime for seminars table
ALTER TABLE public.seminars REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.seminars;

-- Enable realtime for tutors table  
ALTER TABLE public.tutors REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tutors;

-- Enable realtime for site_settings table
ALTER TABLE public.site_settings REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;