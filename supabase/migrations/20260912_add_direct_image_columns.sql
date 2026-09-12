-- Adds the database-image fields required by the CMS direct BYTEA upload option.
ALTER TABLE public.tours
  ADD COLUMN IF NOT EXISTS featured_image_data BYTEA,
  ADD COLUMN IF NOT EXISTS featured_image_mime TEXT DEFAULT 'image/jpeg';

ALTER TABLE public.destinations
  ADD COLUMN IF NOT EXISTS featured_image_data BYTEA,
  ADD COLUMN IF NOT EXISTS featured_image_mime TEXT DEFAULT 'image/jpeg';

ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS featured_image_data BYTEA,
  ADD COLUMN IF NOT EXISTS featured_image_mime TEXT DEFAULT 'image/jpeg';

-- Ask PostgREST to immediately recognise the new columns.
NOTIFY pgrst, 'reload schema';
