import React from 'react';
import { UserCheck, Languages, Sparkles, Compass, MessageSquare } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const trustPoints = [
    {
      icon: UserCheck,
      title: 'Local Cambodian Drivers',
      desc: 'Our dedicated local drivers have deep knowledge of national routes, tourist sites, and Cambodian roads.',
    },
    {
      icon: Languages,
      title: 'English Speaking',
      desc: 'Communicate smoothly about your trip plans, stops, hotel drop-offs, and preferences.',
    },
    {
      icon: Sparkles,
      title: 'Comfortable Travel',
      desc: 'Air-conditioned SUV/sedan, pristine cleanliness, complimentary bottled water, and smooth rides.',
    },
    {
      icon: Compass,
      title: 'Flexible Trips',
      desc: 'Tailor your itinerary, add extra sightseeing stops, and adjust times at your own pace.',
    },
    {
      icon: MessageSquare,
      title: 'Easy Booking',
      desc: 'Direct website requests with instant WhatsApp confirmation and clear transparent pricing.',
    },
  ];

  return (
    <section className="py-12 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {trustPoints.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#FAF9F6] border border-slate-200 rounded-xl p-5 hover:border-red-500 hover:shadow-md transition-all duration-300 group shadow-xs"
              >
                <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mb-3 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-slate-900 font-bold text-sm mb-1.5 font-sans group-hover:text-red-600 transition-colors">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
