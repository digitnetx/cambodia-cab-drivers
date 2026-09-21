-- Brings older Supabase projects in line with the current dashboard fields.
-- Safe to run more than once.

ALTER TABLE public.driver_profiles
  ADD COLUMN IF NOT EXISTS profile_photo_url TEXT,
  ADD COLUMN IF NOT EXISTS cover_photo_url TEXT,
  ADD COLUMN IF NOT EXISTS profile_photo_data BYTEA,
  ADD COLUMN IF NOT EXISTS profile_photo_mime TEXT DEFAULT 'image/jpeg',
  ADD COLUMN IF NOT EXISTS cover_photo_data BYTEA,
  ADD COLUMN IF NOT EXISTS cover_photo_mime TEXT DEFAULT 'image/jpeg';

ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS google_maps_url TEXT,
  ADD COLUMN IF NOT EXISTS google_business_url TEXT,
  ADD COLUMN IF NOT EXISTS tripadvisor_url TEXT,
  ADD COLUMN IF NOT EXISTS facebook_url TEXT,
  ADD COLUMN IF NOT EXISTS facebook_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS instagram_url TEXT,
  ADD COLUMN IF NOT EXISTS tiktok_url TEXT,
  ADD COLUMN IF NOT EXISTS telegram_url TEXT,
  ADD COLUMN IF NOT EXISTS youtube_url TEXT;

NOTIFY pgrst, 'reload schema';
