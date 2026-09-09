-- Seed data for Cambodia Cab Drivers

INSERT INTO public.site_settings (
  id, business_name, driver_name, description, phone, whatsapp, telegram, email, address, google_maps_url
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Cambodia Cab Drivers',
  'Sareth',
  'Welcome to Cambodia Cab Drivers. My name is Sareth, and I am a professional taxi driver in Cambodia. We provide reliable private transportation services around Phnom Penh and throughout Cambodia, including airport pickup and drop-off, sightseeing, private tours, city-to-city transfers, overland trips, and customized journeys with an English-speaking driver.',
  '+855 16 509 371',
  '+855 16 509 371',
  '+855 16 509 371',
  'sareth@cambodiacabdrivers.com',
  '#61, Oknha Chrun Youhak (294), Boeung Keng Kang I, Chamkarmon, Phnom Penh 12302, Cambodia',
  'https://maps.google.com/?q=Boeung+Keng+Kang+I+Phnom+Penh+Cambodia'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.services (name, slug, short_description, description, icon, featured_image, is_active)
VALUES
('Airport Transfers', 'airport-transfers', 'Convenient airport pickup and drop-off services at Phnom Penh International Airport and Siem Reap Airport.', 'Avoid waiting in taxi lines or dealing with inflated airport rates. Sareth will monitor your arrival flight, meet you with a personalized name card inside the arrivals terminal, assist with your luggage, and provide a comfortable, climate-controlled ride directly to your hotel.', 'Plane', 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=1200&auto=format&fit=crop', true),
('Phnom Penh Taxi', 'phnom-penh-taxi', 'Comfortable private taxi transportation around Phnom Penh.', 'Navigate the vibrant streets of Phnom Penh effortlessly. Whether you need a point-to-point city transfer, an hourly ride for business, or an evening driver for dinner and nightlife.', 'Car', 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1200&auto=format&fit=crop', true),
('City-to-City Transfers', 'city-to-city-transfers', 'Seamless private overland travel between destinations across Cambodia.', 'Travel safely and comfortably between major Cambodian destinations without crowded buses or rigid public transport schedules.', 'Navigation', 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=1200&auto=format&fit=crop', true),
('Private Driver', 'private-driver', 'Hire Sareth for half-day, full-day, or multi-day custom journeys.', 'Have a dedicated driver at your disposal throughout your stay in Cambodia.', 'UserCheck', 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1200&auto=format&fit=crop', true),
('Sightseeing Tours', 'sightseeing-tours', 'Discover Cambodia''s major attractions with a local driver.', 'Combine door-to-door transportation with authentic insider insights.', 'Compass', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop', true),
('Custom Trips', 'custom-trips', 'Create a personalized Cambodia itinerary around your travel plans.', 'Planning a unique journey off the beaten track? Share your dream destinations, dates, and group size.', 'MapPin', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop', true)
ON CONFLICT (slug) DO NOTHING;
