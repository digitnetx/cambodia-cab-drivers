import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RoutePricing } from '../../types';
import { MapPin, Clock, ArrowRight, MessageSquare, Car, Sparkles, Navigation } from 'lucide-react';
import { getWhatsAppRouteUrl } from '../../lib/whatsapp';

export const PopularRoutesSection: React.FC = () => {
  const { routes = [], navigate, t, language } = useApp();
  const [filter, setFilter] = useState<'all' | 'airport' | 'intercity'>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<'sedan' | 'suv' | 'van'>('sedan');

  const filteredRoutes = (routes || []).filter((r) => {
    if (!r) return false;
    if (filter === 'airport') return r.is_airport;
    if (filter === 'intercity') return !r.is_airport;
    return true;
  });

  const handleBookRoute = (route: RoutePricing) => {
    const query = new URLSearchParams({
      service: route.is_airport ? 'Airport Transfers' : 'City-to-City Transfers',
      pickup: route.origin,
      destination: route.destination,
      passengers: selectedVehicle === 'van' ? '6' : selectedVehicle === 'suv' ? '3' : '2',
    }).toString();
    navigate(`/book?${query}`);
  };

  return (
    <section id="popular-routes" className="py-20 bg-white border-y border-slate-200 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider mb-2">
              <Navigation className="w-3.5 h-3.5 text-red-600" />
              <span>{t.routes.badge}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 font-sans tracking-tight">
              {t.routes.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              {t.routes.subtitle}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-2 bg-slate-100 border border-slate-200 p-1.5 rounded-xl shadow-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                filter === 'all'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {t.routes.allFilter}
            </button>
            <button
              onClick={() => setFilter('airport')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                filter === 'airport'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              ✈️ {t.routes.airportFilter}
            </button>
            <button
              onClick={() => setFilter('intercity')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                filter === 'intercity'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              🚗 {t.routes.intercityFilter}
            </button>
          </div>
        </div>

        {/* Pricing Comparison Table (Desktop) */}
        <div className="hidden lg:block bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-12">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 text-slate-900 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700">
              Popular Route Rates (Fixed All-Inclusive USD)
            </span>
            <span className="text-xs text-red-600 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              Includes Private Vehicle, Fuel, Driver, AC & Highway Tolls
            </span>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <th className="py-3.5 px-6">Route Origin ➔ Destination</th>
                <th className="py-3.5 px-4">Est. Time & Dist</th>
                <th className="py-3.5 px-4 text-center">🚗 Sedan (1-3 Pax)</th>
                <th className="py-3.5 px-4 text-center">🚙 SUV (1-4 Pax)</th>
                <th className="py-3.5 px-4 text-center">🚐 Van (5-10 Pax)</th>
                <th className="py-3.5 px-6 text-right">Instant Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm text-slate-800">
              {filteredRoutes.map((route) => (
                <tr key={route.id} className="hover:bg-slate-50 transition">
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span className="text-slate-900 font-semibold">{route.route_name}</span>
                      {route.is_airport && (
                        <span className="text-[10px] uppercase font-extrabold bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-200">
                          Airport
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{route.origin} ➔ {route.destination}</p>
                  </td>

                  <td className="py-4 px-4 text-xs text-slate-600">
                    <div className="font-semibold text-slate-900">{route.estimated_duration}</div>
                    <div className="text-slate-500">{route.distance_km} km</div>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span className="inline-block font-extrabold text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-lg">
                      ${route.sedan_price}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span className="inline-block font-extrabold text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-lg">
                      ${route.suv_price}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span className="inline-block font-extrabold text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-lg">
                      ${route.van_price}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={getWhatsAppRouteUrl(route, 'Sedan')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4 text-red-600" />
                      </a>
                      <button
                        onClick={() => handleBookRoute(route)}
                        className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition shadow-md shadow-red-600/20 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Route Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRoutes.map((route) => (
            <div
              key={route.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-red-500/60 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                    {route.is_airport ? '✈️ Airport Transfer' : '🚗 Intercity Route'}
                  </span>
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-red-600" />
                    {route.estimated_duration}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 font-sans">
                  {route.route_name}
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  {route.description}
                </p>

                {/* Price Breakdown Pills */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-semibold">Sedan</div>
                    <div className="text-sm font-extrabold text-red-600">${route.sedan_price}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-semibold">SUV</div>
                    <div className="text-sm font-extrabold text-red-600">${route.suv_price}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-semibold">Van</div>
                    <div className="text-sm font-extrabold text-red-600">${route.van_price}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => handleBookRoute(route)}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-red-600/20 cursor-pointer"
                >
                  <span>{t.routes.bookRouteBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <a
                  href={getWhatsAppRouteUrl(route, 'Sedan')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 rounded-xl transition flex items-center justify-center"
                  title="WhatsApp Us"
                >
                  <MessageSquare className="w-4 h-4 text-red-600" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
