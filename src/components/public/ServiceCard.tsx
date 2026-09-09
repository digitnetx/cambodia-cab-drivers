import React from 'react';
import { Service } from '../../types';
import { useApp } from '../../context/AppContext';
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

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-red-500 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between h-full shadow-xs text-slate-900">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
            <IconComponent className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-red-600 transition-colors">
            Cambodia Taxi Cab
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 font-sans mb-2 group-hover:text-red-600 transition-colors">
          {service.name}
        </h3>

        <p className="text-xs text-slate-600 leading-relaxed mb-6">
          {service.short_description}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
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
