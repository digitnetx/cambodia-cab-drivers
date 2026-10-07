-- Makes the Website Settings and SEO Settings pages persist every field they edit.
-- Safe to run more than once in Supabase Dashboard -> SQL Editor.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS tagline TEXT,
  ADD COLUMN IF NOT EXISTS working_hours TEXT,
  ADD COLUMN IF NOT EXISTS emergency_contact TEXT,
  ADD COLUMN IF NOT EXISTS primary_color TEXT,
  ADD COLUMN IF NOT EXISTS accent_color TEXT,
  ADD COLUMN IF NOT EXISTS booking_form_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS currency_settings JSONB NOT NULL DEFAULT '{"default_currency":"USD","currency_symbol":"$","supported_currencies":["USD"]}'::jsonb,
  ADD COLUMN IF NOT EXISTS footer_description TEXT,
  ADD COLUMN IF NOT EXISTS copyright_text TEXT,
  ADD COLUMN IF NOT EXISTS tiktok_url TEXT,
  ADD COLUMN IF NOT EXISTS youtube_url TEXT,
  ADD COLUMN IF NOT EXISTS google_business_url TEXT,
  ADD COLUMN IF NOT EXISTS tripadvisor_url TEXT;

CREATE TABLE IF NOT EXISTS public.seo_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meta_title TEXT NOT NULL DEFAULT 'Cambodia Taxi Cab — Private Taxi & Tour Driver Service in Cambodia',
  meta_description TEXT NOT NULL DEFAULT 'Book reliable private taxi transfers, airport pickups, and custom sightseeing tours in Cambodia.',
  keywords TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  canonical_url TEXT,
  index_site BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.seo_settings
  ADD COLUMN IF NOT EXISTS og_title TEXT,
  ADD COLUMN IF NOT EXISTS og_description TEXT,
  ADD COLUMN IF NOT EXISTS og_image TEXT,
  ADD COLUMN IF NOT EXISTS canonical_url TEXT,
  ADD COLUMN IF NOT EXISTS index_site BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Do not seed a row here. The dashboard inserts the complete current form on
-- its first successful save, which works with both existing and new projects.

ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'seo_settings' AND policyname = 'Public read SEO settings'
  ) THEN
    CREATE POLICY "Public read SEO settings" ON public.seo_settings FOR SELECT USING (TRUE);
  END IF;

  IF to_regprocedure('public.is_admin()') IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public' AND tablename = 'seo_settings' AND policyname = 'Admins have full access'
    ) THEN
    CREATE POLICY "Admins have full access" ON public.seo_settings
      FOR ALL TO authenticated
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  ELSIF to_regprocedure('public.is_admin()') IS NULL
    AND to_regclass('public.profiles') IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public' AND tablename = 'seo_settings' AND policyname = 'Admin full SEO settings manage'
    ) THEN
    CREATE POLICY "Admin full SEO settings manage" ON public.seo_settings
      FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')))
      WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
  END IF;
END $$;

NOTIFY pgrst, 'reload schema';
