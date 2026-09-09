import React from 'react';
import { useApp } from '../../../context/AppContext';
import { Breadcrumbs } from '../../layout/Breadcrumbs';
import { BookingWidget } from '../BookingWidget';
import { GoogleReviewsSection } from '../GoogleReviewsSection';
import { WhyBookDirectSection } from '../WhyBookDirectSection';
import { MapPin, Clock, ShieldCheck, CheckCircle2, MessageSquare, ArrowRight, Car, Sparkles, Navigation } from 'lucide-react';
import { getWhatsAppRouteUrl, getTelegramUrl } from '../../../lib/whatsapp';

interface RouteLandingPageProps {
  routeSlug: string;
}

export const RouteLandingPage: React.FC<RouteLandingPageProps> = ({ routeSlug }) => {
  const { routes = [], navigate, t } = useApp();

  const route = (routes || []).find(r => r && r.slug === routeSlug) || routes[0];

  if (!route) {
    return (
      <div className="pt-32 pb-20 bg-[#FAF9F6] text-center text-slate-800">
        <h1 className="text-3xl font-bold font-sans mb-4 text-slate-900">Route Not Found</h1>
        <button
          onClick={() => navigate('/services')}
          className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl shadow-md cursor-pointer"
        >
          View All Services
        </button>
      </div>
    );
  }

  const handleBookNow = (vehicleType: string = 'Sedan') => {
    const query = new URLSearchParams({
      service: route.is_airport ? 'Airport Transfers' : 'City-to-City Transfers',
      pickup: route.origin,
      destination: route.destination,
      passengers: vehicleType === 'Van' ? '6' : vehicleType === 'SUV' ? '3' : '2',
    }).toString();
    navigate(`/book?${query}`);
  };

  return (
    <div className="pt-24 pb-20 bg-[#FAF9F6] text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <Breadcrumbs />

        {/* Route Hero Header */}
        <div className="mt-6 mb-12 relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-950 text-white">
          <div className="absolute inset-0 z-0">
            <img
              src={route.is_airport ? '/back4.webp' : '/back5.jpg'}
              alt={route.route_name}
              className="w-full h-full object-cover object-center opacity-30 scale-105"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=1920&auto=format&fit=crop';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-transparent" />
          </div>

          <div className="relative z-10 p-8 sm:p-12 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/90 border border-red-500 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                <Navigation className="w-3.5 h-3.5 text-white" />
                <span>{route.is_airport ? 'Cambodia Airport Route' : 'Private Overland Route'}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-sans tracking-tight leading-tight">
                {route.route_name}
              </h1>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                {route.description}
              </p>

              {/* Route Stats Bar */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl">
                <div>
                  <span className="text-[11px] text-slate-300 font-semibold block">Est. Duration</span>
                  <span className="text-sm sm:text-base font-extrabold text-white">{route.estimated_duration}</span>
                </div>
                <div className="border-x border-white/15 px-3">
                  <span className="text-[11px] text-slate-300 font-semibold block">Distance</span>
                  <span className="text-sm sm:text-base font-extrabold text-white">{route.distance_km} km</span>
                </div>
                <div className="pl-3">
                  <span className="text-[11px] text-slate-300 font-semibold block">Starting From</span>
                  <span className="text-sm sm:text-base font-extrabold text-red-400">${route.sedan_price} USD</span>
                </div>
              </div>

              {/* Direct Booking and WhatsApp Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => handleBookNow('Sedan')}
                  className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm rounded-xl transition shadow-lg shadow-red-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <span>Book This Route Online</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={getWhatsAppRouteUrl(route, 'Sedan')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-red-400" />
                  <span>WhatsApp Us</span>
                </a>
              </div>

            </div>

            {/* Right Quick Booking Widget */}
            <div className="lg:col-span-5">
              <BookingWidget />
            </div>

          </div>
        </div>

        {/* Pricing Options Table for This Route */}
        <div className="my-16 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-extrabold uppercase text-red-600 tracking-wider">Fixed All-Inclusive Pricing</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans mt-1">
              Select Your Vehicle Option
            </h2>
            <p className="text-xs text-slate-600 mt-2">
              All prices include private car, professional driver, fuel, air conditioning, and highway tolls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Sedan Option */}
            <div className="bg-[#FAF9F6] border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:border-red-500/50 transition shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase">Sedan</span>
                  <span className="text-2xl font-black text-red-600">${route.sedan_price}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Toyota Camry / Prius Hybrid</h3>
                <p className="text-xs text-slate-600 mb-4">
                  Ideal for solo travelers, couples, and small luggage.
                </p>
                <ul className="text-xs text-slate-700 space-y-2 border-t border-slate-200 pt-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Up to 3 passengers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>2–3 Suitcases</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Air Conditioning & Cold Water</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleBookNow('Sedan')}
                className="mt-6 w-full py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Book Sedan (${route.sedan_price})
              </button>
            </div>

            {/* SUV Option */}
            <div className="bg-white border-2 border-red-600 rounded-2xl p-6 flex flex-col justify-between shadow-md relative">
              <div className="absolute -top-3 right-6 bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                Recommended
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-red-600 uppercase">SUV</span>
                  <span className="text-2xl font-black text-red-600">${route.suv_price}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Lexus RX300 / Highlander</h3>
                <p className="text-xs text-slate-600 mb-4">
                  Elevated high clearance, plush leather, spacious legroom.
                </p>
                <ul className="text-xs text-slate-700 space-y-2 border-t border-slate-100 pt-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Up to 4 passengers comfortably</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>3–4 Large Suitcases</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Smooth Highway Suspension</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleBookNow('SUV')}
                className="mt-6 w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-red-600/20 cursor-pointer"
              >
                Book SUV (${route.suv_price})
              </button>
            </div>

            {/* Van Option */}
            <div className="bg-[#FAF9F6] border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:border-red-500/50 transition shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase">Van</span>
                  <span className="text-2xl font-black text-red-600">${route.van_price}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Toyota Alphard / Hyundai H1</h3>
                <p className="text-xs text-slate-600 mb-4">
                  For families, group tours, golf bags, and extra luggage.
                </p>
                <ul className="text-xs text-slate-700 space-y-2 border-t border-slate-200 pt-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Up to 10 passengers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>6–8 Large Suitcases</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Rear Dual Zone AC</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleBookNow('Van')}
                className="mt-6 w-full py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Book Van (${route.van_price})
              </button>
            </div>

          </div>
        </div>

      </div>

      <WhyBookDirectSection />

      <GoogleReviewsSection />

    </div>
  );
};
