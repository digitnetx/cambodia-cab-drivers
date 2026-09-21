-- Allow the driver profile manager to keep small photos directly in PostgreSQL.
-- URL and Supabase Storage image options continue to use the existing *_url columns.
ALTER TABLE public.driver_profiles
  ADD COLUMN IF NOT EXISTS profile_photo_data BYTEA,
  ADD COLUMN IF NOT EXISTS profile_photo_mime TEXT DEFAULT 'image/jpeg',
  ADD COLUMN IF NOT EXISTS cover_photo_data BYTEA,
  ADD COLUMN IF NOT EXISTS cover_photo_mime TEXT DEFAULT 'image/jpeg';

NOTIFY pgrst, 'reload schema';
