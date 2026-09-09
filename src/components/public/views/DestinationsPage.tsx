import React from 'react';
import { useApp } from '../../../context/AppContext';
import { Breadcrumbs } from '../../layout/Breadcrumbs';
import { DestinationCard } from '../DestinationCard';

export const DestinationsPage: React.FC = () => {
  const { destinations } = useApp();

  return (
    <div className="pt-28 pb-20 bg-[#FAF9F6] text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <Breadcrumbs />

        {/* Hero Section with back5.jpg */}
        <div className="mt-4 mb-14 relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-950 text-white">
          <div className="absolute inset-0 z-0">
            <img
              src="/back5.jpg"
              alt="Where We Drive Across Cambodia"
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
            <span className="inline-block text-xs uppercase tracking-widest text-white font-bold bg-red-600 px-3.5 py-1.5 rounded-full shadow-md">
              Cambodian Destinations
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-sans tracking-tight">
              Where We Drive in Cambodia
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
              From the bustling royal capital Phnom Penh to ancient temple ruins in Siem Reap, coastal pepper farms in Kampot and Kep, and tropical islands in Sihanoukville — explore comfortably with our private driver fleet.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <span className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/15 text-slate-200 font-semibold">✓ 25+ Provinces Covered</span>
              <span className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/15 text-slate-200 font-semibold">✓ Custom Scenic Stops</span>
              <span className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/15 text-slate-200 font-semibold">✓ Door-to-Door Service</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>

      </div>
    </div>
  );
};
