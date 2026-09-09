import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Breadcrumbs } from '../../layout/Breadcrumbs';
import { TourCard } from '../TourCard';
import { Search } from 'lucide-react';

export const ToursPage: React.FC = () => {
  const { tours = [] } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const filteredTours = (tours || []).filter(tour => {
    if (!tour) return false;
    const matchesSearch = (tour.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tour.short_description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === 'all' ||
      (tour.pickup_location || '').toLowerCase().includes(selectedLocation.toLowerCase()) ||
      (tour.title || '').toLowerCase().includes(selectedLocation.toLowerCase());
    return tour.is_active && matchesSearch && matchesLocation;
  });

  return (
    <div className="pt-28 pb-20 bg-[#FAF9F6] text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <Breadcrumbs />

        {/* Hero Section with back5.jpg */}
        <div className="mt-4 mb-12 relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-950 text-white">
          <div className="absolute inset-0 z-0">
            <img
              src="/back5.jpg"
              alt="Private Sightseeing Tours across Cambodia"
              className="w-full h-full object-cover object-center opacity-35 scale-105"
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
              Private Sightseeing Tours
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-sans tracking-tight">
              Explore Cambodia With Sareth
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
              Discover iconic temple ruins in Angkor, royal capital landmarks in Phnom Penh, countryside villages, and coastal highlights with your trusted private driver team.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <span className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/15 text-slate-200 font-semibold">★ 100% Tailored Timelines</span>
              <span className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/15 text-slate-200 font-semibold">★ Cold Water & AC Included</span>
              <span className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/15 text-slate-200 font-semibold">★ English Speaking Drivers</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tours..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-600 font-bold shrink-0">Region:</span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-red-500 transition w-full sm:w-auto"
            >
              <option value="all">All Locations</option>
              <option value="siem reap">Siem Reap / Angkor</option>
              <option value="phnom penh">Phnom Penh</option>
              <option value="battambang">Battambang</option>
              <option value="countryside">Countryside</option>
            </select>
          </div>
        </div>

        {/* Tour Grid */}
        {filteredTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <p className="text-slate-600">No tours matching your criteria.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedLocation('all'); }}
              className="mt-4 px-4 py-2 text-xs font-bold bg-red-600 text-white rounded-lg cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
