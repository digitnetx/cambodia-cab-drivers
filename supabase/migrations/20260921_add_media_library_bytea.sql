-- Media Library: accept external URLs, Supabase Storage URLs, or direct BYTEA uploads.
-- Safe to run once in the Supabase SQL Editor before deploying the dashboard update.

ALTER TABLE public.media_files
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS binary_data BYTEA,
  ADD COLUMN IF NOT EXISTS mime_type TEXT,
  ADD COLUMN IF NOT EXISTS storage_type TEXT NOT NULL DEFAULT 'url';

ALTER TABLE public.media_files
  DROP CONSTRAINT IF EXISTS media_files_storage_type_check;

ALTER TABLE public.media_files
  ADD CONSTRAINT media_files_storage_type_check
  CHECK (storage_type IN ('url', 'bytea', 'supabase_storage'));
