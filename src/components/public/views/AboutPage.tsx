import React from 'react';
import { useApp } from '../../../context/AppContext';
import { Breadcrumbs } from '../../layout/Breadcrumbs';
import { getWhatsAppGeneralUrl, PHONE_NUMBER } from '../../../lib/whatsapp';
import { UserCheck, ShieldCheck, MapPin, Phone, MessageSquare, Car, Sparkles, Languages, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate, siteSettings, driverProfile } = useApp();
  const [photoError, setPhotoError] = React.useState(false);

  const photoSrc = (!photoError && driverProfile.profile_photo_url)
    ? driverProfile.profile_photo_url
    : (!photoError ? '/sareth.jpeg' : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop');

  return (
    <div className="pt-28 pb-20 bg-[#FAF9F6] text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <Breadcrumbs />

        {/* Hero Banner with background.webp */}
        <div className="mt-4 mb-16 relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-950 text-white">
          <div className="absolute inset-0 z-0">
            <img
              src="/background.webp"
              alt="About Sareth & Cambodia Taxi Cab"
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
              About Sareth & Cambodia Taxi Cab
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-sans tracking-tight">
              Your Trusted Private Chauffeur in Cambodia
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
              Welcome to Cambodia Taxi Cab. My name is Sareth, and I am a professional English-speaking driver based in Phnom Penh. I provide reliable private transportation, airport transfers, and customized tours throughout Cambodia.
            </p>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl relative bg-slate-100">
              <img
                src={photoSrc}
                alt="Driver Sareth in Cambodia"
                className="w-full h-[480px] object-cover"
                referrerPolicy="no-referrer"
                onError={() => setPhotoError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />
            </div>

            <div className="absolute bottom-6 left-6 right-6 bg-white/95 border border-slate-200 backdrop-blur-md p-4 rounded-xl text-left shadow-lg">
              <h3 className="text-lg font-bold text-slate-900 font-sans">Sareth</h3>
              <p className="text-xs text-red-600 font-semibold">Founder & English-speaking Driver</p>
              <div className="mt-2 text-[11px] text-slate-600 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Base: #61, Oknha Chrun Youhak (294), BKK I, Phnom Penh</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans">
              Personal, Dependable Transportation Across Cambodia
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              When traveling in Cambodia, having a driver who understands local road conditions, route timing, and tourist expectations makes all the difference. Whether you require a quick airport transfer, a full day exploring Phnom Penh, or an overland trip to Siem Reap, Kampot, or Kep, I aim to provide a safe, stress-free experience.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                <Languages className="w-6 h-6 text-red-600 mb-2" />
                <h4 className="text-sm font-bold text-slate-900 font-sans">English Speaking</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Clear communication regarding pickup points, travel schedules, and rest stops.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                <Car className="w-6 h-6 text-red-600 mb-2" />
                <h4 className="text-sm font-bold text-slate-900 font-sans">Clean Air-Conditioned Ride</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Pristine vehicle, powerful air conditioning, and cold bottled water included.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                <ShieldCheck className="w-6 h-6 text-red-600 mb-2" />
                <h4 className="text-sm font-bold text-slate-900 font-sans">Safe & Experienced Driver</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Safe driving practices, well-maintained vehicle, and careful highway navigation.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                <Sparkles className="w-6 h-6 text-red-600 mb-2" />
                <h4 className="text-sm font-bold text-slate-900 font-sans">Flexible Schedule</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Stop for photo opportunities, local fruit markets, or lunch whenever you choose.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/book')}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-600/20 transition cursor-pointer"
              >
                Book Your Trip With Sareth
              </button>
              <a
                href={getWhatsAppGeneralUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-sm rounded-xl transition flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Contact via WhatsApp (+855 16 509 371)
              </a>
            </div>

          </div>

        </div>

        {/* Real Business Address & Contact Banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-4xl mx-auto text-center space-y-4 shadow-xs">
          <h3 className="text-xl font-bold text-slate-900 font-sans">Real Business Location in Phnom Penh</h3>
          <p className="text-sm text-slate-600">
            {siteSettings.address}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-700 pt-2">
            <span className="flex items-center gap-1.5 font-medium">
              <Phone className="w-4 h-4 text-red-600" />
              <a href={`tel:${PHONE_NUMBER}`}>{siteSettings.phone}</a>
            </span>
            <span className="flex items-center gap-1.5 text-red-600 font-bold">
              <MessageSquare className="w-4 h-4" />
              WhatsApp: {siteSettings.whatsapp}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
