import React from 'react';
import { useApp } from '../../../context/AppContext';
import { Breadcrumbs } from '../../layout/Breadcrumbs';
import { VehicleSelectionSection } from '../VehicleSelectionSection';
import { WhyBookDirectSection } from '../WhyBookDirectSection';
import { GoogleReviewsSection } from '../GoogleReviewsSection';
import { Car, ShieldCheck, CheckCircle2, Sparkles, MessageSquare } from 'lucide-react';
import { getWhatsAppGeneralUrl } from '../../../lib/whatsapp';

export const VehiclesPage: React.FC = () => {
  const { t, vehicles, navigate } = useApp();

  return (
    <div className="pt-24 pb-20 bg-[#FAF9F6] text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <Breadcrumbs />

        {/* Hero Section with bg1.jpg */}
        <div className="mt-4 mb-14 relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-950 text-white">
          <div className="absolute inset-0 z-0">
            <img
              src="/bg1.jpg"
              alt="Cambodia Taxi Cab Fleet at Airport Terminal"
              className="w-full h-full object-cover object-center opacity-40 scale-105"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=1920&auto=format&fit=crop';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
          </div>

          <div className="relative z-10 p-8 sm:p-14 lg:p-16 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider shadow-md">
              <Car className="w-3.5 h-3.5 text-white" />
              <span>Modern Private Chauffeur Fleet</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-sans tracking-tight leading-tight">
              Our Private Vehicle Fleet in Cambodia
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
              All vehicles in our fleet are modern, fully insured, strictly maintained, non-smoking, and equipped with powerful dual-zone air conditioning, phone chargers, and complimentary cold bottled water.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <span className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/15 text-slate-200 font-semibold">✓ Sedans (1-3 Pax)</span>
              <span className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/15 text-slate-200 font-semibold">✓ SUVs (1-4 Pax)</span>
              <span className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/15 text-slate-200 font-semibold">✓ VIP Vans (1-10 Pax)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Fleet Showcase */}
      <VehicleSelectionSection />

      {/* Fleet Standards Guarantee */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 my-16">
        <div className="bg-white border border-slate-200 text-slate-800 rounded-3xl p-8 sm:p-12 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-extrabold uppercase text-red-600 tracking-wider">Quality Assurance</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans mt-1">Our Vehicle Standards</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-slate-200 space-y-2">
              <h3 className="text-base font-bold text-slate-900 font-sans flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Daily Cleaning & Sanitization</span>
              </h3>
              <p className="leading-relaxed">
                Vehicles are washed, vacuumed, and sanitized before every pickup. Non-smoking interiors guarantee a fresh atmosphere.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-slate-200 space-y-2">
              <h3 className="text-base font-bold text-slate-900 font-sans flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Ice-Cold Air Conditioning</span>
              </h3>
              <p className="leading-relaxed">
                Cambodia can be humid and tropical. Our high-power AC systems ensure crisp cooling throughout long road journeys.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-slate-200 space-y-2">
              <h3 className="text-base font-bold text-slate-900 font-sans flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Safety & Maintenance</span>
              </h3>
              <p className="leading-relaxed">
                Regular safety inspections on brakes, tires, and suspension ensure optimal comfort on national highways and rural roads.
              </p>
            </div>
          </div>
        </div>
      </div>

      <WhyBookDirectSection />

      <GoogleReviewsSection />

    </div>
  );
};
