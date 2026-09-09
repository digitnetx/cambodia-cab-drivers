import React from 'react';
import { Destination } from '../../types';
import { useApp } from '../../context/AppContext';
import { MapPin, ArrowUpRight } from 'lucide-react';

export const DestinationCard: React.FC<{ destination: Destination }> = ({ destination }) => {
  const { navigate } = useApp();

  return (
    <div
      onClick={() => navigate(`/destinations/${destination.slug}`)}
      className="group relative rounded-2xl overflow-hidden cursor-pointer bg-slate-900 border border-slate-200 hover:border-red-500/80 hover:shadow-xl transition-all duration-300 shadow-md h-80 flex flex-col justify-end p-6"
    >
      <img
        src={destination.featured_image}
        alt={destination.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        loading="lazy"
      />
      
      {/* Dark Gradient Overlay for legible white text over destination photography */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

      {destination.is_featured && (
        <span className="absolute top-4 left-4 z-10 bg-red-600 text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
          Popular Destination
        </span>
      )}

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xl font-bold text-white font-sans group-hover:text-red-400 transition-colors flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-500" />
            {destination.name}
          </h3>
          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-xs group-hover:bg-red-600 group-hover:text-white flex items-center justify-center transition-colors">
            <ArrowUpRight className="w-4 h-4 text-white" />
          </div>
        </div>

        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
          {destination.short_description}
        </p>

        {destination.things_to_do && destination.things_to_do.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
            {destination.things_to_do.slice(0, 2).map((item, idx) => (
              <span key={idx} className="text-[10px] bg-slate-950/80 text-white px-2 py-0.5 rounded border border-white/20">
                • {item}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
