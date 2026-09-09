import React from 'react';
import { useApp } from '../../../context/AppContext';
import { Breadcrumbs } from '../../layout/Breadcrumbs';
import { getWhatsAppGeneralUrl } from '../../../lib/whatsapp';
import { UserCheck, Clock, Calendar, Compass, ShieldCheck, MessageSquare, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export const PrivateDriverPage: React.FC = () => {
  const { navigate, showToast } = useApp();

  const hireOptions = [
    {
      title: 'Half-Day Driver Hire',
      duration: '4 Hours',
      desc: 'Ideal for city errands, business meetings, short Phnom Penh sightseeing, or evening restaurant transfers.',
      features: ['Up to 4 hours of dedicated driver service', 'Pickup at hotel or office', 'Cold bottled water included'],
    },
    {
      title: 'Full-Day Driver Hire',
      duration: '8 - 10 Hours',
      desc: 'Perfect for full-day temple explorations, Phnom Penh city highlights, or day trips to Silk Island or Oudong.',
      features: ['Full day dedicated availability', 'Unlimited local stops within city/surrounds', 'Flexible lunch and rest stops'],
    },
    {
      title: 'Multi-Day Country Journey',
      duration: '2 - 7+ Days',
      desc: 'Explore multiple provinces (Phnom Penh -> Kampot -> Kep -> Siem Reap) with dedicated drivers handling all road travel.',
      features: ['Driver accommodation included', 'Luggage security and daily hotel connections', 'Tailored daily departure times'],
    },
    {
      title: 'Custom Travel Itinerary',
      duration: 'Flexible',
      desc: 'Planning off-grid photography trips, corporate site visits, or specialized family holidays? Customized to your needs.',
      features: ['Customized route planning', 'Transparent upfront pricing', 'Direct driver communication'],
    },
  ];

  return (
    <div className="pt-28 pb-20 bg-[#FAF9F6] text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <Breadcrumbs />

        {/* Hero Section with background.webp */}
        <div className="mt-4 mb-14 relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-950 text-white">
          <div className="absolute inset-0 z-0">
            <img
              src="/background.webp"
              alt="Hire a Private Driver in Cambodia"
              className="w-full h-full object-cover object-center opacity-40 scale-105"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=1920&auto=format&fit=crop';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
          </div>

          <div className="relative z-10 p-8 sm:p-14 lg:p-16 max-w-3xl space-y-5">
            <span className="inline-block text-xs uppercase tracking-widest text-white font-bold bg-red-600 px-3.5 py-1.5 rounded-full shadow-md">
              Hire A Professional Private Driver
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-sans tracking-tight">
              Hire a Private Driver in Cambodia
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
              Enjoy total freedom, comfort, and peace of mind. Hire local English-speaking professional drivers by the half-day, full-day, or for custom multi-day journeys across Cambodia.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <span className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/15 text-slate-200 font-semibold">✓ Fluent English Coordination</span>
              <span className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/15 text-slate-200 font-semibold">✓ 100% Flexible Sights</span>
              <span className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/15 text-slate-200 font-semibold">✓ Licensed & Insured Fleet</span>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { icon: UserCheck, title: 'Personal Local Service', desc: 'Attentive, friendly service with an English-speaking driver who prioritizes your comfort.' },
            { icon: Clock, title: 'Flexible Schedule', desc: 'No strict tour bus timelines. Start when you wish and linger as long as you want at sights.' },
            { icon: ShieldCheck, title: 'Comfortable Transportation', desc: 'Clean, air-conditioned vehicle with luggage room, bottled water, and smooth driving.' },
            { icon: Compass, title: 'Local Knowledge', desc: 'Discover authentic local food spots, scenic rest stops, and reliable travel advice.' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4 border border-red-100">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 font-sans mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Hire Options */}
        <div className="space-y-6 mb-16">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans">
              Private Driver Hire Options
            </h2>
            <p className="text-xs text-slate-600 mt-2">
              Select an option that fits your travel plans and request pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hireOptions.map((opt, idx) => (
              <div key={idx} className="bg-white border border-slate-200 hover:border-red-500/50 rounded-2xl p-6 transition flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-slate-900 font-sans">{opt.title}</h3>
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
                      {opt.duration}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {opt.desc}
                  </p>

                  <ul className="space-y-2 text-xs text-slate-600 mb-6">
                    {opt.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <button
                    onClick={() => navigate(`/book?service=Private Driver&special_requests=${encodeURIComponent(opt.title)}`)}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-red-600/20 transition text-center cursor-pointer"
                  >
                    Request Quote
                  </button>
                  <a
                    href={getWhatsAppGeneralUrl(`Hello Cambodia Taxi Cab, I am interested in ${opt.title}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => showToast(`Opening WhatsApp for ${opt.title}...`, 'success')}
                    className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-white border border-red-200 rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-6 shadow-md">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-sans">
            Ready to Request a Private Driver?
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
            Tell our team your travel dates, pickup location, and itinerary goals for a fast, fixed, zero-commitment price quote.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/book?service=Private Driver')}
              className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-600/20 transition flex items-center gap-2 cursor-pointer"
            >
              <span>Request a Private Driver</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={getWhatsAppGeneralUrl("Hello Cambodia Taxi Cab, I would like to request a private driver.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => showToast('Opening WhatsApp to request a private driver...', 'success')}
              className="px-8 py-3.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-sm rounded-xl transition flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
