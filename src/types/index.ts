export type BookingStatus = 'new' | 'pending' | 'confirmed' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

export type UserRole = 'super_admin' | 'admin';

export type Language = 'en' | 'km';

export interface Service {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  icon: string; // Lucide icon identifier
  featured_image: string;
  featured_image_data?: string | null;
  featured_image_mime?: string | null;
  starting_price?: number;
  currency?: string;
  features?: string[];
  included_items?: string[];
  cta_text?: string;
  cta_link?: string;
  seo_title?: string;
  seo_description?: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order?: number;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  name: string;
  category: 'sedan' | 'suv' | 'van';
  models: string;
  capacity_passengers: number;
  capacity_luggage: number;
  description: string;
  price_from: number;
  currency?: string;
  features: string[];
  image_url: string;
  image_data?: string | null;
  image_mime?: string | null;
  gallery?: string[];
  has_air_con: boolean;
  is_popular?: boolean;
  is_active: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface RoutePricing {
  id: string;
  slug: string;
  origin: string;
  destination: string;
  route_name: string;
  estimated_duration: string;
  distance_km: number;
  sedan_price: number;
  suv_price: number;
  van_price: number;
  currency?: string;
  is_popular: boolean;
  is_airport: boolean;
  airport_code?: string;
  description: string;
  highlights: string[];
  image_url?: string;
  image_data?: string | null;
  image_mime?: string | null;
  seo_title?: string;
  seo_description?: string;
  is_published: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Airport {
  id: string;
  code: string;
  name: string;
  city: string;
  province: string;
  description: string;
  image_url: string;
  image_data?: string | null;
  image_mime?: string | null;
  pickup_instructions: string;
  is_active: boolean;
}

export interface Tour {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  duration: string;
  starting_price?: number;
  currency?: string;
  pickup_location: string;
  departure_time: string;
  highlights: string[];
  itinerary: { title: string; description: string }[];
  included: string[];
  excluded: string[];
  important_information: string[];
  featured_image: string;
  featured_image_data?: string | null;
  featured_image_mime?: string | null;
  gallery: string[];
  vehicle_type?: string;
  max_passengers?: number;
  seo_title?: string;
  seo_description?: string;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  things_to_do: string[];
  travel_tips?: string;
  featured_image: string;
  featured_image_data?: string | null;
  featured_image_mime?: string | null;
  gallery: string[];
  seo_title?: string;
  seo_description?: string;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  booking_reference: string;
  customer_name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  service_id?: string;
  service_name?: string;
  route_id?: string;
  tour_id?: string;
  tour_title?: string;
  pickup_location: string;
  destination: string;
  travel_date: string;
  pickup_time: string;
  passengers: number;
  luggage: number;
  vehicle_type?: string;
  flight_number?: string;
  hotel_name?: string;
  special_requests?: string;
  estimated_price?: number;
  currency?: string;
  status: BookingStatus;
  assigned_driver?: string;
  assigned_vehicle?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  customer_name: string;
  country: string;
  rating: number;
  review: string;
  image_url?: string;
  trip_type?: string;
  source?: 'google' | 'tripadvisor' | 'direct' | 'website';
  google_review_url?: string;
  is_featured: boolean;
  is_published: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'booking' | 'airport' | 'tours' | 'general' | 'payment';
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface WhyChooseUsBenefit {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon identifier: 'ShieldCheck' | 'Clock' | 'Award' | 'Sparkles' | 'DollarSign' | 'MessageSquare'
  badge?: string;
  display_order: number;
  is_active: boolean;
}

export interface DriverProfile {
  id: string;
  driver_name: string;
  title: string;
  greeting: string;
  bio_paragraph_1: string;
  bio_paragraph_2: string;
  years_experience: number;
  languages: string[];
  license_info: string;
  profile_photo_url: string;
  cover_photo_url: string;
  phone: string;
  whatsapp: string;
  telegram: string;
  rating: number;
  trips_completed: number;
  qualifications: string[];
  vehicle_info: string;
  why_choose_driver: string[];
  updated_at: string;
}

export interface HomepageSectionConfig {
  id: string;
  key: string;
  title: string;
  subtitle?: string;
  badge?: string;
  description?: string;
  is_enabled: boolean;
  display_order: number;
  image_url?: string;
  button_text?: string;
  button_link?: string;
}

export interface HomepageSettings {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
    background_image: string;
    slide_interval_seconds?: number;
    primary_btn_text: string;
    primary_btn_link: string;
    secondary_btn_text: string;
    secondary_btn_link: string;
    whatsapp_btn_text: string;
    whatsapp_message: string;
    rating_text: string;
    rating_subtext: string;
    price_guarantee_text: string;
    experience_text: string;
  };
  sections: HomepageSectionConfig[];
}

export interface BookingFormSettings {
  enable_flight_number: boolean;
  enable_hotel_name: boolean;
  enable_special_requests: boolean;
  enable_luggage_counter: boolean;
  enable_whatsapp_field: boolean;
  require_email: boolean;
  require_phone: boolean;
  default_passengers: number;
  default_vehicle: string;
}

export interface CurrencySettings {
  default_currency: string;
  currency_symbol: string;
  supported_currencies: string[];
}

export interface SmtpSettings {
  smtp_user?: string;
  smtp_password?: string;
  admin_notification_email?: string;
  smtp_host?: string;
  smtp_port?: string;
  is_enabled?: boolean;
}

export interface SiteSettings {
  id: string;
  business_name: string;
  driver_name: string;
  tagline: string;
  description: string;
  phone: string;
  whatsapp: string;
  telegram: string;
  email: string;
  address: string;
  working_hours: string;
  emergency_contact: string;
  logo_url: string;
  favicon_url?: string;
  facebook_url: string;
  facebook_urls?: string[];
  instagram_url: string;
  tiktok_url?: string;
  telegram_url: string;
  youtube_url?: string;
  google_maps_url: string;
  google_business_url?: string;
  tripadvisor_url?: string;
  primary_color: string;
  accent_color: string;
  footer_description: string;
  copyright_text: string;
  booking_form_settings: BookingFormSettings;
  currency_settings: CurrencySettings;
  smtp_settings?: SmtpSettings;
  updated_at: string;
}


export interface SEOSettings {
  meta_title: string;
  meta_description: string;
  keywords: string[];
  og_title: string;
  og_description: string;
  og_image: string;
  canonical_url: string;
  index_site: boolean;
}

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  category: 'hero' | 'vehicles' | 'tours' | 'destinations' | 'drivers' | 'services' | 'general';
  created_at: string;
}

export interface DatabaseSchema {
  siteSettings: SiteSettings;
  homepageSettings: HomepageSettings;
  driverProfile: DriverProfile;
  seoSettings: SEOSettings;
  whyChooseUs: WhyChooseUsBenefit[];
  services: Service[];
  tours: Tour[];
  destinations: Destination[];
  bookings: Booking[];
  reviews: Review[];
  messages: ContactMessage[];
  faqs: FAQ[];
  vehicles: Vehicle[];
  routes: RoutePricing[];
  airports: Airport[];
  mediaItems: MediaItem[];
  _metadata?: {
    version: string;
    lastUpdated: string;
    created_at: string;
  };
}
