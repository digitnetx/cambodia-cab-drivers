-- Run once in Supabase SQL Editor. Files live in Storage; database image columns keep their public URLs.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('site-media', 'site-media', true, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 5242880, allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Admins manage site media" ON storage.objects;
CREATE POLICY "Admins manage site media" ON storage.objects
FOR ALL TO authenticated
USING (bucket_id = 'site-media' AND public.is_admin())
WITH CHECK (bucket_id = 'site-media' AND public.is_admin());
