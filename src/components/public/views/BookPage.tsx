import React from 'react';
import { Breadcrumbs } from '../../layout/Breadcrumbs';
import { BookingForm } from '../BookingForm';

export const BookPage: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const initialService = urlParams.get('service') || undefined;
  const initialTourId = urlParams.get('tourId') || undefined;
  const initialPickup = urlParams.get('pickup') || undefined;
  const initialDestination = urlParams.get('destination') || undefined;
  const initialDate = urlParams.get('date') || undefined;
  const initialTime = urlParams.get('time') || undefined;
  const initialPassengers = urlParams.get('passengers') ? Number(urlParams.get('passengers')) : undefined;

  return (
    <div className="pt-28 pb-20 bg-[#FAF9F6] text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <Breadcrumbs />

        {/* Hero Section with background.webp */}
        <div className="mt-4 mb-10 relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-950 text-white">
          <div className="absolute inset-0 z-0">
            <img
              src="/background.webp"
              alt="Book Cambodia Taxi Cab and Private Driver"
              className="w-full h-full object-cover object-center opacity-40 scale-105"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=1920&auto=format&fit=crop';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
          </div>

          <div className="relative z-10 p-8 sm:p-12 space-y-4 text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs uppercase tracking-widest text-white font-bold bg-red-600 px-3.5 py-1.5 rounded-full shadow-md">
                Direct Booking Guarantee
              </span>
              <span className="text-xs uppercase tracking-widest text-[#C9A227] font-bold bg-[#C9A227]/20 border border-[#C9A227]/40 px-3 py-1 rounded-full">
                10% Off Applied
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">
              Book Your Ride or Tour
            </h1>
            <p className="text-sm text-slate-200 leading-relaxed max-w-xl mx-auto">
              Fill out your trip requirements below. We'll review your itinerary and confirm your vehicle availability, exact pickup time, and fixed transparent rate.
            </p>
          </div>
        </div>

        <BookingForm
          initialService={initialService}
          initialTourId={initialTourId}
          initialPickup={initialPickup}
          initialDestination={initialDestination}
          initialDate={initialDate}
          initialTime={initialTime}
          initialPassengers={initialPassengers}
        />

      </div>
    </div>
  );
};
