import React from 'react';
import { useApp } from '../../context/AppContext';
import { Plane, CheckCircle2, ShieldCheck, Clock, ArrowRight, MessageSquare, MapPin } from 'lucide-react';
import { getWhatsAppAirportUrl } from '../../lib/whatsapp';

export const AirportTransfersSection: React.FC = () => {
  const { navigate, airports = [], t } = useApp();

  const activeAirports = (airports || []).filter(a => a && a.is_active);

  const keyBenefits = [
    { title: 'Live Flight Tracking', desc: 'We monitor flight delays and early arrivals so your driver is always ready.' },
    { title: 'Name-Card Terminal Pickup', desc: 'Driver meets you inside arrivals holding a personalized greeting sign.' },
    { title: 'Fixed Transparent Pricing', desc: 'No taximeter surcharges, no extra airport parking or highway toll fees.' },
    { title: '24/7 Service Availability', desc: 'Late night and early morning flight arrivals serviced with zero stress.' },
    { title: 'Complimentary Luggage Help', desc: 'Driver assists with loading all suitcases and bags straight to the car.' },
    { title: 'Clean Climate-Controlled Ride', desc: 'Air-conditioned comfort with complimentary cold water after your flight.' },
  ];

  return (
    <section id="airport-transfers" className="py-20 bg-[#FAF9F6] text-slate-900 relative overflow-hidden border-t border-slate-200">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-black tracking-wider uppercase mb-3">
            <Plane className="w-3.5 h-3.5 text-red-600" />
            <span>{t.airport.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 font-sans tracking-tight leading-tight">
            {t.airport.title}
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            {t.airport.subtitle}
          </p>
        </div>

        {/* Dynamic Airport Hub Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {activeAirports.map((airport) => (
            <div 
              key={airport.id}
              className={`bg-white border rounded-2xl p-6 transition shadow-sm relative flex flex-col justify-between group ${
                airport.iata_code === 'SAI' 
                  ? 'border-red-500 ring-1 ring-red-500/30' 
                  : 'border-slate-200 hover:border-red-500/60'
              }`}
            >
              {airport.iata_code === 'SAI' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
                  Most Popular For Tourists
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                    {airport.iata_code} Airport
                  </span>
                  <span className="text-lg font-black text-red-600">
                    From ${airport.sedan_price}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-sans group-hover:text-red-600 transition">
                    {airport.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-600" />
                    {airport.city} • {airport.driving_time}
                  </p>
                </div>

                <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>Meet inside arrivals with Name Sign</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>{airport.driving_time} direct private transfer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>Sedan ${airport.sedan_price} • SUV ${airport.suv_price} • Van ${airport.van_price}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => navigate(`/book?service=Airport+Transfers&pickup=${encodeURIComponent(airport.name)}&destination=${encodeURIComponent('Hotel in ' + airport.city)}`)}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-red-600/20 cursor-pointer"
                >
                  <span>{t.airport.bookBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <a
                  href={getWhatsAppAirportUrl(airport.name, `Hotel in ${airport.city}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl border border-slate-200 transition flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-red-600" />
                  <span>WhatsApp Driver</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Airport Features Trust Grid */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 text-center">
            Standard Features Included With Every Airport Pickup
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyBenefits.map((b, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-0.5 border border-red-100">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900 font-sans">{b.title}</h5>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
