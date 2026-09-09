import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { FloatingWhatsApp } from './components/layout/FloatingWhatsApp';
import { MobileBottomBar } from './components/public/MobileBottomBar';
import { Toast } from './components/layout/Toast';

// Public views
import { HomePage } from './components/public/views/HomePage';
import { AboutPage } from './components/public/views/AboutPage';
import { ServicesPage } from './components/public/views/ServicesPage';
import { ServiceDetailPage } from './components/public/views/ServiceDetailPage';
import { TransfersPage } from './components/public/views/TransfersPage';
import { AirportTransfersPage } from './components/public/views/AirportTransfersPage';
import { VehiclesPage } from './components/public/views/VehiclesPage';
import { RouteLandingPage } from './components/public/views/RouteLandingPage';
import { ToursPage } from './components/public/views/ToursPage';
import { TourDetailPage } from './components/public/views/TourDetailPage';
import { DestinationsPage } from './components/public/views/DestinationsPage';
import { DestinationDetailPage } from './components/public/views/DestinationDetailPage';
import { PrivateDriverPage } from './components/public/views/PrivateDriverPage';
import { BookPage } from './components/public/views/BookPage';
import { ContactPage } from './components/public/views/ContactPage';
import { PrivacyPage } from './components/public/views/PrivacyPage';
import { TermsPage } from './components/public/views/TermsPage';
import { NotFoundPage } from './components/public/views/NotFoundPage';

// Admin components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminBookings } from './components/admin/AdminBookings';
import { AdminRoutes } from './components/admin/AdminRoutes';
import { AdminAirports } from './components/admin/AdminAirports';
import { AdminVehicles } from './components/admin/AdminVehicles';
import { AdminHomepage } from './components/admin/AdminHomepage';
import { AdminDriverProfile } from './components/admin/AdminDriverProfile';
import { AdminWhyChooseUs } from './components/admin/AdminWhyChooseUs';
import { AdminTours } from './components/admin/AdminTours';
import { AdminDestinations } from './components/admin/AdminDestinations';
import { AdminServices } from './components/admin/AdminServices';
import { AdminReviews } from './components/admin/AdminReviews';
import { AdminMessages } from './components/admin/AdminMessages';
import { AdminFAQs } from './components/admin/AdminFAQs';
import { AdminSEO } from './components/admin/AdminSEO';
import { AdminMedia } from './components/admin/AdminMedia';
import { AdminSettings } from './components/admin/AdminSettings';

const RouterContent: React.FC = () => {
  const { currentPath, isAdminAuthenticated, routes, tours, destinations, services, seoSettings } = useApp();

  // Extract base path without query string
  const pathWithoutQuery = currentPath.split('?')[0];

  // Dynamic SEO & Title Synchronization
  useEffect(() => {
    let title = seoSettings?.meta_title || 'Cambodia Taxi Cab — Private Taxi & Tour Driver Service in Cambodia';
    let description = seoSettings?.meta_description || 'Direct door-to-door private transfers, airport pickups, and tours in Cambodia with professional drivers on cambodiataxicab.com.';

    // Admin Routes
    if (pathWithoutQuery === '/admin/login') {
      title = 'Driver Admin Login | Cambodia Taxi Cab';
    } else if (pathWithoutQuery.startsWith('/admin')) {
      const subPath = pathWithoutQuery.replace('/admin', '').replace('/', '');
      const tabTitle = subPath ? subPath.charAt(0).toUpperCase() + subPath.slice(1).replace('-', ' ') : 'Dashboard';
      title = `${tabTitle} | Driver Admin Portal - Cambodia Taxi Cab`;
    }
    // Public Routes
    else if (pathWithoutQuery === '/') {
      title = seoSettings?.meta_title || 'Cambodia Taxi Cab — Private Taxi & Tour Driver Service in Cambodia';
    } else if (pathWithoutQuery === '/airport-transfers') {
      title = 'Phnom Penh & Siem Reap Airport Transfers | Cambodia Taxi Cab';
      description = 'Fixed price airport taxi pickups at Phnom Penh (PNH) and Siem Reap Angkor (SAI) with flight delay monitoring.';
    } else if (pathWithoutQuery === '/transfers') {
      title = 'Popular Intercity Taxi Routes & Prices | Cambodia Taxi Cab';
      description = 'View transparent fixed prices for private taxi transfers between Phnom Penh, Siem Reap, Sihanoukville, Kampot & more on cambodiataxicab.com.';
    } else if (pathWithoutQuery === '/vehicles') {
      title = 'Vehicle Fleet & Taxi Options | Cambodia Taxi Cab';
      description = 'Clean, modern air-conditioned Sedan, Luxury SUV, and Executive Minivans for safe travel in Cambodia.';
    } else if (pathWithoutQuery === '/tours') {
      title = 'Private Sightseeing & Temple Tours | Cambodia Taxi Cab';
      description = 'Custom Angkor Wat sunrise tours, Phnom Penh city highlights, and countryside day trips with professional local drivers.';
    } else if (pathWithoutQuery.startsWith('/tours/')) {
      const slug = pathWithoutQuery.replace('/tours/', '');
      const tour = tours.find((t) => t.slug === slug);
      if (tour) {
        title = `${tour.title} | Cambodia Taxi Cab Tours`;
        description = tour.short_description || description;
      }
    } else if (pathWithoutQuery === '/destinations') {
      title = 'Cambodia Travel Destinations & Taxi Guide | Cambodia Taxi Cab';
      description = 'Explore top destinations across Cambodia including Siem Reap, Phnom Penh, Kampot, Kep, and Koh Rong.';
    } else if (pathWithoutQuery.startsWith('/destinations/')) {
      const slug = pathWithoutQuery.replace('/destinations/', '');
      const dest = destinations.find((d) => d.slug === slug);
      if (dest) {
        title = `${dest.name} Taxi & Travel Guide | Cambodia Taxi Cab`;
        description = dest.short_description || description;
      }
    } else if (pathWithoutQuery === '/services') {
      title = 'Transportation Services | Cambodia Taxi Cab';
      description = 'Private airport transfers, city taxis, overland transfers, and private hourly driver services in Cambodia.';
    } else if (pathWithoutQuery.startsWith('/services/')) {
      const slug = pathWithoutQuery.replace('/services/', '');
      const srv = services.find((s) => s.slug === slug);
      if (srv) {
        title = `${srv.title} | Cambodia Taxi Cab`;
        description = srv.short_description || description;
      }
    } else if (pathWithoutQuery === '/private-driver') {
      title = 'Hire a Private Driver with Car in Cambodia | Cambodia Taxi Cab';
      description = 'Reliable English-speaking private driver for flexible daily hire, business travel, and family vacations.';
    } else if (pathWithoutQuery === '/book') {
      title = 'Book Your Ride & Instant Quote | Cambodia Taxi Cab';
      description = 'Instant online booking for private taxi transfers in Cambodia. 100% fixed transparent pricing on cambodiataxicab.com.';
    } else if (pathWithoutQuery === '/contact') {
      title = 'Contact Driver Team | Cambodia Taxi Cab';
      description = 'Get in touch directly with our English-speaking driver team via WhatsApp (+855 16 509 371) or contact form.';
    } else if (pathWithoutQuery === '/about') {
      title = 'About Cambodia Taxi Cab | Trusted Local Fleet & Transport';
      description = 'Over 10 years of safe driving experience, 1,800+ completed trips, and 5.0-star traveler ratings across Cambodia on cambodiataxicab.com.';
    } else if (pathWithoutQuery === '/privacy') {
      title = 'Privacy Policy | Cambodia Taxi Cab';
    } else if (pathWithoutQuery === '/terms') {
      title = 'Terms & Conditions | Cambodia Taxi Cab';
    } else {
      const matchedRoute = routes.find((r) => `/${r.slug}` === pathWithoutQuery);
      if (matchedRoute) {
        title = `${matchedRoute.title} | Fixed Price Taxi - Cambodia Taxi Cab`;
        description = matchedRoute.short_description || description;
      }
    }

    // Update Browser Document Title
    document.title = title;

    // Update Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    // Update OpenGraph Title & Description
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', description);
    }
  }, [pathWithoutQuery, routes, tours, destinations, services, seoSettings]);

  // Check if route is an Admin route
  if (pathWithoutQuery.startsWith('/admin')) {
    if (pathWithoutQuery === '/admin/login') {
      return <AdminLoginPage />;
    }

    if (!isAdminAuthenticated) {
      return <AdminLoginPage />;
    }

    let activeTab = 'dashboard';
    let adminComponent = <AdminDashboard />;

    if (pathWithoutQuery === '/admin/bookings') {
      activeTab = 'bookings';
      adminComponent = <AdminBookings />;
    } else if (pathWithoutQuery === '/admin/routes') {
      activeTab = 'routes';
      adminComponent = <AdminRoutes />;
    } else if (pathWithoutQuery === '/admin/airports') {
      activeTab = 'airports';
      adminComponent = <AdminAirports />;
    } else if (pathWithoutQuery === '/admin/vehicles') {
      activeTab = 'vehicles';
      adminComponent = <AdminVehicles />;
    } else if (pathWithoutQuery === '/admin/homepage') {
      activeTab = 'homepage';
      adminComponent = <AdminHomepage />;
    } else if (pathWithoutQuery === '/admin/driver-profile') {
      activeTab = 'driver-profile';
      adminComponent = <AdminDriverProfile />;
    } else if (pathWithoutQuery === '/admin/why-choose-us') {
      activeTab = 'why-choose-us';
      adminComponent = <AdminWhyChooseUs />;
    } else if (pathWithoutQuery === '/admin/tours') {
      activeTab = 'tours';
      adminComponent = <AdminTours />;
    } else if (pathWithoutQuery === '/admin/destinations') {
      activeTab = 'destinations';
      adminComponent = <AdminDestinations />;
    } else if (pathWithoutQuery === '/admin/services') {
      activeTab = 'services';
      adminComponent = <AdminServices />;
    } else if (pathWithoutQuery === '/admin/reviews') {
      activeTab = 'reviews';
      adminComponent = <AdminReviews />;
    } else if (pathWithoutQuery === '/admin/messages') {
      activeTab = 'messages';
      adminComponent = <AdminMessages />;
    } else if (pathWithoutQuery === '/admin/faqs') {
      activeTab = 'faqs';
      adminComponent = <AdminFAQs />;
    } else if (pathWithoutQuery === '/admin/seo') {
      activeTab = 'seo';
      adminComponent = <AdminSEO />;
    } else if (pathWithoutQuery === '/admin/media') {
      activeTab = 'media';
      adminComponent = <AdminMedia />;
    } else if (pathWithoutQuery === '/admin/settings') {
      activeTab = 'settings';
      adminComponent = <AdminSettings />;
    }

    return <AdminLayout activeTab={activeTab}>{adminComponent}</AdminLayout>;
  }

  // Public Route Matching
  let viewComponent = <NotFoundPage />;

  // Match known specific route landing page slugs
  const matchedRoute = routes.find(r => `/${r.slug}` === pathWithoutQuery);

  if (pathWithoutQuery === '/') {
    viewComponent = <HomePage />;
  } else if (pathWithoutQuery === '/airport-transfers') {
    viewComponent = <AirportTransfersPage />;
  } else if (pathWithoutQuery === '/vehicles') {
    viewComponent = <VehiclesPage />;
  } else if (pathWithoutQuery === '/about') {
    viewComponent = <AboutPage />;
  } else if (pathWithoutQuery === '/services') {
    viewComponent = <ServicesPage />;
  } else if (pathWithoutQuery.startsWith('/services/')) {
    const slug = pathWithoutQuery.replace('/services/', '');
    viewComponent = <ServiceDetailPage slug={slug} />;
  } else if (pathWithoutQuery === '/transfers') {
    viewComponent = <TransfersPage />;
  } else if (matchedRoute) {
    viewComponent = <RouteLandingPage routeSlug={matchedRoute.slug} />;
  } else if (pathWithoutQuery === '/tours') {
    viewComponent = <ToursPage />;
  } else if (pathWithoutQuery.startsWith('/tours/')) {
    const slug = pathWithoutQuery.replace('/tours/', '');
    viewComponent = <TourDetailPage slug={slug} />;
  } else if (pathWithoutQuery === '/destinations') {
    viewComponent = <DestinationsPage />;
  } else if (pathWithoutQuery.startsWith('/destinations/')) {
    const slug = pathWithoutQuery.replace('/destinations/', '');
    viewComponent = <DestinationDetailPage slug={slug} />;
  } else if (pathWithoutQuery === '/private-driver') {
    viewComponent = <PrivateDriverPage />;
  } else if (pathWithoutQuery === '/book') {
    viewComponent = <BookPage />;
  } else if (pathWithoutQuery === '/contact') {
    viewComponent = <ContactPage />;
  } else if (pathWithoutQuery === '/privacy') {
    viewComponent = <PrivacyPage />;
  } else if (pathWithoutQuery === '/terms') {
    viewComponent = <TermsPage />;
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 flex flex-col font-sans selection:bg-red-600 selection:text-white pb-14 md:pb-0">
      <Header />
      <main className="flex-1">{viewComponent}</main>
      <Footer />
      <FloatingWhatsApp />
      <MobileBottomBar />
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <RouterContent />
    </AppProvider>
  );
}

export default App;
