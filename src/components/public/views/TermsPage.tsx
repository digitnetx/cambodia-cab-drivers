import React from 'react';
import { Breadcrumbs } from '../../layout/Breadcrumbs';

export const TermsPage: React.FC = () => {
  return (
    <div className="pt-28 pb-20 bg-[#FAF9F6] text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <Breadcrumbs />

        <h1 className="text-3xl font-extrabold font-sans text-slate-900">Terms & Conditions</h1>
        <p className="text-xs text-slate-500">Last updated: August 2026</p>

        <div className="space-y-4 text-sm text-slate-700 leading-relaxed bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <p>
            Welcome to Cambodia Taxi Cab (cambodiataxicab.com). By booking a ride or private driver service through this website or WhatsApp, you agree to the following terms and conditions.
          </p>

          <h3 className="text-lg font-bold font-sans text-slate-900 pt-2">1. Booking & Confirmations</h3>
          <p>
            Submitting a booking request via website does not constitute an instant confirmed contract until our driver team verifies vehicle availability and confirms fixed pricing directly with you.
          </p>

          <h3 className="text-lg font-bold font-sans text-slate-900 pt-2">2. Pricing & Payments</h3>
          <p>
            All prices quoted by Cambodia Taxi Cab are fixed and transparent with zero hidden highway toll surcharges. Payment is typically settled in cash (USD or KHR) or ABA Bank transfer upon completion of the service.
          </p>

          <h3 className="text-lg font-bold font-sans text-slate-900 pt-2">3. Flight Delays & Changes</h3>
          <p>
            For airport transfers, our team monitors incoming flight numbers. If your flight is delayed, please inform our team as early as possible via WhatsApp (+855 16 509 371).
          </p>

          <h3 className="text-lg font-bold font-sans text-slate-900 pt-2">4. Passenger Conduct & Safety</h3>
          <p>
            Passengers are required to wear seatbelts where available and respect safety rules during transit across Cambodia.
          </p>
        </div>
      </div>
    </div>
  );
};
