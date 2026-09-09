import React from 'react';
import { Breadcrumbs } from '../../layout/Breadcrumbs';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="pt-28 pb-20 bg-[#FAF9F6] text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <Breadcrumbs />

        <h1 className="text-3xl font-extrabold font-sans text-slate-900">Privacy Policy</h1>
        <p className="text-xs text-slate-500">Last updated: August 2026</p>

        <div className="space-y-4 text-sm text-slate-700 leading-relaxed bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <p>
            At Cambodia Taxi Cab (cambodiataxicab.com), we respect your privacy and are committed to protecting the personal information you share with us when requesting transportation services.
          </p>

          <h3 className="text-lg font-bold font-sans text-slate-900 pt-2">1. Information We Collect</h3>
          <p>
            When you submit a booking or contact request, we collect your name, email address, phone number, WhatsApp contact, travel dates, pickup/destination addresses, flight details, and special trip requests.
          </p>

          <h3 className="text-lg font-bold font-sans text-slate-900 pt-2">2. How We Use Your Information</h3>
          <p>
            We use your personal information solely to fulfill your transportation requests, coordinate airport pickups, confirm fixed pricing via WhatsApp or email, and ensure a smooth driver service in Cambodia.
          </p>

          <h3 className="text-lg font-bold font-sans text-slate-900 pt-2">3. Third-Party Sharing</h3>
          <p>
            We do NOT sell, rent, or trade your personal data to third parties or marketing advertisers. Your information is accessed only by authorized driver personnel for service coordination.
          </p>

          <h3 className="text-lg font-bold font-sans text-slate-900 pt-2">4. Contact Us</h3>
          <p>
            If you have questions regarding your data privacy, feel free to contact our team via WhatsApp (+855 16 509 371) or email (info@cambodiataxicab.com or digitnetx@gmail.com).
          </p>
        </div>
      </div>
    </div>
  );
};
