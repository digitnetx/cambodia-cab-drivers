ALTER TABLE public.routes
  ADD COLUMN IF NOT EXISTS image_data BYTEA,
  ADD COLUMN IF NOT EXISTS image_mime TEXT DEFAULT 'image/jpeg';

ALTER TABLE public.vehicles
  ADD COLUMN IF NOT EXISTS image_data BYTEA,
  ADD COLUMN IF NOT EXISTS image_mime TEXT DEFAULT 'image/jpeg';

ALTER TABLE public.airports
  ADD COLUMN IF NOT EXISTS image_data BYTEA,
  ADD COLUMN IF NOT EXISTS image_mime TEXT DEFAULT 'image/jpeg';

NOTIFY pgrst, 'reload schema';
