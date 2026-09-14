import React from 'react';
import { useApp } from '../../../context/AppContext';
import { BookingWidget } from '../BookingWidget';
import { AirportTransfersSection } from '../AirportTransfersSection';
import { PopularRoutesSection } from '../PopularRoutesSection';
import { VehicleSelectionSection } from '../VehicleSelectionSection';
import { DriverProfileSection } from '../DriverProfileSection';
import { GoogleReviewsSection } from '../GoogleReviewsSection';
import { WhyBookDirectSection } from '../WhyBookDirectSection';
import { DiscountPromoSection } from '../DiscountPromoSection';
import { HowItWorks } from '../HowItWorks';
import { TourCard } from '../TourCard';
import { DestinationCard } from '../DestinationCard';
import { ServiceCard } from '../ServiceCard';
import { FAQAccordion } from '../FAQAccordion';
import { getWhatsAppGeneralUrl, getTelegramUrl } from '../../../lib/whatsapp';
import { ShieldCheck, MessageSquare, ArrowRight, Compass, Car, MapPin, Award, CheckCircle2, Star, Send, ChevronLeft, ChevronRight, Images, Layers } from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 'slide-1',
    src: '/background.webp',
    alt: 'Private Chauffeur Service in Cambodia',
    caption: 'Private Chauffeur',
    fallback: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: 'slide-2',
    src: '/bg1.jpg',
    alt: 'Airport Terminal Transfers & Meet and Greet',
    caption: 'Airport Transfers',
    fallback: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: 'slide-3',
    src: '/bg2.jpg',
    alt: 'Professional Licensed Driver Behind the Wheel',
    caption: 'Safe Travel',
    fallback: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: 'slide-4',
    src: encodeURI('/taxi one.png'),
    alt: '24/7 Dedicated Driver Dispatch & Online Booking',
    caption: '24/7 Dispatch',
    fallback: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: 'slide-5',
    src: '/back5.jpg',
    alt: 'Intercity Cambodia Sightseeing & Day Tours',
    caption: 'Custom Tours',
    fallback: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=2000&auto=format&fit=crop',
  },
];

export const HomePage: React.FC = () => {
  const { homepageSettings, tours = [], destinations = [], services = [], mediaItems = [], faqs = [], navigate, t, language } = useApp();
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  const slideIntervalMs = Math.max(1, homepageSettings?.hero?.slide_interval_seconds || 5) * 1000;

  // Auto-advance sliding background based on configured transition speed
  React.useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, slideIntervalMs);
    return () => clearInterval(interval);
  }, [isPaused, slideIntervalMs]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  // The live Supabase schema publishes content with is_active; older local demo
  // content also has is_featured. Prefer featured items when present, but never
  // leave a public homepage section blank merely because that legacy flag is absent.
  const activeTours = (tours || []).filter((t) => t && t.is_active);
  const activeDestinations = (destinations || []).filter((d) => d && d.is_active);
  const featuredTours = activeTours.some((t) => t.is_featured) ? activeTours.filter((t) => t.is_featured) : activeTours;
  const featuredDestinations = activeDestinations.some((d) => d.is_featured) ? activeDestinations.filter((d) => d.is_featured) : activeDestinations;
  const publishedFaqs = (faqs || []).filter((f) => f && f.is_published);
  const activeServices = (services || []).filter((service) => service && service.is_active).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  const homepageMedia = (mediaItems || []).filter((media) => media && media.url).slice(0, 6);

  return (
    <div className="space-y-0 text-slate-900 bg-[#F7F5F0]">
      
      {/* 1. HIGH-CONVERTING HERO SECTION WITH SLIDING BACKGROUND IMAGES */}
      <section 
        className="relative min-h-[90vh] flex items-center pt-28 pb-16 overflow-hidden bg-[#071B2E] text-white border-b border-slate-800"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        
        {/* Sliding Background Images Carousel Container */}
        <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
          {HERO_SLIDES.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? 'opacity-75 z-1' : 'opacity-0 z-0'
                }`}
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className={`w-full h-full object-cover object-center transition-transform duration-[7000ms] ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = slide.fallback;
                  }}
                />
              </div>
            );
          })}

          {/* Legibility and Ambient Lighting Gradients */}
          <div className="absolute inset-0 z-2 bg-gradient-to-r from-[#071B2E]/95 via-[#071B2E]/82 to-[#071B2E]/35" />
          <div className="absolute inset-0 z-2 bg-gradient-to-t from-[#071B2E]/80 via-transparent to-[#071B2E]/35" />
          <div className="absolute inset-0 z-2 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Headline & Trust Signals */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold tracking-wide">
                  <Car className="w-3.5 h-3.5 text-amber-300" />
                  <span>{t.hero.badge}</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-300/15 border border-amber-300/35 text-amber-200 text-[11px] font-extrabold uppercase tracking-wide">
                  <span>★ 10% Off Direct Booking</span>
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-sans tracking-tight leading-[1.08] drop-shadow-sm">
                {t.hero.title}
              </h1>

              <p className="text-sm sm:text-lg text-slate-200 font-medium leading-relaxed max-w-2xl">
                {t.hero.subtitle}
              </p>

              {/* Instant Trust Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 shadow-lg">
                  <div className="flex items-center gap-1 text-white font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    <span>5.0 Rating</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">420+ Happy Tourists</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 shadow-lg">
                  <div className="flex items-center gap-1 text-white font-bold text-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                    <span>Fixed Price</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">No Hidden Fees</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 shadow-lg col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-1 text-white font-bold text-xs">
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                    <span>English Driver</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">10+ Yrs Experience</div>
                </div>
              </div>

              {/* Direct Driver Contact & Slide Indicators */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <a
                    href={getWhatsAppGeneralUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-red-600" />
                    <span>WhatsApp: +855 16 509 371</span>
                  </a>
                  <a
                    href={getTelegramUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-red-600" />
                    <span>Telegram</span>
                  </a>
                </div>

                {/* Interactive Slide Controller Dots & Arrows */}
                <div className="flex items-center gap-2 bg-white/85 backdrop-blur-xs px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                  <button
                    onClick={handlePrevSlide}
                    aria-label="Previous slide"
                    className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1.5 px-1">
                    {HERO_SLIDES.map((slide, idx) => (
                      <button
                        key={slide.id}
                        onClick={() => setCurrentSlide(idx)}
                        aria-label={`Go to slide ${idx + 1}: ${slide.caption}`}
                        title={slide.caption}
                        className={`transition-all duration-300 rounded-full cursor-pointer ${
                          idx === currentSlide
                            ? 'w-5 h-2 bg-red-600'
                            : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleNextSlide}
                    aria-label="Next slide"
                    className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Right Booking Engine Widget */}
            <div className="lg:col-span-6">
              <BookingWidget />
            </div>

          </div>
        </div>

      </section>

      {/* 2. DEDICATED AIRPORT TRANSFERS */}
      <AirportTransfersSection />

      {/* 3. 10% DISCOUNT SPECIAL DIRECT PROMO */}
      <DiscountPromoSection />

      {/* 4. POPULAR ROUTES & PRICING TABLE */}
      <PopularRoutesSection />

      {/* 5. VEHICLES SELECTION */}
      <VehicleSelectionSection />

      {/* 6. SERVICES MANAGED IN THE ADMIN CMS */}
      {activeServices.length > 0 && (
        <section className="border-b border-slate-200 bg-white py-20 text-slate-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-600">
                  <Layers className="h-3.5 w-3.5" />
                  <span>Book with confidence</span>
                </div>
                <h2 className="font-sans text-2xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Our Transportation Services</h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">Choose an airport transfer, private city ride, long-distance transfer, or a driver for your custom Cambodia itinerary.</p>
              </div>
              <button onClick={() => navigate('/services')} className="inline-flex items-center gap-1.5 text-xs font-extrabold text-red-600 hover:text-red-700 cursor-pointer">
                <span>View All Services</span><ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeServices.slice(0, 6).map((service) => <ServiceCard key={service.id} service={service} />)}
            </div>
          </div>
        </section>
      )}

      {/* 6. HOW IT WORKS & DISPATCH DESK */}
      <HowItWorks />

      {/* 7. MEET SARATH (DRIVER PROFILE & TRUST) */}
      <DriverProfileSection />

      {/* 8. GOOGLE REVIEWS & TESTIMONIALS */}
      <GoogleReviewsSection />

      {/* 9. WHY BOOK DIRECT */}
      <WhyBookDirectSection />

      {/* 8. POPULAR PRIVATE TOURS */}
      <section className="py-20 bg-white border-b border-slate-200 text-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider mb-2">
                <Compass className="w-3.5 h-3.5 text-red-600" />
                <span>Custom Private Day Trips</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 font-sans tracking-tight">
                Featured Cambodia Tours
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Explore Cambodia at your own pace with a private air-conditioned car and knowledgeable driver.
              </p>
            </div>

            <button
              onClick={() => navigate('/tours')}
              className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-extrabold text-red-600 hover:text-red-700 cursor-pointer"
            >
              <span>View All Tours</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTours.slice(0, 3).map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>
      </section>

      {/* 9. TOP CAMBODIA DESTINATIONS */}
      <section className="py-20 bg-[#FAF9F6] border-b border-slate-200 text-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider mb-2">
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                <span>Travel Inspiration</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 font-sans tracking-tight">
                Top Destinations in Cambodia
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Discover the best cities, historical monuments, beaches, and countryside locations across the kingdom.
              </p>
            </div>

            <button
              onClick={() => navigate('/destinations')}
              className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-extrabold text-red-600 hover:text-red-700 cursor-pointer"
            >
              <span>Explore All Destinations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.slice(0, 4).map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        </div>
      </section>

      {/* 10. PHOTOS ADDED THROUGH THE MEDIA LIBRARY */}
      {homepageMedia.length > 0 && (
        <section className="border-b border-slate-200 bg-white py-20 text-slate-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-10 text-center">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-600"><Images className="h-3.5 w-3.5" /> Cambodia in pictures</div>
              <h2 className="font-sans text-2xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Travel Gallery</h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">A look at the vehicles, airport pickups, and destinations our team can help you experience.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {homepageMedia.map((media) => (
                <figure key={media.id} className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
                  <img src={media.url} alt={media.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent px-3 pb-3 pt-10 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">{media.title}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 11. FAQ SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 font-sans tracking-tight">
              Got Questions Before Booking?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Clear answers about payments, airport meet & greet, cancellation, and route pricing.
            </p>
          </div>

          <FAQAccordion faqs={publishedFaqs} />

          {/* Bottom Help Box */}
          <div className="mt-10 p-6 bg-[#FAF9F6] border border-slate-200 rounded-2xl text-center shadow-xs">
            <h4 className="text-sm font-bold text-slate-900">Have a custom itinerary or special question?</h4>
            <p className="text-xs text-slate-600 mt-1">
              Contact our driver team directly on WhatsApp for immediate help and route planning.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <a
                href={getWhatsAppGeneralUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-md shadow-red-600/20"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
              <a
                href={getTelegramUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs"
              >
                <Send className="w-3.5 h-3.5 text-red-600" />
                <span>Telegram</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
