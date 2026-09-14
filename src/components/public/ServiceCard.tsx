import React from 'react';
import { Service } from '../../types';
import { useApp } from '../../context/AppContext';
import { featuredImageSrc } from '../../lib/images';
import { Plane, Car, Navigation, UserCheck, Compass, MapPin, ArrowRight } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Plane,
  Car,
  Navigation,
  UserCheck,
  Compass,
  MapPin,
};

export const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
  const { navigate } = useApp();
  const IconComponent = iconMap[service.icon] || Car;
  const image = featuredImageSrc(service);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-300 hover:border-red-500 hover:shadow-lg group flex h-full flex-col justify-between text-slate-900">
      {image && (
        <div className="h-44 overflow-hidden bg-slate-100">
          <img
            src={image}
            alt={service.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            onError={(event) => { event.currentTarget.parentElement?.remove(); }}
          />
        </div>
      )}
      <div>
        <div className="flex items-center justify-between mb-4 p-6 pb-0">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
            <IconComponent className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-red-600 transition-colors">
            Cambodia Taxi Cab
          </span>
        </div>

        <h3 className="px-6 text-lg font-bold text-slate-900 font-sans mb-2 group-hover:text-red-600 transition-colors">
          {service.name}
        </h3>

        <p className="mb-6 px-6 text-xs text-slate-600 leading-relaxed">
          {service.short_description}
        </p>
      </div>

      <div className="mx-6 flex items-center justify-between border-t border-slate-100 pt-4 pb-6">
        <button
          onClick={() => navigate(`/services/${service.slug}`)}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
        >
          View Details
        </button>
        <button
          onClick={() => navigate(`/book?service=${encodeURIComponent(service.name)}`)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-bold text-xs rounded-lg transition border border-red-200 cursor-pointer"
        >
          <span>Book Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
