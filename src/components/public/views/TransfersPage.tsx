import React from 'react';
import { useApp } from '../../../context/AppContext';
import { Breadcrumbs } from '../../layout/Breadcrumbs';
import { BookingForm } from '../BookingForm';
import { Plane, Navigation, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';

export const TransfersPage: React.FC = () => {
  return (
    <div className="pt-28 pb-20 bg-[#FAF9F6] text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <Breadcrumbs />

        {/* Hero Section with back5.jpg */}
        <div className="mt-4 mb-14 relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-950 text-white">
          <div className="absolute inset-0 z-0">
            <img
              src="/back5.jpg"
              alt="Cambodia Taxi & Scenic Overland Private Transfers"
              className="w-full h-full object-cover object-center opacity-40 scale-105"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=1920&auto=format&fit=crop';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
          </div>

          <div className="relative z-10 p-8 sm:p-14 lg:p-16 max-w-3xl space-y-5">
            <span className="inline-block text-xs uppercase tracking-widest text-white font-bold bg-red-600 px-3.5 py-1.5 rounded-full shadow-md">
              Airport & City Overland Transfers
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-sans tracking-tight">
              Cambodia Taxi & Airport Transfers
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
              Punctual, climate-controlled airport pickups and long-distance city-to-city transfers across Cambodia with professional English-speaking drivers.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <span className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/15 text-slate-200 font-semibold">✓ Fixed Rates</span>
              <span className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/15 text-slate-200 font-semibold">✓ Tolls & Fuel Included</span>
              <span className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/15 text-slate-200 font-semibold">✓ Free Refreshments</span>
            </div>
          </div>
        </div>

        {/* Transfer Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <Plane className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-sans mb-2">Phnom Penh Airport Pickups</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Flight tracking, terminal welcome sign meet & greet, door-to-door hotel delivery with zero waiting stress.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <Navigation className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-sans mb-2">City-to-City Overland Journeys</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Phnom Penh to Siem Reap, Kampot, Kep, Battambang, or Sihanoukville with optional photo stops along the highway.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-sans mb-2">Hotel Door-to-Door Transfers</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Prompt hotel pickup with luggage handling, clean vehicle interior, and cold water for all guests.
            </p>
          </div>
        </div>

        {/* Transfer Booking Form Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 font-sans">
              Request Your Transfer Ride
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Fill out the details below to receive fixed transparent pricing.
            </p>
          </div>

          <BookingForm initialService="Airport Transfers" />
        </div>

      </div>
    </div>
  );
};
