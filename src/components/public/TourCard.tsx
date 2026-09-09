import React from 'react';
import { Tour } from '../../types';
import { useApp } from '../../context/AppContext';
import { Clock, MapPin, ArrowRight } from 'lucide-react';

export const TourCard: React.FC<{ tour: Tour }> = ({ tour }) => {
  const { navigate } = useApp();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-red-500/80 hover:shadow-xl transition-all duration-300 group flex flex-col h-full shadow-xs text-slate-900">
      
      {/* Image container */}
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img
          src={tour.featured_image}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />
        
        {tour.is_featured && (
          <span className="absolute top-3 left-3 bg-red-600 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md shadow">
            Featured Tour
          </span>
        )}

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white font-medium">
          <span className="flex items-center gap-1 bg-white/95 text-slate-900 px-2.5 py-1 rounded-md backdrop-blur-sm border border-slate-200 font-bold text-xs">
            <Clock className="w-3.5 h-3.5 text-red-600" />
            {tour.duration}
          </span>
          <span className="bg-red-600 text-white font-bold px-2.5 py-1 rounded-md shadow-xs">
            Request Price
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 font-sans group-hover:text-red-600 transition-colors line-clamp-1 mb-2">
            {tour.title}
          </h3>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {tour.short_description}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-4">
            <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span className="truncate">{tour.pickup_location}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
          <button
            onClick={() => navigate(`/tours/${tour.slug}`)}
            className="flex-1 py-2 text-xs font-semibold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition text-center cursor-pointer"
          >
            Details
          </button>
          <button
            onClick={() => navigate(`/book?tourId=${tour.id}`)}
            className="flex-1 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition text-center flex items-center justify-center gap-1 shadow-md shadow-red-600/20 cursor-pointer"
          >
            <span>Book</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
