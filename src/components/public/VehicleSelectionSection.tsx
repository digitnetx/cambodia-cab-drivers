import React from 'react';
import { useApp } from '../../context/AppContext';
import { Vehicle } from '../../types';
import { Users, Luggage, Wind, CheckCircle2, ArrowRight, MessageSquare, Car, Sparkles } from 'lucide-react';
import { getWhatsAppVehicleUrl } from '../../lib/whatsapp';
import { imageSrc } from '../../lib/images';

export const VehicleSelectionSection: React.FC = () => {
  const { vehicles, navigate, t, language } = useApp();

  const handleBookVehicle = (vehicle: Vehicle) => {
    const query = new URLSearchParams({
      service: `Private Driver (${vehicle.name})`,
      passengers: vehicle.capacity_passengers.toString(),
    }).toString();
    navigate(`/book?${query}`);
  };

  return (
    <section id="vehicles" className="py-20 bg-[#FAF9F6] border-b border-slate-200 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider mb-2">
            <Car className="w-3.5 h-3.5 text-red-600" />
            <span>{t.vehicles.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 font-sans tracking-tight">
            {t.vehicles.title}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {t.vehicles.subtitle}
          </p>
        </div>

        {/* 3-Column Vehicle Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className={`bg-white border rounded-2xl overflow-hidden shadow-sm hover:border-red-500/80 transition-all duration-300 flex flex-col justify-between ${
                vehicle.is_popular ? 'border-red-500 ring-1 ring-red-500/30' : 'border-slate-200'
              }`}
            >
              <div>
                {/* Vehicle Image */}
                <div className="relative h-56 bg-slate-100 overflow-hidden">
                  <img
                    src={imageSrc(vehicle)}
                    alt={`${vehicle.name} Cambodia taxi`}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Top Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-slate-800 text-xs font-bold px-3 py-1 rounded-lg border border-slate-200 shadow-xs">
                    {vehicle.models}
                  </div>

                  {/* Price Tag */}
                  <div className="absolute bottom-3 right-3 bg-red-600 text-white font-black text-xs px-3 py-1 rounded-lg shadow-md">
                    {t.vehicles.from} ${vehicle.price_from}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-extrabold text-slate-900 font-sans flex items-center justify-between">
                    <span>{vehicle.name}</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {vehicle.description}
                  </p>

                  {/* Capacity Badges */}
                  <div className="grid grid-cols-3 gap-2 my-5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1 text-slate-900 font-extrabold text-xs">
                        <Users className="w-3.5 h-3.5 text-red-600" />
                        <span>1–{vehicle.capacity_passengers}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">{t.vehicles.passengers}</span>
                    </div>

                    <div className="border-x border-slate-200">
                      <div className="flex items-center justify-center gap-1 text-slate-900 font-extrabold text-xs">
                        <Luggage className="w-3.5 h-3.5 text-red-600" />
                        <span>2–{vehicle.capacity_luggage}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">{t.vehicles.luggage}</span>
                    </div>

                    <div>
                      <div className="flex items-center justify-center gap-1 text-slate-900 font-extrabold text-xs">
                        <Wind className="w-3.5 h-3.5 text-red-600" />
                        <span>High AC</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">Climate</span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-2 text-xs text-slate-600">
                    {vehicle.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 pt-0 space-y-2">
                <button
                  onClick={() => handleBookVehicle(vehicle)}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t.vehicles.bookThisVehicle}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href={getWhatsAppVehicleUrl(vehicle)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-red-600" />
                  <span>Ask on WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
