import React from 'react';
import { useApp } from '../../../context/AppContext';
import { Breadcrumbs } from '../../layout/Breadcrumbs';
import { getWhatsAppGeneralUrl } from '../../../lib/whatsapp';
import { CheckCircle2, MessageSquare, ArrowRight, ShieldCheck, Car, Calendar } from 'lucide-react';

export const ServiceDetailPage: React.FC<{ slug: string }> = ({ slug }) => {
  const { services, navigate, showToast } = useApp();

  const service = services.find(s => s.slug === slug);

  if (!service) {
    return (
      <div className="pt-32 pb-20 bg-[#FAF9F6] text-center text-slate-800">
        <h1 className="text-3xl font-bold font-sans mb-4 text-slate-900">Service Not Found</h1>
        <button
          onClick={() => navigate('/services')}
          className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl shadow-md cursor-pointer"
        >
          View All Services
        </button>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-[#FAF9F6] text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <Breadcrumbs
          customItems={[
            { label: 'Services', href: '/services' },
            { label: service.name },
          ]}
        />

        {/* Hero Image & Header */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs uppercase tracking-widest text-red-600 font-bold bg-red-50 px-3 py-1 rounded-full border border-red-200">
              Private Transportation Service
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-sans tracking-tight">
              {service.name}
            </h1>

            <p className="text-base text-slate-600 leading-relaxed">
              {service.short_description}
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => navigate(`/book?service=${encodeURIComponent(service.name)}`)}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-600/20 transition flex items-center gap-2 cursor-pointer"
              >
                <span>Request {service.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={getWhatsAppGeneralUrl(`Hello Cambodia Taxi Cab, I would like to inquire about ${service.name}.`)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => showToast(`Opening WhatsApp for ${service.name} inquiry...`, 'success')}
                className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-sm rounded-xl transition flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Driver Team</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-200 shadow-md h-80 bg-slate-100">
            <img
              src={service.featured_image}
              alt={service.name}
              className="w-full h-full object-cover"
            />
          </div>

        </div>

        {/* Detailed Service Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 border-t border-slate-200">
          
          <div className="lg:col-span-8 space-y-8">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 font-sans mb-4">
                Service Overview
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {service.description}
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 font-sans">
                What's Included With Our Service
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Private vehicle & English-speaking driver</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Cold bottled water & fresh towels</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Fuel, highway tolls, and parking fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Luggage assistance</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Sidebar Booking Prompt */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 sticky top-28 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 font-sans border-b border-slate-100 pb-3">
                Book This Service
              </h3>
              <p className="text-xs text-slate-600">
                Send your date, pickup location, and drop-off destination to receive a fixed transparent quote.
              </p>

              <button
                onClick={() => navigate(`/book?service=${encodeURIComponent(service.name)}`)}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-red-600/20 transition text-center block cursor-pointer"
              >
                Go to Booking Form
              </button>

              <a
                href={getWhatsAppGeneralUrl(`Hello Cambodia Taxi Cab, I want to book ${service.name}.`)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => showToast(`Opening WhatsApp to book ${service.name}...`, 'success')}
                className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 text-center"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Instant WhatsApp Request</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
