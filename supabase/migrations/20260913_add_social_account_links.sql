ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS facebook_url TEXT,
  ADD COLUMN IF NOT EXISTS google_business_url TEXT,
  ADD COLUMN IF NOT EXISTS tripadvisor_url TEXT,
  ADD COLUMN IF NOT EXISTS facebook_urls JSONB NOT NULL DEFAULT '[]'::jsonb;

UPDATE public.site_settings
SET
  google_business_url = 'https://share.google/dsFHrDxmgPsNMddXF',
  facebook_url = 'https://www.facebook.com/share/1GJ3q4juxH/',
  facebook_urls = '["https://www.facebook.com/share/1RuymZzgiW/", "https://www.facebook.com/share/1EPMmamLiA/"]'::jsonb,
  tripadvisor_url = 'https://www.tripadvisor.com/Attraction_Review-g293940-d12293659-Reviews-Cambodia_cab_drivers-Phnom_Penh.html';

NOTIFY pgrst, 'reload schema';
