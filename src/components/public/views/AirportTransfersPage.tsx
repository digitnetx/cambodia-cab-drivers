import React from 'react';
import { useApp } from '../../../context/AppContext';
import { Breadcrumbs } from '../../layout/Breadcrumbs';
import { AirportTransfersSection } from '../AirportTransfersSection';
import { BookingWidget } from '../BookingWidget';
import { GoogleReviewsSection } from '../GoogleReviewsSection';
import { FAQAccordion } from '../FAQAccordion';
import { Plane, ShieldCheck, Clock, MapPin, CheckCircle2, MessageSquare, ArrowRight } from 'lucide-react';
import { getWhatsAppAirportUrl } from '../../../lib/whatsapp';

export const AirportTransfersPage: React.FC = () => {
  const { faqs = [], navigate, t } = useApp();
  const airportFaqs = (faqs || []).filter(f => f && (f.category === 'airport' || f.is_published));

  return (
    <div className="pt-24 pb-20 bg-[#FAF9F6] text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <Breadcrumbs />

        {/* Cinematic Airport Hero Banner with back4.webp */}
        <div className="mt-4 mb-14 relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-950 text-white">
          <div className="absolute inset-0 z-0">
            <img
              src="/back4.webp"
              alt="VIP Airport Transfer Minivan at Cambodia Airport Terminal"
              className="w-full h-full object-cover object-center opacity-40 scale-105"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=1920&auto=format&fit=crop';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
          </div>

          <div className="relative z-10 p-8 sm:p-14 lg:p-16 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/90 border border-red-500 text-white text-xs font-bold uppercase tracking-wider shadow-md">
              <Plane className="w-4 h-4 text-white" />
              <span>Official 24/7 Airport Chauffeur Service</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-sans tracking-tight leading-tight">
              Cambodia Airport Transfers
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
              Reliable, 24/7 private pickup & drop-off at Phnom Penh (PNH), Siem Reap–Angkor (SAI), and Sihanoukville (KOS) International Airports. Flight tracking, terminal name-card meet & greet, and fixed transparent pricing.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-900/80 backdrop-blur-xs border border-white/10 p-3 rounded-xl text-left">
                <div className="flex items-center gap-1.5 text-red-400 font-bold text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Free Flight Tracking</span>
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">Adjusts to delays automatically</div>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-xs border border-white/10 p-3 rounded-xl text-left">
                <div className="flex items-center gap-1.5 text-red-400 font-bold text-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Meet & Greet</span>
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">Driver waits with name-card</div>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-xs border border-white/10 p-3 rounded-xl text-left col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5 text-red-400 font-bold text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>No Waiting Fee</span>
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">Free 60 min terminal waiting</div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={getWhatsAppAirportUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition flex items-center gap-2 shadow-lg text-xs uppercase tracking-wider"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Instant Airport Booking on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Quick Booking Widget for Airports */}
        <div className="max-w-4xl mx-auto mb-16">
          <BookingWidget />
        </div>

      </div>

      {/* Embedded Dedicated Airport Section */}
      <AirportTransfersSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 my-16">
        {/* Step-by-Step Airport Pickup Guide */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-extrabold uppercase text-red-600 tracking-wider">Simple & Stress-Free Process</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans mt-1">How Airport Pickup Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#FAF9F6] p-6 rounded-2xl border border-slate-200 relative shadow-xs">
              <span className="text-3xl font-black text-red-600/20 absolute top-4 right-4 font-sans">01</span>
              <h3 className="text-base font-bold text-slate-900 font-sans mb-2">Book Online or WhatsApp</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Provide your flight number, arrival date, and drop-off hotel name. No deposit required.
              </p>
            </div>

            <div className="bg-[#FAF9F6] p-6 rounded-2xl border border-slate-200 relative shadow-xs">
              <span className="text-3xl font-black text-red-600/20 absolute top-4 right-4 font-sans">02</span>
              <h3 className="text-base font-bold text-slate-900 font-sans mb-2">Live Flight Tracking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sareth tracks your flight status for delays or early landings so your driver is waiting at the right time.
              </p>
            </div>

            <div className="bg-[#FAF9F6] p-6 rounded-2xl border border-slate-200 relative shadow-xs">
              <span className="text-3xl font-black text-red-600/20 absolute top-4 right-4 font-sans">03</span>
              <h3 className="text-base font-bold text-slate-900 font-sans mb-2">Name Sign Greeting</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Meet driver inside the arrival hall holding your custom name sign. Luggage assistance included.
              </p>
            </div>

            <div className="bg-[#FAF9F6] p-6 rounded-2xl border border-slate-200 relative shadow-xs">
              <span className="text-3xl font-black text-red-600/20 absolute top-4 right-4 font-sans">04</span>
              <h3 className="text-base font-bold text-slate-900 font-sans mb-2">Cool Ride to Hotel</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Relax in a climate-controlled vehicle with free cold water. Pay driver in cash (USD/KHR) upon arrival.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <GoogleReviewsSection />

      {/* FAQ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900 font-sans">Airport Transfer FAQs</h2>
          <p className="text-xs text-slate-600 mt-1">Frequently asked questions regarding airport pickups in Cambodia</p>
        </div>
        <FAQAccordion faqs={airportFaqs.slice(0, 5)} />
      </div>

    </div>
  );
};
