import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Service, Tour, Destination, Booking, Review, ContactMessage, FAQ, SiteSettings, 
  BookingStatus, Vehicle, RoutePricing, Language, Airport, WhyChooseUsBenefit, 
  DriverProfile, HomepageSettings, SEOSettings, MediaItem 
} from '../types';
import { 
  INITIAL_SITE_SETTINGS, INITIAL_SERVICES, INITIAL_TOURS, 
  INITIAL_DESTINATIONS, INITIAL_REVIEWS, INITIAL_FAQS, 
  INITIAL_BOOKINGS, INITIAL_MESSAGES, INITIAL_VEHICLES, INITIAL_ROUTES,
  INITIAL_AIRPORTS, INITIAL_WHY_CHOOSE_US, INITIAL_DRIVER_PROFILE,
  INITIAL_HOMEPAGE_SETTINGS, INITIAL_SEO_SETTINGS, INITIAL_MEDIA_ITEMS
} from '../lib/data';
import { translations, Translations } from '../lib/translations';
import { generateBookingReference } from '../lib/utils';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { api, DbStatus } from '../lib/api';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  // Navigation
  currentPath: string;
  navigate: (path: string) => void;
  
  // Language & i18n
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;

  // Database Connection Status
  dbStatus: 'connected' | 'syncing' | 'offline';
  isDbLoaded: boolean;
  refreshDatabase: () => Promise<void>;

  // Auth state
  isAdminLoggedIn: boolean;
  isAdminAuthenticated: boolean;
  adminDisplayName: string;
  loginAdmin: (email: string, password: string) => Promise<boolean>;
  logoutAdmin: () => void;
  
  // Data models
  siteSettings: SiteSettings;
  homepageSettings: HomepageSettings;
  driverProfile: DriverProfile;
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
  seoSettings: SEOSettings;
  
  // Toast notifications
  notifications: Notification[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Booking Actions
  addBooking: (bookingData: Omit<Booking, 'id' | 'booking_reference' | 'created_at' | 'updated_at' | 'status'>) => Promise<Booking>;
  updateBookingStatus: (id: string, status: BookingStatus, notes?: string) => Promise<void>;
  updateBookingDetails: (id: string, updates: Partial<Booking>) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  
  // Contact Message Actions
  addContactMessage: (msg: Omit<ContactMessage, 'id' | 'status' | 'created_at' | 'updated_at'>) => Promise<ContactMessage>;
  updateMessageStatus: (id: string, status: 'unread' | 'read' | 'archived') => Promise<void>;
  deleteContactMessage: (id: string) => Promise<void>;
  markMessageRead?: (id: string) => Promise<void>;
  deleteMessage?: (id: string) => Promise<void>;

  // CMS Actions
  saveTour: (tour: Partial<Tour>) => Promise<boolean>;
  deleteTour: (id: string) => Promise<void>;

  saveDestination: (destination: Partial<Destination>) => Promise<void>;
  deleteDestination: (id: string) => Promise<void>;

  saveService: (service: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;

  saveReview: (review: Partial<Review>) => Promise<void>;
  approveReview: (id: string) => Promise<void>;
  rejectReview: (id: string, reason?: string) => Promise<void>;
  toggleReviewPublish: (id: string) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;

  saveFAQ: (faq: Partial<FAQ>) => Promise<void>;
  deleteFAQ: (id: string) => Promise<void>;

  saveRoute: (route: Partial<RoutePricing>) => Promise<void>;
  deleteRoute: (id: string) => Promise<void>;

  saveVehicle: (vehicle: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;

  saveAirport: (airport: Partial<Airport>) => Promise<void>;
  deleteAirport: (id: string) => Promise<void>;

  saveWhyChooseUsBenefit: (benefit: Partial<WhyChooseUsBenefit>) => Promise<void>;
  deleteWhyChooseUsBenefit: (id: string) => Promise<void>;

  saveMediaItem: (item: Partial<MediaItem>) => Promise<void>;
  deleteMediaItem: (id: string) => Promise<void>;

  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  updateHomepageSettings: (newSettings: Partial<HomepageSettings>) => Promise<void>;
  updateDriverProfile: (newProfile: Partial<DriverProfile>) => Promise<void>;
  updateSEOSettings: (newSeo: Partial<SEOSettings>) => Promise<void>;

  // Reset demo data
  resetToDefaults: () => Promise<void>;

  // Last Created Booking
  lastCreatedBooking: Booking | null;
  setLastCreatedBooking: (b: Booking | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'cambodia_cab_drivers_state_v5';
const LANG_KEY = 'cambodia_cab_drivers_lang';
const isUuid = (value?: string) => Boolean(value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value));
const displayNameFromEmail = (email?: string) => (email || 'Admin').split('@')[0].split(/[._-]+/).filter(Boolean).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ') || 'Admin';

const adminLoginError = (message?: string) => {
  const text = (message || '').toLowerCase();
  if (text.includes('invalid login credentials')) return 'Incorrect email or password. Please try again.';
  if (text.includes('email not confirmed')) return 'Your email has not been confirmed yet. Confirm it in Supabase Authentication, then try again.';
  if (text.includes('rate limit') || text.includes('too many')) return 'Too many sign-in attempts. Please wait a few minutes and try again.';
  if (text.includes('network') || text.includes('fetch')) return 'Unable to reach Supabase. Check your internet connection and Supabase settings.';
  return 'Unable to sign in. Please check your email and password, then try again.';
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [adminDisplayName, setAdminDisplayName] = useState('Admin');

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANG_KEY);
    return saved === 'km' ? 'km' : 'en';
  });

  const [dbStatus, setDbStatus] = useState<'connected' | 'syncing' | 'offline'>('syncing');
  const [isDbLoaded, setIsDbLoaded] = useState<boolean>(false);

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [homepageSettings, setHomepageSettings] = useState<HomepageSettings>(INITIAL_HOMEPAGE_SETTINGS);
  const [driverProfile, setDriverProfile] = useState<DriverProfile>(INITIAL_DRIVER_PROFILE);
  const [whyChooseUs, setWhyChooseUs] = useState<WhyChooseUsBenefit[]>(INITIAL_WHY_CHOOSE_US);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [tours, setTours] = useState<Tour[]>(INITIAL_TOURS);
  const [destinations, setDestinations] = useState<Destination[]>(INITIAL_DESTINATIONS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [messages, setMessages] = useState<ContactMessage[]>(INITIAL_MESSAGES);
  const [faqs, setFaqs] = useState<FAQ[]>(INITIAL_FAQS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [routes, setRoutes] = useState<RoutePricing[]>(INITIAL_ROUTES);
  const [airports, setAirports] = useState<Airport[]>(INITIAL_AIRPORTS);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(INITIAL_MEDIA_ITEMS);
  const [seoSettings, setSeoSettings] = useState<SEOSettings>(INITIAL_SEO_SETTINGS);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [lastCreatedBooking, setLastCreatedBooking] = useState<Booking | null>(null);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANG_KEY, lang);
  };

  const t = translations[language];

  // Fetch full data from database
  const refreshDatabase = useCallback(async () => {
    try {
      setDbStatus('syncing');
      const dbData = await api.getFullDatabase(isAdminLoggedIn);
      if (dbData) {
        if (dbData.siteSettings) setSiteSettings(dbData.siteSettings);
        if (dbData.homepageSettings) setHomepageSettings(dbData.homepageSettings);
        if (dbData.driverProfile) setDriverProfile(dbData.driverProfile);
        if (dbData.seoSettings) setSeoSettings(dbData.seoSettings);
        if (Array.isArray(dbData.whyChooseUs)) setWhyChooseUs(dbData.whyChooseUs);
        if (Array.isArray(dbData.services)) setServices(dbData.services);
        if (Array.isArray(dbData.tours)) setTours(dbData.tours);
        if (Array.isArray(dbData.destinations)) setDestinations(dbData.destinations);
        if (Array.isArray(dbData.bookings)) setBookings(dbData.bookings);
        if (Array.isArray(dbData.reviews)) setReviews(dbData.reviews);
        if (Array.isArray(dbData.messages)) setMessages(dbData.messages);
        if (Array.isArray(dbData.faqs)) setFaqs(dbData.faqs);
        if (Array.isArray(dbData.vehicles)) setVehicles(dbData.vehicles);
        if (Array.isArray(dbData.routes)) setRoutes(dbData.routes);
        if (Array.isArray(dbData.airports)) setAirports(dbData.airports);
        if (Array.isArray(dbData.mediaItems)) setMediaItems(dbData.mediaItems);

        setDbStatus('connected');
        setIsDbLoaded(true);
      } else {
        // Fallback to local storage if server unreachable
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.siteSettings) setSiteSettings({ ...INITIAL_SITE_SETTINGS, ...parsed.siteSettings });
          if (parsed.homepageSettings) setHomepageSettings({ ...INITIAL_HOMEPAGE_SETTINGS, ...parsed.homepageSettings });
          if (parsed.driverProfile) setDriverProfile({ ...INITIAL_DRIVER_PROFILE, ...parsed.driverProfile });
          if (Array.isArray(parsed.whyChooseUs)) setWhyChooseUs(parsed.whyChooseUs);
          if (Array.isArray(parsed.services)) setServices(parsed.services);
          if (Array.isArray(parsed.tours)) setTours(parsed.tours);
          if (Array.isArray(parsed.destinations)) setDestinations(parsed.destinations);
          if (Array.isArray(parsed.bookings)) setBookings(parsed.bookings);
          if (Array.isArray(parsed.reviews)) setReviews(parsed.reviews);
          if (Array.isArray(parsed.messages)) setMessages(parsed.messages);
          if (Array.isArray(parsed.faqs)) setFaqs(parsed.faqs);
          if (Array.isArray(parsed.vehicles)) setVehicles(parsed.vehicles);
          if (Array.isArray(parsed.routes)) setRoutes(parsed.routes);
          if (Array.isArray(parsed.airports)) setAirports(parsed.airports);
          if (Array.isArray(parsed.mediaItems)) setMediaItems(parsed.mediaItems);
          if (parsed.seoSettings) setSeoSettings({ ...INITIAL_SEO_SETTINGS, ...parsed.seoSettings });
        }
        setDbStatus('offline');
        setIsDbLoaded(true);
      }
    } catch (e) {
      console.error('Error refreshing from database:', e);
      setDbStatus('offline');
      setIsDbLoaded(true);
    }
  }, [isAdminLoggedIn]);

  // Initial Load on mount
  useEffect(() => {
    refreshDatabase();
  }, [refreshDatabase]);

  // Never trust a browser flag for administrative access. Restore a session only
  // after Supabase confirms both the session and the admin allow-list membership.
  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) return;
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session || !active) return;
      const { data: isAdmin } = await supabase.rpc('is_admin');
      if (active && isAdmin) {
        setAdminDisplayName(displayNameFromEmail(data.session.user.email));
        setIsAdminLoggedIn(true);
      }
    });
    return () => { active = false; };
  }, []);

  // Periodic polling for Admin to sync fresh bookings & messages from other visitors
  useEffect(() => {
    if (!isAdminLoggedIn) return;

    const interval = setInterval(() => {
      api.getFullDatabase(true).then(data => {
        if (data) {
          if (Array.isArray(data.bookings)) setBookings(data.bookings);
          if (Array.isArray(data.messages)) setMessages(data.messages);
          if (Array.isArray(data.reviews)) setReviews(data.reviews);
          setDbStatus('connected');
        }
      }).catch(() => {});
    }, 15000);

    const onFocus = () => {
      refreshDatabase();
    };
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [isAdminLoggedIn, refreshDatabase]);

  // Cache to LocalStorage as offline backup
  useEffect(() => {
    if (!isDbLoaded) return;
    const dataToSave = {
      siteSettings,
      homepageSettings,
      driverProfile,
      whyChooseUs,
      services,
      tours,
      destinations,
      bookings,
      reviews,
      messages,
      faqs,
      vehicles,
      routes,
      airports,
      mediaItems,
      seoSettings,
    };
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.error('LocalStorage backup error:', e);
    }
  }, [
    isDbLoaded, siteSettings, homepageSettings, driverProfile, whyChooseUs, 
    services, tours, destinations, bookings, reviews, messages, 
    faqs, vehicles, routes, airports, mediaItems, seoSettings
  ]);

  // Handle browser popstate history
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo(0, 0);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const loginAdmin = async (email: string, pass: string): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) {
          showToast(adminLoginError(error.message), 'error');
          return false;
        }

        const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
        if (adminError || !isAdmin) {
          await supabase.auth.signOut();
          showToast('This account signed in, but is not an admin. Add its Supabase user ID to public.admin_users, then try again.', 'error');
          return false;
        }

        const name = displayNameFromEmail(data.user?.email || email);
        setAdminDisplayName(name);
        setIsAdminLoggedIn(true);
        showToast(`Welcome back, ${name}!`);
        return true;
      } catch (e) {
        console.error('Supabase auth error:', e);
        showToast('Unable to verify your admin account. Please try again.', 'error');
        return false;
      }
    }
    showToast('Supabase is not configured. Admin sign-in is unavailable.', 'error');
    return false;
  };

  const logoutAdmin = () => {
    supabase?.auth.signOut().catch(() => undefined);
    setIsAdminLoggedIn(false);
    setAdminDisplayName('Admin');
    showToast('Logged out successfully', 'info');
    navigate('/admin/login');
  };

  // -------------------------------------------------------------
  // DATABASE BACKED ACTIONS (All mutations persist to Database)
  // -------------------------------------------------------------

  // Add Booking
  const addBooking = async (
    bookingData: Omit<Booking, 'id' | 'booking_reference' | 'created_at' | 'updated_at' | 'status'>
  ): Promise<Booking> => {
    const ref = generateBookingReference();
    const newBooking: Booking = {
      ...bookingData,
      id: crypto.randomUUID(),
      booking_reference: ref,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 1. Optimistic State Update
    setBookings(prev => [newBooking, ...prev]);
    setLastCreatedBooking(newBooking);
    showToast(`Booking request #${ref} submitted! ${siteSettings.driver_name} will confirm shortly.`, 'success');

    // 2. Persist the public booking directly to Supabase.
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('bookings').insert([{
          booking_reference: ref,
          customer_name: bookingData.customer_name,
          email: bookingData.email,
          phone: bookingData.phone,
          whatsapp: bookingData.whatsapp,
          service_id: isUuid(bookingData.service_id) ? bookingData.service_id : null,
          service_name: bookingData.service_name,
          tour_id: isUuid(bookingData.tour_id) ? bookingData.tour_id : null,
          tour_title: bookingData.tour_title,
          pickup_location: bookingData.pickup_location,
          destination: bookingData.destination,
          travel_date: bookingData.travel_date,
          pickup_time: bookingData.pickup_time,
          passengers: bookingData.passengers,
          luggage: bookingData.luggage,
          flight_number: bookingData.flight_number,
          hotel_name: bookingData.hotel_name,
          special_requests: bookingData.special_requests,
          estimated_price: bookingData.estimated_price,
          currency: bookingData.currency,
          status: 'pending',
        }]);
      } catch (e) {
        console.error('Error saving booking to Supabase:', e);
      }
    }

    return newBooking;
  };

  const updateBookingStatus = async (id: string, status: BookingStatus, notes?: string) => {
    const updates = {
      status,
      admin_notes: notes,
      updated_at: new Date().toISOString()
    };

    setBookings(prev => prev.map(b => {
      if (b.id === id) {
        return {
          ...b,
          status,
          admin_notes: notes !== undefined ? notes : b.admin_notes,
          updated_at: new Date().toISOString()
        };
      }
      return b;
    }));

    await api.updateItem('bookings', id, updates);
    showToast(`Booking status updated to ${status}`);
  };

  const updateBookingDetails = async (id: string, updates: Partial<Booking>) => {
    setBookings(prev => prev.map(b => {
      if (b.id === id) {
        return {
          ...b,
          ...updates,
          updated_at: new Date().toISOString()
        };
      }
      return b;
    }));

    await api.updateItem('bookings', id, updates);
    showToast('Booking details updated');
  };

  const deleteBooking = async (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
    await api.deleteItem('bookings', id);
    showToast('Booking deleted', 'info');
  };

  // Add Contact Message
  const addContactMessage = async (
    msg: Omit<ContactMessage, 'id' | 'status' | 'created_at' | 'updated_at'>
  ): Promise<ContactMessage> => {
    const newMsg: ContactMessage = {
      ...msg,
      id: crypto.randomUUID(),
      status: 'unread',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setMessages(prev => [newMsg, ...prev]);
    showToast(`Message sent to ${siteSettings.driver_name}! We will respond promptly.`, 'success');

    // Persist the public message directly to Supabase.
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('contact_messages').insert([newMsg]);
      } catch (e) {
        console.error('Error saving contact message to Supabase:', e);
      }
    }

    return newMsg;
  };

  const updateMessageStatus = async (id: string, status: 'unread' | 'read' | 'archived') => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status, updated_at: new Date().toISOString() } : m));
    await api.updateItem('messages', id, { status });
  };

  const deleteContactMessage = async (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    await api.deleteItem('messages', id);
    showToast('Message deleted', 'info');
  };

  // Tours CMS (Database Persisted)
  const saveTour = async (tour: Partial<Tour>) => {
    if (tour.id) {
      const saved = await api.updateItem('tours', tour.id, tour);
      if (!saved) {
        showToast(`Tour was not saved: ${api.getLastWriteError() || 'Confirm this account has Supabase admin access, then try again.'}`, 'error');
        return false;
      }
      setTours(prev => prev.map(t => t.id === tour.id ? { ...t, ...tour, updated_at: new Date().toISOString() } as Tour : t));
      showToast('Tour updated in database');
      return true;
    } else {
      const newTour: Tour = {
        id: crypto.randomUUID(),
        title: tour.title || 'New Tour',
        slug: tour.slug || 'new-tour-' + Date.now(),
        short_description: tour.short_description || '',
        description: tour.description || '',
        duration: tour.duration || 'Full Day',
        starting_price: tour.starting_price || 40,
        currency: tour.currency || siteSettings.currency_settings.default_currency,
        pickup_location: tour.pickup_location || 'Hotel Pickup',
        departure_time: tour.departure_time || '08:00 AM',
        highlights: tour.highlights || [],
        itinerary: tour.itinerary || [],
        included: tour.included || [],
        excluded: tour.excluded || [],
        important_information: tour.important_information || [],
        featured_image: tour.featured_image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
        gallery: tour.gallery || [],
        vehicle_type: tour.vehicle_type || 'Sedan / SUV / Van',
        max_passengers: tour.max_passengers || 10,
        is_featured: tour.is_featured ?? false,
        is_active: tour.is_active ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const savedTour = await api.insertItem('tours', newTour);
      if (!savedTour) {
        showToast(`Tour was not saved: ${api.getLastWriteError() || 'Confirm this account has Supabase admin access, then try again.'}`, 'error');
        return false;
      }
      setTours(prev => [{ ...newTour, ...savedTour } as Tour, ...prev]);
      showToast('Tour saved to database');
      return true;
    }
  };

  const deleteTour = async (id: string) => {
    setTours(prev => prev.filter(t => t.id !== id));
    await api.deleteItem('tours', id);
    showToast('Tour deleted from database', 'info');
  };

  // Destinations CMS (Database Persisted)
  const saveDestination = async (destination: Partial<Destination>) => {
    if (destination.id) {
      const saved = await api.updateItem('destinations', destination.id, destination);
      if (!saved) {
        showToast('Destination was not saved. Confirm this account has Supabase admin access, then try again.', 'error');
        return;
      }
      setDestinations(prev => prev.map(d => d.id === destination.id ? { ...d, ...destination, updated_at: new Date().toISOString() } as Destination : d));
      showToast('Destination updated in database');
    } else {
      const newDest: Destination = {
        id: crypto.randomUUID(),
        name: destination.name || 'New Destination',
        slug: destination.slug || 'destination-' + Date.now(),
        short_description: destination.short_description || '',
        description: destination.description || '',
        things_to_do: destination.things_to_do || [],
        travel_tips: destination.travel_tips || '',
        featured_image: destination.featured_image || 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1200&auto=format&fit=crop',
        gallery: destination.gallery || [],
        is_featured: destination.is_featured ?? false,
        is_active: destination.is_active ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const savedDestination = await api.insertItem('destinations', newDest);
      if (!savedDestination) {
        showToast('Destination was not saved. Confirm this account has Supabase admin access, then try again.', 'error');
        return;
      }
      setDestinations(prev => [{ ...newDest, ...savedDestination } as Destination, ...prev]);
      showToast('Destination saved to database');
    }
  };

  const deleteDestination = async (id: string) => {
    setDestinations(prev => prev.filter(d => d.id !== id));
    await api.deleteItem('destinations', id);
    showToast('Destination deleted from database', 'info');
  };

  // Services CMS (Database Persisted)
  const saveService = async (service: Partial<Service>) => {
    if (service.id) {
      const saved = await api.updateItem('services', service.id, service);
      if (!saved) {
        showToast('Service was not saved. Confirm this account has Supabase admin access, then try again.', 'error');
        return;
      }
      setServices(prev => prev.map(s => s.id === service.id ? { ...s, ...service, updated_at: new Date().toISOString() } as Service : s));
      showToast('Service updated in database');
    } else {
      const newSrv: Service = {
        id: crypto.randomUUID(),
        name: service.name || 'New Service',
        slug: service.slug || 'service-' + Date.now(),
        short_description: service.short_description || '',
        description: service.description || '',
        icon: service.icon || 'Car',
        featured_image: service.featured_image || 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=1200&auto=format&fit=crop',
        starting_price: service.starting_price || 15,
        currency: service.currency || siteSettings.currency_settings.default_currency,
        features: service.features || [],
        included_items: service.included_items || [],
        cta_text: service.cta_text || 'Book Service',
        cta_link: service.cta_link || '/book',
        is_featured: service.is_featured ?? true,
        is_active: service.is_active ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const savedService = await api.insertItem('services', newSrv);
      if (!savedService) {
        showToast('Service was not saved. Confirm this account has Supabase admin access, then try again.', 'error');
        return;
      }
      setServices(prev => [{ ...newSrv, ...savedService } as Service, ...prev]);
      showToast('Service saved to database');
    }
  };

  const deleteService = async (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    await api.deleteItem('services', id);
    showToast('Service deleted from database', 'info');
  };

  // Reviews CMS & Moderation (Database Persisted)
  const saveReview = async (rev: Partial<Review>) => {
    if (rev.id) {
      setReviews(prev => prev.map(r => r.id === rev.id ? { 
        ...r, 
        ...rev, 
        updated_at: new Date().toISOString() 
      } as Review : r));
      await api.updateItem('reviews', rev.id, rev);
      showToast('Review updated in database');
    } else {
      const isAutoApproved = rev.status === 'approved' || (rev.source === 'google' && rev.status !== 'rejected');
      const newRev: Review = {
        id: crypto.randomUUID(),
        customer_name: rev.customer_name || 'Guest Traveler',
        country: rev.country || 'International',
        rating: rev.rating || 5,
        review: rev.review || '',
        image_url: rev.image_url,
        trip_type: rev.trip_type || 'Private Tour',
        source: rev.source || 'website',
        google_review_url: rev.google_review_url || siteSettings.google_maps_url,
        is_featured: rev.is_featured ?? false,
        is_published: rev.is_published ?? (isAutoApproved ? true : false),
        status: rev.status ?? (isAutoApproved ? 'approved' : 'pending'),
        rejection_reason: rev.rejection_reason,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setReviews(prev => [newRev, ...prev]);
      await api.insertItem('reviews', newRev);
      if (newRev.status === 'pending') {
        showToast('Review submitted! It will appear on homepage once approved by admin.');
      } else {
        showToast('Review created and saved to database');
      }
    }
  };

  const approveReview = async (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? {
      ...r,
      status: 'approved',
      is_published: true,
      updated_at: new Date().toISOString()
    } : r));
    await api.updateItem('reviews', id, { status: 'approved', is_published: true });
    showToast('Review approved & published to website homepage!');
  };

  const rejectReview = async (id: string, reason?: string) => {
    setReviews(prev => prev.map(r => r.id === id ? {
      ...r,
      status: 'rejected',
      is_published: false,
      rejection_reason: reason || 'Rejected by administrator',
      updated_at: new Date().toISOString()
    } : r));
    await api.updateItem('reviews', id, { status: 'rejected', is_published: false, rejection_reason: reason });
    showToast('Review rejected and removed from homepage', 'info');
  };

  const toggleReviewPublish = async (id: string) => {
    let nextPublished = false;
    setReviews(prev => prev.map(r => {
      if (r.id === id) {
        nextPublished = !r.is_published;
        return {
          ...r,
          is_published: nextPublished,
          status: nextPublished ? 'approved' : 'rejected',
          updated_at: new Date().toISOString(),
        };
      }
      return r;
    }));
    await api.updateItem('reviews', id, { is_published: nextPublished, status: nextPublished ? 'approved' : 'rejected' });
    showToast('Review visibility updated in database');
  };

  const deleteReview = async (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    await api.deleteItem('reviews', id);
    showToast('Review deleted from database', 'info');
  };

  // FAQ CMS (Database Persisted)
  const saveFAQ = async (faq: Partial<FAQ>) => {
    if (faq.id) {
      setFaqs(prev => prev.map(f => f.id === faq.id ? { ...f, ...faq, updated_at: new Date().toISOString() } as FAQ : f));
      await api.updateItem('faqs', faq.id, faq);
      showToast('FAQ updated in database');
    } else {
      const newFaq: FAQ = {
        id: crypto.randomUUID(),
        question: faq.question || '',
        answer: faq.answer || '',
        category: faq.category || 'general',
        sort_order: faq.sort_order || faqs.length + 1,
        is_published: faq.is_published ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setFaqs(prev => [...prev, newFaq]);
      await api.insertItem('faqs', newFaq);
      showToast('FAQ saved to database');
    }
  };

  const deleteFAQ = async (id: string) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
    await api.deleteItem('faqs', id);
    showToast('FAQ deleted from database', 'info');
  };

  // Routes Pricing CMS (Database Persisted)
  const saveRoute = async (route: Partial<RoutePricing>) => {
    if (route.id) {
      setRoutes(prev => prev.map(r => r.id === route.id ? { ...r, ...route, updated_at: new Date().toISOString() } as RoutePricing : r));
      await api.updateItem('routes', route.id, route);
      showToast('Route pricing updated in database');
    } else {
      const newRoute: RoutePricing = {
        id: crypto.randomUUID(),
        slug: route.slug || 'route-' + Date.now(),
        origin: route.origin || '',
        destination: route.destination || '',
        route_name: route.route_name || `${route.origin} ↔ ${route.destination}`,
        estimated_duration: route.estimated_duration || '3 hours',
        distance_km: route.distance_km || 100,
        sedan_price: route.sedan_price || 50,
        suv_price: route.suv_price || 70,
        van_price: route.van_price || 100,
        currency: route.currency || siteSettings.currency_settings.default_currency,
        is_popular: route.is_popular ?? true,
        is_airport: route.is_airport ?? false,
        airport_code: route.airport_code,
        description: route.description || '',
        highlights: route.highlights || ['Air conditioning', 'Door to door', 'Cold water'],
        image_url: route.image_url || 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=800&auto=format&fit=crop',
        is_published: route.is_published ?? true,
        sort_order: route.sort_order || routes.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setRoutes(prev => [newRoute, ...prev]);
      await api.insertItem('routes', newRoute);
      showToast('New route added to database');
    }
  };

  const deleteRoute = async (id: string) => {
    setRoutes(prev => prev.filter(r => r.id !== id));
    await api.deleteItem('routes', id);
    showToast('Route removed from database', 'info');
  };

  // Vehicles CMS (Database Persisted)
  const saveVehicle = async (vehicle: Partial<Vehicle>) => {
    if (vehicle.id) {
      setVehicles(prev => prev.map(v => v.id === vehicle.id ? { ...v, ...vehicle, updated_at: new Date().toISOString() } as Vehicle : v));
      await api.updateItem('vehicles', vehicle.id, vehicle);
      showToast('Vehicle updated in database');
    } else {
      const newVeh: Vehicle = {
        id: crypto.randomUUID(),
        name: vehicle.name || 'New Vehicle',
        category: vehicle.category || 'sedan',
        models: vehicle.models || 'Toyota Model',
        capacity_passengers: vehicle.capacity_passengers || 4,
        capacity_luggage: vehicle.capacity_luggage || 3,
        description: vehicle.description || '',
        price_from: vehicle.price_from || 20,
        currency: vehicle.currency || siteSettings.currency_settings.default_currency,
        features: vehicle.features || ['Air Conditioning', 'Cold Water', 'Phone Charger'],
        image_url: vehicle.image_url || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1000&auto=format&fit=crop',
        has_air_con: vehicle.has_air_con ?? true,
        is_popular: vehicle.is_popular ?? false,
        is_active: vehicle.is_active ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setVehicles(prev => [...prev, newVeh]);
      await api.insertItem('vehicles', newVeh);
      showToast('Vehicle added to database');
    }
  };

  const deleteVehicle = async (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
    await api.deleteItem('vehicles', id);
    showToast('Vehicle deleted from database', 'info');
  };

  // Airports CMS (Database Persisted)
  const saveAirport = async (airport: Partial<Airport>) => {
    if (airport.id) {
      setAirports(prev => prev.map(a => a.id === airport.id ? { ...a, ...airport } as Airport : a));
      await api.updateItem('airports', airport.id, airport);
      showToast('Airport updated in database');
    } else {
      const newApt: Airport = {
        id: crypto.randomUUID(),
        code: airport.code || 'NEW',
        name: airport.name || 'New Airport',
        city: airport.city || 'Cambodia',
        province: airport.province || '',
        description: airport.description || '',
        image_url: airport.image_url || 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=1000&auto=format&fit=crop',
        pickup_instructions: airport.pickup_instructions || 'Meet driver outside arrival hall with name card.',
        is_active: airport.is_active ?? true,
      };
      setAirports(prev => [...prev, newApt]);
      await api.insertItem('airports', newApt);
      showToast('Airport added to database');
    }
  };

  const deleteAirport = async (id: string) => {
    setAirports(prev => prev.filter(a => a.id !== id));
    await api.deleteItem('airports', id);
    showToast('Airport deleted from database', 'info');
  };

  // Why Choose Us CMS (Database Persisted)
  const saveWhyChooseUsBenefit = async (benefit: Partial<WhyChooseUsBenefit>) => {
    if (benefit.id) {
      setWhyChooseUs(prev => prev.map(b => b.id === benefit.id ? { ...b, ...benefit } as WhyChooseUsBenefit : b));
      await api.updateItem('whyChooseUs', benefit.id, benefit);
      showToast('Benefit updated in database');
    } else {
      const newBenefit: WhyChooseUsBenefit = {
        id: 'benefit-' + Date.now(),
        title: benefit.title || 'Direct Booking Benefit',
        description: benefit.description || '',
        icon: benefit.icon || 'ShieldCheck',
        badge: benefit.badge || 'Advantage',
        display_order: benefit.display_order || whyChooseUs.length + 1,
        is_active: benefit.is_active ?? true,
      };
      setWhyChooseUs(prev => [...prev, newBenefit]);
      await api.insertItem('whyChooseUs', newBenefit);
      showToast('New benefit added to database');
    }
  };

  const deleteWhyChooseUsBenefit = async (id: string) => {
    setWhyChooseUs(prev => prev.filter(b => b.id !== id));
    await api.deleteItem('whyChooseUs', id);
    showToast('Benefit removed from database', 'info');
  };

  // Media Library CMS (Database Persisted)
  const saveMediaItem = async (item: Partial<MediaItem>) => {
    if (item.id) {
      setMediaItems(prev => prev.map(m => m.id === item.id ? { ...m, ...item } as MediaItem : m));
      await api.updateItem('mediaItems', item.id, item);
      showToast('Media updated in database');
    } else {
      const newItem: MediaItem = {
        id: crypto.randomUUID(),
        title: item.title || 'Uploaded Asset',
        url: item.url || '',
        category: item.category || 'general',
        created_at: new Date().toISOString(),
      };
      setMediaItems(prev => [newItem, ...prev]);
      await api.insertItem('mediaItems', newItem);
      showToast('Media added to database');
    }
  };

  const deleteMediaItem = async (id: string) => {
    setMediaItems(prev => prev.filter(m => m.id !== id));
    await api.deleteItem('mediaItems', id);
    showToast('Media removed from database', 'info');
  };

  // Settings Singletons (Database Persisted)
  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const updated = {
      ...siteSettings,
      ...newSettings,
      updated_at: new Date().toISOString()
    };
    setSiteSettings(updated);
    await api.updateSingleton('siteSettings', updated);
    showToast('Website settings saved to database');
  };

  const updateHomepageSettings = async (newSettings: Partial<HomepageSettings>) => {
    const updated = {
      ...homepageSettings,
      ...newSettings,
    };
    setHomepageSettings(updated);
    await api.updateSingleton('homepageSettings', updated);
    showToast('Homepage configuration saved to database');
  };

  const updateDriverProfile = async (newProfile: Partial<DriverProfile>) => {
    const updated = {
      ...driverProfile,
      ...newProfile,
      updated_at: new Date().toISOString(),
    };
    setDriverProfile(updated);
    await api.updateSingleton('driverProfile', updated);
    showToast('Driver profile saved to database');
  };

  const updateSEOSettings = async (newSeo: Partial<SEOSettings>) => {
    const updated = {
      ...seoSettings,
      ...newSeo,
    };
    setSeoSettings(updated);
    await api.updateSingleton('seoSettings', updated);
    showToast('SEO settings saved to database');
  };

  const resetToDefaults = async () => {
    setDbStatus('syncing');
    const fresh = await api.resetDatabase();
    if (fresh) {
      setSiteSettings(fresh.siteSettings);
      setHomepageSettings(fresh.homepageSettings);
      setDriverProfile(fresh.driverProfile);
      setWhyChooseUs(fresh.whyChooseUs);
      setServices(fresh.services);
      setTours(fresh.tours);
      setDestinations(fresh.destinations);
      setBookings(fresh.bookings);
      setReviews(fresh.reviews);
      setMessages(fresh.messages);
      setFaqs(fresh.faqs);
      setVehicles(fresh.vehicles);
      setRoutes(fresh.routes);
      setAirports(fresh.airports);
      setMediaItems(fresh.mediaItems);
      setSeoSettings(fresh.seoSettings);
    } else {
      setSiteSettings(INITIAL_SITE_SETTINGS);
      setHomepageSettings(INITIAL_HOMEPAGE_SETTINGS);
      setDriverProfile(INITIAL_DRIVER_PROFILE);
      setWhyChooseUs(INITIAL_WHY_CHOOSE_US);
      setServices(INITIAL_SERVICES);
      setTours(INITIAL_TOURS);
      setDestinations(INITIAL_DESTINATIONS);
      setBookings(INITIAL_BOOKINGS);
      setReviews(INITIAL_REVIEWS);
      setMessages(INITIAL_MESSAGES);
      setFaqs(INITIAL_FAQS);
      setVehicles(INITIAL_VEHICLES);
      setRoutes(INITIAL_ROUTES);
      setAirports(INITIAL_AIRPORTS);
      setMediaItems(INITIAL_MEDIA_ITEMS);
      setSeoSettings(INITIAL_SEO_SETTINGS);
    }
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setDbStatus('connected');
    showToast('Database reset to initial factory defaults', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentPath,
        navigate,
        language,
        setLanguage,
        t,
        dbStatus,
        isDbLoaded,
        refreshDatabase,
        isAdminLoggedIn,
        isAdminAuthenticated: isAdminLoggedIn,
        adminDisplayName,
        loginAdmin,
        logoutAdmin,
        siteSettings,
        homepageSettings,
        driverProfile,
        whyChooseUs,
        services,
        tours,
        destinations,
        bookings,
        reviews,
        messages,
        faqs,
        vehicles,
        routes,
        airports,
        mediaItems,
        seoSettings,
        notifications,
        showToast,
        removeToast,
        addBooking,
        updateBookingStatus,
        updateBookingDetails,
        deleteBooking,
        addContactMessage,
        updateMessageStatus,
        deleteContactMessage,
        markMessageRead: (id: string) => updateMessageStatus(id, 'read'),
        deleteMessage: deleteContactMessage,
        saveTour,
        deleteTour,
        saveDestination,
        deleteDestination,
        saveService,
        deleteService,
        saveReview,
        approveReview,
        rejectReview,
        toggleReviewPublish,
        deleteReview,
        saveFAQ,
        deleteFAQ,
        saveRoute,
        deleteRoute,
        saveVehicle,
        deleteVehicle,
        saveAirport,
        deleteAirport,
        saveWhyChooseUsBenefit,
        deleteWhyChooseUsBenefit,
        saveMediaItem,
        deleteMediaItem,
        updateSettings,
        updateHomepageSettings,
        updateDriverProfile,
        updateSEOSettings,
        resetToDefaults,
        lastCreatedBooking,
        setLastCreatedBooking,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
