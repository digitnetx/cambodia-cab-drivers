import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Breadcrumbs } from '../../layout/Breadcrumbs';
import { TourCard } from '../TourCard';
import { FAQAccordion } from '../FAQAccordion';
import { getWhatsAppBookingUrl } from '../../../lib/whatsapp';
import { Clock, MapPin, CheckCircle2, XCircle, Info, Calendar, ArrowRight, MessageSquare, Compass, ShieldCheck } from 'lucide-react';

export const TourDetailPage: React.FC<{ slug: string }> = ({ slug }) => {
  const { tours = [], faqs = [], navigate, showToast } = useApp();
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const tour = (tours || []).find(t => t && t.slug === slug);

  if (!tour) {
    return (
      <div className="pt-32 pb-20 bg-[#FAF9F6] text-center text-slate-800">
        <h1 className="text-3xl font-bold font-sans mb-4 text-slate-900">Tour Not Found</h1>
        <button
          onClick={() => navigate('/tours')}
          className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl shadow-md cursor-pointer"
        >
          Explore All Tours
        </button>
      </div>
    );
  }

  const galleryImages = [tour.featured_image, ...(tour.gallery || [])].filter(Boolean);
  const currentDisplayImage = activeImage || tour.featured_image;
  const relatedTours = (tours || []).filter(t => t && t.id !== tour.id && t.is_active).slice(0, 3);
  const tourFaqs = (faqs || []).filter(f => f && (f.category === 'tours' || f.category === 'general')).slice(0, 4);

  return (
    <div className="pt-28 pb-28 bg-[#FAF9F6] text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <Breadcrumbs
          customItems={[
            { label: 'Tours', href: '/tours' },
            { label: tour.title },
          ]}
        />

        {/* Title Header */}
        <div className="mt-4 mb-8 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-red-600 font-bold bg-red-50 px-3 py-1 rounded-full border border-red-200">
              Private Tour
            </span>
            <span className="text-xs text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 font-medium">
              Professional Driver Included
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-sans tracking-tight">
            {tour.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-600 pt-1 font-medium">
            <span className="flex items-center gap-1.5 text-red-600 font-bold">
              <Clock className="w-4 h-4" />
              {tour.duration}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-red-600" />
              {tour.pickup_location}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-red-600" />
              Departs: {tour.departure_time}
            </span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="space-y-3 mb-12">
          <div className="rounded-2xl overflow-hidden border border-slate-200 h-[380px] sm:h-[480px] relative bg-slate-100 shadow-md">
            <img
              src={currentDisplayImage}
              alt={tour.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>

          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                    currentDisplayImage === img ? 'border-red-600 scale-105' : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Grid: Details + Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Main Column */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Overview */}
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-slate-900 font-sans border-b border-slate-200 pb-3">
                Tour Description
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {tour.description}
              </p>
            </div>

            {/* Highlights */}
            {tour.highlights && tour.highlights.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
                <h3 className="text-lg font-bold text-slate-900 font-sans flex items-center gap-2">
                  <Compass className="w-5 h-5 text-red-600" />
                  Tour Highlights
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
                  {tour.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Itinerary */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-extrabold text-slate-900 font-sans border-b border-slate-200 pb-3">
                  Itinerary Schedule
                </h2>
                <div className="space-y-4 relative border-l-2 border-red-200 pl-6 ml-3">
                  {tour.itinerary.map((step, idx) => (
                    <div key={idx} className="relative group">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-white border-2 border-red-600 group-hover:scale-125 transition-transform" />
                      <h4 className="text-base font-bold text-slate-900 font-sans">{step.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Included & Excluded */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3 shadow-xs">
                <h3 className="text-base font-bold text-emerald-600 font-sans flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  What's Included
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {tour.included.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3 shadow-xs">
                <h3 className="text-base font-bold text-rose-600 font-sans flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  What's Excluded
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                  {tour.excluded.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-500">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Important Info */}
            {tour.important_information && tour.important_information.length > 0 && (
              <div className="bg-red-50/60 border border-red-200 rounded-2xl p-6 space-y-3 shadow-xs">
                <h3 className="text-base font-bold text-red-600 font-sans flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Important Information
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {tour.important_information.map((info, idx) => (
                    <li key={idx}>• {info}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* FAQs */}
            {tourFaqs.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h2 className="text-2xl font-extrabold text-slate-900 font-sans">
                  Frequently Asked Questions
                </h2>
                <FAQAccordion faqs={tourFaqs} />
              </div>
            )}

          </div>

          {/* Right Sticky Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 sticky top-28 shadow-md">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                  Private Tour Request
                </span>
                <div className="text-xl font-extrabold text-slate-900 font-sans mt-1">
                  Request Transparent Price
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Includes private vehicle, professional driver, fuel, and cold water.
                </p>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Duration:</span>
                  <span className="font-bold text-slate-900">{tour.duration}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Pickup:</span>
                  <span className="font-bold text-slate-900 truncate max-w-[160px]">{tour.pickup_location}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Departure:</span>
                  <span className="font-bold text-slate-900">{tour.departure_time}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => navigate(`/book?tourId=${tour.id}`)}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-600/20 transition text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Book This Tour</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={getWhatsAppBookingUrl({ tour_title: tour.title, service_name: tour.title })}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => showToast(`Opening WhatsApp to request price for ${tour.title}...`, 'success')}
                  className="w-full py-3.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 text-center"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Request Price via WhatsApp</span>
                </a>
              </div>

              <p className="text-[11px] text-slate-500 text-center">
                Our team will confirm availability and fixed pricing instantly on WhatsApp.
              </p>
            </div>
          </div>

        </div>

        {/* Related Tours */}
        {relatedTours.length > 0 && (
          <div className="mt-20 pt-12 border-t border-slate-200 space-y-8">
            <h2 className="text-2xl font-extrabold text-slate-900 font-sans">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedTours.map((rt) => (
                <TourCard key={rt.id} tour={rt} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Sticky Mobile Bottom CTA Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-slate-200 p-4 backdrop-blur-xl flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <span className="text-[10px] uppercase text-red-600 font-bold block">Private Tour</span>
          <span className="text-xs font-bold text-slate-900 line-clamp-1">{tour.title}</span>
        </div>
        <button
          onClick={() => navigate(`/book?tourId=${tour.id}`)}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer shrink-0"
        >
          Request This Tour
        </button>
      </div>

    </div>
  );
};
