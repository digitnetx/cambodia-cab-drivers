-- ==============================================================================
-- CAMBODIA CAB DRIVERS - ADVANCED SUPABASE POSTGRESQL SCHEMA & ENRICHED SEED DATA
-- Copy and paste this file into Supabase SQL Editor (Database -> SQL Editor)
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Automatic updated_at Trigger Function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ==============================================================================
-- 3. MEDIA LIBRARY TABLE (Dual Support: External URL, Supabase Storage Path & Raw Binary Bytea)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT NOT NULL,
    title TEXT,
    alt_text TEXT,
    mime_type TEXT DEFAULT 'image/jpeg',
    file_size_bytes BIGINT,
    storage_type TEXT NOT NULL DEFAULT 'url' CHECK (storage_type IN ('url', 'bytea', 'supabase_storage')),
    url TEXT,                      -- External or Supabase CDN URL
    storage_path TEXT,             -- Supabase Storage bucket path (e.g., 'transfers/sai-airport.jpg')
    binary_data BYTEA,             -- Direct database binary storage (Bytea option)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ==============================================================================
-- 4. SITE SETTINGS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name TEXT NOT NULL DEFAULT 'Cambodia Cab Drivers',
    driver_name TEXT NOT NULL DEFAULT 'Sareth',
    description TEXT,
    phone TEXT NOT NULL DEFAULT '+855 12 345 678',
    whatsapp TEXT NOT NULL DEFAULT '+85512345678',
    telegram TEXT DEFAULT '@sareth_cambodia_cab',
    email TEXT NOT NULL DEFAULT 'info@cambodiacabdrivers.com',
    address TEXT NOT NULL DEFAULT 'Siem Reap, Cambodia',
    google_maps_url TEXT NOT NULL DEFAULT 'https://maps.google.com/?q=Siem+Reap+Cambodia',
    logo_url TEXT,
    logo_data BYTEA,
    logo_mime TEXT DEFAULT 'image/png',
    favicon_url TEXT,
    facebook_url TEXT,
    instagram_url TEXT,
    telegram_url TEXT,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ==============================================================================
-- 5. TRANSFERS TABLE (PRIMARY SERVICE: Airport, Intercity, Hotel & Border Transfers)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,                                 -- e.g. "Siem Reap Airport (SAI) to Siem Reap City Center"
    slug TEXT UNIQUE NOT NULL,                            -- e.g. "sai-airport-to-siem-reap-city"
    origin TEXT NOT NULL,                                 -- e.g. "Siem Reap Angkor International Airport (SAI)"
    destination TEXT NOT NULL,                            -- e.g. "Siem Reap Hotel / Downtown"
    transfer_type TEXT NOT NULL DEFAULT 'airport' CHECK (transfer_type IN ('airport', 'intercity', 'hotel_transfer', 'border_crossing', 'custom')),
    vehicle_type TEXT NOT NULL DEFAULT 'SUV / Lexus Sedan',
    max_passengers INT DEFAULT 4 CHECK (max_passengers >= 1),
    max_luggage INT DEFAULT 4 CHECK (max_luggage >= 0),
    estimated_duration TEXT DEFAULT '45-60 mins',
    distance_km NUMERIC(8, 2),
    price_usd NUMERIC(10, 2) NOT NULL DEFAULT 35.00,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    highlights TEXT[] DEFAULT '{}',
    included TEXT[] DEFAULT '{}',
    excluded TEXT[] DEFAULT '{}',
    featured_image TEXT NOT NULL,                         -- Image URL
    featured_image_data BYTEA,                             -- Direct binary storage option
    featured_image_mime TEXT DEFAULT 'image/jpeg',
    gallery TEXT[] DEFAULT '{}',                           -- Array of image URLs
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ==============================================================================
-- 6. SERVICES TABLE (General Transport & Private Driver Services)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT DEFAULT 'Car',
    featured_image TEXT NOT NULL,             -- URL link or asset path
    featured_image_data BYTEA,                 -- Direct binary image backup/store
    featured_image_mime TEXT DEFAULT 'image/jpeg',
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ==============================================================================
-- 7. TOURS TABLE (Private Temple & Countryside Excursions)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.tours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    duration TEXT DEFAULT 'Full Day',
    pickup_location TEXT DEFAULT 'Siem Reap Hotel or SAI Airport',
    departure_time TEXT DEFAULT '05:00 AM',
    highlights TEXT[] DEFAULT '{}',
    itinerary JSONB DEFAULT '[]'::jsonb,
    included TEXT[] DEFAULT '{}',
    excluded TEXT[] DEFAULT '{}',
    important_information TEXT[] DEFAULT '{}',
    featured_image TEXT NOT NULL,             -- URL link
    featured_image_data BYTEA,                 -- Direct binary storage option
    featured_image_mime TEXT DEFAULT 'image/jpeg',
    gallery TEXT[] DEFAULT '{}',               -- Array of image URLs
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ==============================================================================
-- 8. DESTINATIONS TABLE (Siem Reap, Phnom Penh, Battambang, Kampot, Kep, Sihanoukville)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    things_to_do TEXT[] DEFAULT '{}',
    featured_image TEXT NOT NULL,             -- URL
    featured_image_data BYTEA,                 -- Binary image option
    featured_image_mime TEXT DEFAULT 'image/jpeg',
    gallery TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ==============================================================================
-- 9. GALLERY TABLE (High-Res Showcase Photos for Fleet, Tours & Destinations)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT DEFAULT 'vehicles' CHECK (category IN ('vehicles', 'tours', 'destinations', 'drivers', 'guests', 'general')),
    description TEXT,
    image_url TEXT NOT NULL,                              -- External or CDN URL
    image_data BYTEA,                                     -- Direct binary image option
    image_mime TEXT DEFAULT 'image/jpeg',
    storage_path TEXT,                                    -- Supabase storage path
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ==============================================================================
-- 10. TEAM & DRIVERS TABLE (Sareth & Professional Local Drivers)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.team (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Professional Private Driver',  -- e.g., 'Lead Driver & Guide'
    license_number TEXT,
    years_experience INT DEFAULT 5,
    languages TEXT[] DEFAULT '{"English", "Khmer"}',
    phone TEXT,
    whatsapp TEXT,
    telegram TEXT,
    bio TEXT,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    photo_url TEXT NOT NULL,                              -- URL
    photo_data BYTEA,                                     -- Binary option
    photo_mime TEXT DEFAULT 'image/jpeg',
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ==============================================================================
-- 11. BOOKINGS TABLE (Full Relational Foreign Keys for Transfers & Tours)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    transfer_id UUID REFERENCES public.transfers(id) ON DELETE SET NULL,
    transfer_title TEXT,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    service_name TEXT,
    tour_id UUID REFERENCES public.tours(id) ON DELETE SET NULL,
    tour_title TEXT,
    pickup_location TEXT NOT NULL,
    destination TEXT NOT NULL,
    travel_date DATE NOT NULL,
    pickup_time TEXT NOT NULL,
    passengers INT DEFAULT 1 CHECK (passengers >= 1),
    luggage INT DEFAULT 1 CHECK (luggage >= 0),
    flight_number TEXT,
    hotel_name TEXT,
    special_requests TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    admin_notes TEXT,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ==============================================================================
-- 12. REVIEWS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    country TEXT NOT NULL,
    rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    review TEXT NOT NULL,
    image_url TEXT,                           -- Customer avatar or review photo URL
    image_data BYTEA,                          -- Customer avatar binary option
    image_mime TEXT DEFAULT 'image/jpeg',
    is_published BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ==============================================================================
-- 13. CONTACT MESSAGES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ==============================================================================
-- 14. FAQS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    sort_order INT DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ==============================================================================
-- 15. PERFORMANCE INDEXES & FULL-TEXT SEARCH
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_transfers_slug ON public.transfers(slug);
CREATE INDEX IF NOT EXISTS idx_transfers_type ON public.transfers(transfer_type);
CREATE INDEX IF NOT EXISTS idx_transfers_active ON public.transfers(is_active);

CREATE INDEX IF NOT EXISTS idx_gallery_category ON public.gallery(category);
CREATE INDEX IF NOT EXISTS idx_team_active ON public.team(is_active);

CREATE INDEX IF NOT EXISTS idx_bookings_ref ON public.bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_travel_date ON public.bookings(travel_date);

CREATE INDEX IF NOT EXISTS idx_tours_slug ON public.tours(slug);
CREATE INDEX IF NOT EXISTS idx_tours_active_featured ON public.tours(is_active, is_featured);

CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_destinations_slug ON public.destinations(slug);

-- Full Text Search Index for Transfers and Tours
CREATE INDEX IF NOT EXISTS idx_transfers_fts ON public.transfers 
USING gin(to_tsvector('english', title || ' ' || origin || ' ' || destination || ' ' || short_description));

CREATE INDEX IF NOT EXISTS idx_tours_fts ON public.tours 
USING gin(to_tsvector('english', title || ' ' || short_description || ' ' || description));


-- ==============================================================================
-- 16. AUTOMATIC UPDATED_AT TRIGGERS
-- ==============================================================================
DROP TRIGGER IF EXISTS trg_media_files_updated ON public.media_files;
CREATE TRIGGER trg_media_files_updated BEFORE UPDATE ON public.media_files FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_site_settings_updated ON public.site_settings;
CREATE TRIGGER trg_site_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_transfers_updated ON public.transfers;
CREATE TRIGGER trg_transfers_updated BEFORE UPDATE ON public.transfers FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_services_updated ON public.services;
CREATE TRIGGER trg_services_updated BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_tours_updated ON public.tours;
CREATE TRIGGER trg_tours_updated BEFORE UPDATE ON public.tours FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_destinations_updated ON public.destinations;
CREATE TRIGGER trg_destinations_updated BEFORE UPDATE ON public.destinations FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_gallery_updated ON public.gallery;
CREATE TRIGGER trg_gallery_updated BEFORE UPDATE ON public.gallery FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_team_updated ON public.team;
CREATE TRIGGER trg_team_updated BEFORE UPDATE ON public.team FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_bookings_updated ON public.bookings;
CREATE TRIGGER trg_bookings_updated BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_reviews_updated ON public.reviews;
CREATE TRIGGER trg_reviews_updated BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_contact_messages_updated ON public.contact_messages;
CREATE TRIGGER trg_contact_messages_updated BEFORE UPDATE ON public.contact_messages FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_faqs_updated ON public.faqs;
CREATE TRIGGER trg_faqs_updated BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ==============================================================================
-- 17. ROW LEVEL SECURITY (RLS) POLICIES (IDEMPOTENT DROP & RE-CREATE)
-- ==============================================================================
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Drop Existing Policies First to Prevent "42710 Policy Already Exists" Errors
DROP POLICY IF EXISTS "Public Read Media" ON public.media_files;
DROP POLICY IF EXISTS "Public Read Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public Read Transfers" ON public.transfers;
DROP POLICY IF EXISTS "Public Read Services" ON public.services;
DROP POLICY IF EXISTS "Public Read Tours" ON public.tours;
DROP POLICY IF EXISTS "Public Read Destinations" ON public.destinations;
DROP POLICY IF EXISTS "Public Read Gallery" ON public.gallery;
DROP POLICY IF EXISTS "Public Read Team" ON public.team;
DROP POLICY IF EXISTS "Public Read Reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public Read FAQs" ON public.faqs;

DROP POLICY IF EXISTS "Guest Insert Bookings" ON public.bookings;
DROP POLICY IF EXISTS "Guest Insert Messages" ON public.contact_messages;

DROP POLICY IF EXISTS "Admin All Media" ON public.media_files;
DROP POLICY IF EXISTS "Admin All Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin All Transfers" ON public.transfers;
DROP POLICY IF EXISTS "Admin All Services" ON public.services;
DROP POLICY IF EXISTS "Admin All Tours" ON public.tours;
DROP POLICY IF EXISTS "Admin All Destinations" ON public.destinations;
DROP POLICY IF EXISTS "Admin All Gallery" ON public.gallery;
DROP POLICY IF EXISTS "Admin All Team" ON public.team;
DROP POLICY IF EXISTS "Admin All Bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admin All Reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admin All Messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin All FAQs" ON public.faqs;

-- Public READ for Active/Published Data
CREATE POLICY "Public Read Media" ON public.media_files FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Public Read Transfers" ON public.transfers FOR SELECT USING (is_active = true AND deleted_at IS NULL);
CREATE POLICY "Public Read Services" ON public.services FOR SELECT USING (is_active = true AND deleted_at IS NULL);
CREATE POLICY "Public Read Tours" ON public.tours FOR SELECT USING (is_active = true AND deleted_at IS NULL);
CREATE POLICY "Public Read Destinations" ON public.destinations FOR SELECT USING (is_active = true AND deleted_at IS NULL);
CREATE POLICY "Public Read Gallery" ON public.gallery FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Public Read Team" ON public.team FOR SELECT USING (is_active = true AND deleted_at IS NULL);
CREATE POLICY "Public Read Reviews" ON public.reviews FOR SELECT USING (is_published = true AND deleted_at IS NULL);
CREATE POLICY "Public Read FAQs" ON public.faqs FOR SELECT USING (is_published = true AND deleted_at IS NULL);

-- Guest Submit Access (Bookings & Inquiries)
CREATE POLICY "Guest Insert Bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Guest Insert Messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Admin Full Access (Authenticated Users)
CREATE POLICY "Admin All Media" ON public.media_files FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Settings" ON public.site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Transfers" ON public.transfers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Services" ON public.services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Tours" ON public.tours FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Destinations" ON public.destinations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Gallery" ON public.gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Team" ON public.team FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Bookings" ON public.bookings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Reviews" ON public.reviews FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Messages" ON public.contact_messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All FAQs" ON public.faqs FOR ALL USING (auth.role() = 'authenticated');


-- ==============================================================================
-- 18. SEED DATA (SAMPLE RECORDS FOR TRANSFERS, TOURS, GALLERY, TEAM, ETC.)
-- ==============================================================================

-- A. SITE SETTINGS
INSERT INTO public.site_settings (
    business_name, driver_name, description, phone, whatsapp, telegram, email, address, google_maps_url, facebook_url, instagram_url, telegram_url
) VALUES (
    'Cambodia Cab Drivers',
    'Sareth Vong',
    'Premier private driver and transport service in Siem Reap & across Cambodia. Safe air-conditioned SUVs, VIP vans, airport transfers, and customized temple tours.',
    '+855 12 345 678',
    '+85512345678',
    '@sareth_cambodia_cab',
    'info@cambodiacabdrivers.com',
    'Slor Kram Village, Siem Reap, Kingdom of Cambodia',
    'https://maps.google.com/?q=Siem+Reap+Cambodia',
    'https://facebook.com/cambodiacabdrivers',
    'https://instagram.com/cambodiacabdrivers',
    'https://t.me/sareth_cambodia_cab'
);

-- B. TRANSFERS (PRIMARY ROUTE CATALOG)
INSERT INTO public.transfers (
    title, slug, origin, destination, transfer_type, vehicle_type, max_passengers, max_luggage, estimated_duration, distance_km, price_usd, short_description, description, highlights, included, excluded, featured_image, is_popular
) VALUES
(
    'Siem Reap Airport (SAI) to Siem Reap City Center',
    'sai-airport-to-siem-reap-city',
    'Siem Reap Angkor International Airport (SAI)',
    'Siem Reap City Center / Hotel',
    'airport',
    'Lexus SUV / Clean Sedan',
    4, 4, '45 - 50 mins', 45.0, 35.00,
    'Hassle-free private pickup at SAI airport arrivals terminal directly to your hotel in Siem Reap with air conditioning and cold water.',
    'Enjoy a smooth and stress-free arrival at Siem Reap Angkor International Airport (SAI). Our professional private driver will greet you at the arrivals gate holding a personalized name sign. Sit back and relax in a modern, air-conditioned Lexus SUV or sedan with complimentary cold mineral water and fresh towels after your flight.',
    ARRAY['Flight tracking for delayed arrivals', 'Personalized name sign meeting at arrivals gate', 'Comfortable air-conditioned SUV or MPV', 'Cold bottled water & wet towels included'],
    ARRAY['Private A/C Vehicle & Fuel', 'All Highway Tolls & Airport Parking', 'English speaking private driver', 'Cold Bottled Water'],
    ARRAY['Personal expenses', 'Driver tips (optional)'],
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    true
),
(
    'Siem Reap to Phnom Penh Private Taxi Transfer',
    'siem-reap-to-phnom-penh-transfer',
    'Siem Reap Hotel',
    'Phnom Penh Hotel / Airport (PNH)',
    'intercity',
    'Lexus RX SUV / Executive MPV',
    4, 4, '5.5 - 6 Hours', 315.0, 85.00,
    'Direct door-to-door private transfer between Siem Reap and Phnom Penh along National Highway 6.',
    'Travel comfortably between Siem Reap and Phnom Penh with a dedicated private driver. Enjoy flexible departure times, optional stops at famous local spots like the Kampong Kdei ancient bridge or Skun spider market, and a safe, smooth ride in an air-conditioned vehicle.',
    ARRAY['Door-to-door private transfer', 'Flexible rest stops along the highway', 'Comfortable Lexus SUV with spacious legroom', 'Experienced long-distance Khmer driver'],
    ARRAY['Door-to-door private vehicle & fuel', 'Toll fees & parking', 'Cold drinking water', 'Flexible rest stops'],
    ARRAY['Food and personal snacks', 'Entrance fees for optional stopovers'],
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    true
),
(
    'Siem Reap to Battambang Private Taxi Transfer',
    'siem-reap-to-battambang-transfer',
    'Siem Reap Hotel',
    'Battambang Hotel / City Center',
    'intercity',
    'Lexus SUV / Clean Sedan',
    4, 4, '3 - 3.5 Hours', 165.0, 65.00,
    'Comfortable private taxi service connecting Siem Reap to the charming cultural city of Battambang.',
    'Scenic highway ride around the Tonle Sap lake basin into Battambang province. Perfect for travelers seeking a direct, hassle-free journey to explore Battambang''s French colonial architecture and famous Bamboo Train.',
    ARRAY['Direct hotel-to-hotel pick-up and drop-off', 'Safe overtaking driver with years of route experience', 'Flexible stop at Kra Lanh bamboo sticky rice stalls'],
    ARRAY['Private A/C SUV & Fuel', 'Door-to-door service', 'Bottled water'],
    ARRAY['Personal expenses', 'Driver tips'],
    'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80',
    false
),
(
    'Siem Reap to Poipet (Thailand Border) Transfer',
    'siem-reap-to-poipet-border-transfer',
    'Siem Reap Hotel',
    'Poipet Thai Border Crossing Point',
    'border_crossing',
    'Lexus SUV / Sedan',
    4, 4, '2.5 - 3 Hours', 152.0, 55.00,
    'Fast and reliable private transport from Siem Reap straight to the Aranyaprathet / Poipet border crossing.',
    'Ideal for travelers heading into Thailand. We drop you directly at the international border customs control gate for a smooth overland transit.',
    ARRAY['Punctual early morning pick-up for border opening', 'Direct drop-off at international immigration terminal', 'Air-conditioned vehicle with generous luggage space'],
    ARRAY['Private vehicle, fuel, and road tolls', 'Hotel pick-up & border drop-off'],
    ARRAY['Visa fees', 'Thai side transport'],
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    false
),
(
    'Phnom Penh Airport (PNH) to City Center Hotel',
    'phnom-penh-airport-to-hotel-transfer',
    'Phnom Penh International Airport (PNH)',
    'Phnom Penh Hotel / Riverside',
    'airport',
    'Lexus SUV / Sedan',
    4, 4, '30 - 45 mins', 15.0, 25.00,
    'Reliable private airport transfer in Cambodia''s bustling capital city.',
    'Avoid busy taxi queues and tuk-tuk negotiation at Phnom Penh airport. Our driver waits at arrivals terminal with your name sign.',
    ARRAY['Greeting at PNH arrivals exit', 'Air-conditioned city transfer', 'No hidden meter charges'],
    ARRAY['Private vehicle & fuel', 'Airport parking fee', 'Cold water'],
    ARRAY['Driver tip'],
    'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
    false
) ON CONFLICT (slug) DO NOTHING;

-- C. SERVICES
INSERT INTO public.services (
    name, slug, short_description, description, icon, featured_image
) VALUES
(
    'Airport Transfers (SAI & PNH)',
    'airport-transfers',
    'Punctual, stress-free airport pickup and drop-off with flight tracking and sign greeting.',
    'We offer reliable airport transfer services for both Siem Reap Angkor International Airport (SAI) and Phnom Penh International Airport (PNH). Enjoy air-conditioned luxury vehicles, complimentary cold bottled water, and flight delay monitoring so your driver is always waiting when you land.',
    'Plane',
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80'
),
(
    'Intercity Private Taxi',
    'intercity-private-taxi',
    'Door-to-door long-distance private driver service between major Cambodian provinces.',
    'Travel comfortably anywhere in Cambodia including Siem Reap, Phnom Penh, Battambang, Sihanoukville, Kampot, and Kep. Enjoy full schedule control, custom stopovers, and experienced highway drivers.',
    'Car',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
),
(
    'Full Day Private Driver Hire',
    'full-day-private-driver',
    'Hire a dedicated driver with a clean SUV for temple tours, business meetings, or customized day trips.',
    'Hire Sareth or an experienced driver for the entire day (8-10 hours). Perfect for visiting Angkor Wat temple complexes, remote sites like Beng Mealea, or local markets in Siem Reap at your own pace.',
    'Clock',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
),
(
    'Border Crossing Transport',
    'border-crossing-transport',
    'Direct transfers to Thailand (Poipet / Aranyaprathet) or Vietnam border crossings.',
    'Seamless cross-border transfers. We pick you up at your hotel and drive you straight to the customs gate at Poipet or Cham Yeam with zero hassle.',
    'MapPin',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80'
) ON CONFLICT (slug) DO NOTHING;

-- D. TOURS
INSERT INTO public.tours (
    title, slug, short_description, description, duration, pickup_location, departure_time, highlights, itinerary, included, excluded, important_information, featured_image, gallery, is_featured
) VALUES
(
    'Angkor Wat Small Circuit & Sunrise Private Tour',
    'angkor-wat-sunrise-tour',
    'Experience the iconic sunrise over Angkor Wat followed by Bayon, Ta Prohm (Tomb Raider), and Banteay Kdei.',
    'Embark on an unforgettable journey through the heart of the ancient Khmer Empire. We pick you up from your Siem Reap hotel at 04:45 AM in an air-conditioned Lexus SUV. Watch the dramatic reflection of the morning sun behind Angkor Wat''s lotus towers, then explore the mysterious stone faces of Bayon and the giant jungle tree roots of Ta Prohm.',
    'Full Day (8 - 9 Hours)',
    'Siem Reap Hotel Pickup',
    '04:45 AM (Recommended for Sunrise)',
    ARRAY['Angkor Wat Sunrise spectacle', 'Bayon Temple with 216 giant smiling stone faces', 'Ta Prohm (Tomb Raider tree-root temple)', 'Banteay Kdei & Srah Srang royal pool'],
    '[
        {"time": "04:45 AM", "title": "Hotel Pick-up", "description": "Meet Sareth at your hotel lobby with air-conditioned SUV."},
        {"time": "05:15 AM", "title": "Angkor Wat Sunrise", "description": "Watch the stunning reflection of sunrise over the sacred lotus ponds."},
        {"time": "07:30 AM", "title": "Breakfast Break", "description": "Enjoy breakfast near the temple complex (hotel box or local restaurant)."},
        {"time": "08:30 AM", "title": "Bayon & Angkor Thom", "description": "Explore the gigantic smiling stone faces of Bayon and the Elephant Terrace."},
        {"time": "11:00 AM", "title": "Ta Prohm (Tomb Raider)", "description": "Marvel at the giant silk-cotton tree roots wrapping ancient stone walls."},
        {"time": "01:30 PM", "title": "Banteay Kdei & Return", "description": "Visit Banteay Kdei monastery and return safely to your hotel."}
    ]'::jsonb,
    ARRAY['Private A/C SUV or MPV Vehicle', 'Experienced English-speaking driver', 'Cold bottled water & ice-cold towels', 'Hotel pick-up and drop-off', 'All parking fees & fuel'],
    ARRAY['Angkor Pass Ticket ($37/1-day, $62/3-day)', 'Licensed tour guide (available upon request)', 'Meals and drinks'],
    ARRAY['Angkor Pass is required prior to entering the park.', 'Shoulders and knees must be covered inside sacred temple grounds.'],
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80'
    ],
    true
),
(
    'Kulen Mountain Waterfalls & Sacred River Day Tour',
    'kulen-mountain-waterfalls-tour',
    'Escape to Phnom Kulen National Park to swim in freshwater waterfalls, view 1,000 Lingas, and see the Reclining Buddha.',
    'Phnom Kulen is considered the birth place of the ancient Khmer Empire in 802 AD. Located 50km northeast of Siem Reap, this sacred mountain trip takes you through lush tropical countryside to dramatic multi-tiered waterfalls, ancient riverbed carvings (1,000 Lingas), and the large gilded Reclining Buddha at Wat Preah Ang Thom.',
    'Full Day (7 - 8 Hours)',
    'Siem Reap Hotel Pickup',
    '08:00 AM',
    ARRAY['Swim at Phnom Kulen National Park waterfalls', 'Sacred 1,000 Lingas carved into riverbed stone', 'Wat Preah Ang Thom giant Reclining Buddha', 'Scenic mountain view points'],
    '[
        {"time": "08:00 AM", "title": "Hotel Pick-up", "description": "Depart Siem Reap for mountain drive."},
        {"time": "09:30 AM", "title": "1,000 Lingas Riverbed", "description": "Walk along the holy riverbed with ancient 9th-century stone carvings."},
        {"time": "10:30 AM", "title": "Wat Preah Ang Thom", "description": "Climb up the sacred hilltop monastery to see the massive carved Buddha."},
        {"time": "12:00 PM", "title": "Waterfall Swimming & Lunch", "description": "Relax and swim in the cool waterfall cascades. Enjoy local Khmer lunch by the river."},
        {"time": "03:30 PM", "title": "Return Drive", "description": "Comfortable drive back to Siem Reap with sunset views."}
    ]'::jsonb,
    ARRAY['Private A/C SUV & Driver', 'Cold Bottled Water', 'Toll fees & Fuel', 'Hotel pick-up & drop-off'],
    ARRAY['Kulen Mountain Park Pass ($20 per person)', 'Food and personal snacks'],
    ARRAY['Bring swimwear, towels, and dry change of clothing for the waterfall.'],
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80'
    ],
    true
) ON CONFLICT (slug) DO NOTHING;

-- E. DESTINATIONS
INSERT INTO public.destinations (
    name, slug, short_description, description, things_to_do, featured_image, gallery, is_featured
) VALUES
(
    'Siem Reap & Angkor Wat',
    'siem-reap',
    'The gateway to the world-famous UNESCO World Heritage Angkor archaeological park and vibrant night markets.',
    'Siem Reap is Cambodia''s top cultural destination, combining ancient Khmer temple grandeur with lively Pub Street, night markets, world-class dining, and serene countryside villages.',
    ARRAY['Watch sunrise at Angkor Wat', 'Explore Ta Prohm Tomb Raider temple', 'Stroll Pub Street and Night Market', 'Boat trip on Tonle Sap Floating Village', 'Phare Cambodian Circus show'],
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80'
    ],
    true
),
(
    'Phnom Penh Capital City',
    'phnom-penh',
    'Cambodia''s energetic riverfront capital filled with royal palaces, history, and bustling street culture.',
    'Phnom Penh sits at the confluence of the Mekong and Tonle Sap rivers. It offers a fascinating blend of royal Khmer heritage at the Royal Palace & Silver Pagoda alongside historical sites like Tuol Sleng and the Killing Fields.',
    ARRAY['Royal Palace & Silver Pagoda', 'National Museum of Cambodia', 'Riverside Promenade walk', 'Central Market (Psar Thmei) shopping', 'Sunset Mekong River boat cruise'],
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
    ],
    true
),
(
    'Battambang',
    'battambang',
    'Cambodia''s artistic haven known for French colonial architecture and the famous Bamboo Train.',
    'Located southwest of Siem Reap, Battambang is renowned for its laid-back riverfront vibe, preserved French colonial shophouses, ancient pagodas, and rural farmland scenery.',
    ARRAY['Ride the famous Bamboo Train (Norry)', 'Phnom Sampeau Bat Cave at sunset', 'Wat Ek Phnom ruins', 'Colonial architecture walking tour'],
    'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80'
    ],
    false
) ON CONFLICT (slug) DO NOTHING;

-- F. TEAM
INSERT INTO public.team (
    full_name, role, license_number, years_experience, languages, phone, whatsapp, telegram, bio, rating, photo_url, is_active, sort_order
) VALUES
(
    'Sareth Vong',
    'Founder & Lead Driver',
    'KH-DRV-88291',
    12,
    ARRAY['English', 'Khmer'],
    '+855 12 345 678',
    '+85512345678',
    '@sareth_cambodia_cab',
    'Sareth is a friendly, professional Siem Reap native with over 12 years of experience providing safe, reliable private transfers and temple tours across Cambodia.',
    5.00,
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    true, 1
),
(
    'Dara Chen',
    'Senior Airport & Highway Specialist',
    'KH-DRV-44120',
    8,
    ARRAY['English', 'Khmer'],
    '+855 12 998 112',
    '+85512998112',
    '@dara_cambodia_cab',
    'Dara specializes in long-distance intercity routes (Siem Reap to Phnom Penh & Sihanoukville) and punctual Siem Reap SAI airport pickups.',
    4.95,
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    true, 2
),
(
    'Visal Heng',
    'Executive Van & Group Tour Driver',
    'KH-DRV-55901',
    10,
    ARRAY['English', 'Khmer', 'Thai'],
    '+855 12 774 331',
    '+85512774331',
    '@visal_cambodia_cab',
    'Visal operates our 12-seater VIP vans, catering to larger families and small private group excursions with top-class comfort.',
    4.98,
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    true, 3
) ON CONFLICT DO NOTHING;

-- G. GALLERY
INSERT INTO public.gallery (
    title, category, description, image_url, is_featured, sort_order
) VALUES
(
    'Lexus SUV Fleet - Clean & Air Conditioned',
    'vehicles',
    'Our primary Lexus RX SUV fleet parked and ready for airport pickup.',
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    true, 1
),
(
    'Sunrise at Angkor Wat Temple',
    'tours',
    'Breathtaking dawn reflection captured during our private sunrise tour.',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    true, 2
),
(
    'Siem Reap SAI Airport Terminal Gate',
    'vehicles',
    'Greeting guests at the new Siem Reap Angkor International Airport arrivals exit.',
    'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
    true, 3
),
(
    'Kulen Mountain Waterfall Cascade',
    'destinations',
    'Cooling down at Phnom Kulen national park waterfalls.',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    false, 4
) ON CONFLICT DO NOTHING;

-- H. REVIEWS
INSERT INTO public.reviews (
    customer_name, country, rating, review, image_url, is_published
) VALUES
(
    'Mark & Sarah Jenkins',
    'Australia',
    5,
    'Sareth was an absolute lifesaver! He met us at the new Siem Reap Airport (SAI) with a clear sign, cold water, and a pristine SUV. He also drove us for 3 days around Angkor Wat. Punctual, extremely friendly, and highly knowledgeable!',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    true
),
(
    'Elena Rostova',
    'Germany',
    5,
    'Booked a private transfer from Siem Reap to Phnom Penh. The Lexus SUV was super smooth, cool A/C, and Sareth stopped at Skun spider market so we could get photos. Very safe driver on Cambodian highways!',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    true
),
(
    'David Miller',
    'United Kingdom',
    5,
    'Excellent 5-star service! Sareth helped us arrange our Kulen Mountain waterfall trip. Great communication over WhatsApp, very fair flat rates with no surprise charges.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    true
) ON CONFLICT DO NOTHING;

-- I. FAQS
INSERT INTO public.faqs (
    question, answer, category, sort_order, is_published
) VALUES
(
    'How do I meet my driver at Siem Reap Airport (SAI)?',
    'Our driver will wait for you directly outside the arrivals exit gate holding a personalized sign with your full name. We monitor flight tracking so even if your flight is delayed, we will be there!',
    'airport', 1, true
),
(
    'What types of vehicles do you provide?',
    'We primarily operate clean, modern, air-conditioned Lexus RX SUVs and Toyota MPVs (suitable for 1-4 passengers with luggage) as well as 12-seater VIP vans for larger families or groups.',
    'general', 2, true
),
(
    'What payment methods do you accept?',
    'You can pay cash directly to your driver in US Dollars ($ USD) or Cambodian Riel (KHR). We also accept online bank deposits or ABA Pay QR codes upon request.',
    'booking', 3, true
),
(
    'Are cold bottled water and towels provided during tours?',
    'Yes! All transfers and private day tours include complimentary ice-cold bottled water and refreshing wet towels.',
    'tours', 4, true
) ON CONFLICT DO NOTHING;

-- J. BOOKINGS
INSERT INTO public.bookings (
    booking_reference, customer_name, email, phone, whatsapp, pickup_location, destination, travel_date, pickup_time, passengers, luggage, flight_number, hotel_name, special_requests, status
) VALUES
(
    'CCD-1001',
    'John Doe',
    'john.doe@example.com',
    '+1 415 555 0199',
    '+14155550199',
    'Siem Reap SAI Airport',
    'Anantara Angkor Resort',
    CURRENT_DATE + INTERVAL '3 days',
    '14:30',
    2, 2, 'SQ164', 'Anantara Angkor Resort',
    'Please bring child car seat if available.',
    'confirmed'
),
(
    'CCD-1002',
    'Sophie Martin',
    'sophie.martin@example.fr',
    '+33 6 12 34 56 78',
    '+33612345678',
    'Jungle Addition Hotel Siem Reap',
    'Phnom Penh Riverside Hotel',
    CURRENT_DATE + INTERVAL '5 days',
    '08:00',
    3, 3, NULL, 'Jungle Addition Hotel',
    'Interested in stopping at Skun spider market on the way.',
    'new'
) ON CONFLICT (booking_reference) DO NOTHING;
