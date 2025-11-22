-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('team-profile-images', 'team-profile-images', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  ('event-images', 'event-images', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  ('seminar-images', 'seminar-images', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);

-- RLS policies for team profile images
CREATE POLICY "Anyone can view team profile images"
ON storage.objects FOR SELECT
USING (bucket_id = 'team-profile-images');

CREATE POLICY "Admins can upload team profile images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'team-profile-images' 
  AND is_admin()
);

CREATE POLICY "Admins can update team profile images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'team-profile-images' 
  AND is_admin()
);

CREATE POLICY "Admins can delete team profile images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'team-profile-images' 
  AND is_admin()
);

-- RLS policies for event images
CREATE POLICY "Anyone can view event images"
ON storage.objects FOR SELECT
USING (bucket_id = 'event-images');

CREATE POLICY "Admins can upload event images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'event-images' 
  AND is_admin()
);

CREATE POLICY "Admins can update event images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'event-images' 
  AND is_admin()
);

CREATE POLICY "Admins can delete event images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'event-images' 
  AND is_admin()
);

-- RLS policies for seminar images
CREATE POLICY "Anyone can view seminar images"
ON storage.objects FOR SELECT
USING (bucket_id = 'seminar-images');

CREATE POLICY "Admins can upload seminar images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'seminar-images' 
  AND is_admin()
);

CREATE POLICY "Admins can update seminar images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'seminar-images' 
  AND is_admin()
);

CREATE POLICY "Admins can delete seminar images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'seminar-images' 
  AND is_admin()
);