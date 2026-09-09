import React from 'react';
import { Send, CheckCircle2, Car } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Tell Us Your Plans',
      desc: 'Select a service or tour, pick your date, time, and passenger details, then submit your request.',
      icon: Send,
    },
    {
      step: '02',
      title: 'We Confirm',
      desc: 'Our team reviews your request directly, confirms vehicle availability, and sends fixed price details via WhatsApp or email.',
      icon: CheckCircle2,
    },
    {
      step: '03',
      title: 'Enjoy Cambodia',
      desc: 'Meet your assigned driver at the airport terminal or hotel lobby and relax in a comfortable, air-conditioned vehicle.',
      icon: Car,
    },
  ];

  return (
    <section className="py-20 bg-[#FAF9F6] relative overflow-hidden border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-red-600 font-bold block mb-2">
            Simple 3-Step Process
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-sans tracking-tight">
            How Booking With Us Works
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Booking your private transfer or tour in Cambodia is straightforward with direct driver communication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Subtle connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-1/6 right-1/6 h-0.5 bg-slate-200 -translate-y-8 z-0" />

          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-8 relative z-10 hover:border-red-500 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group shadow-xs"
              >
                <div className="absolute top-4 right-4 text-3xl font-sans font-black text-slate-200 group-hover:text-red-500/20 transition-colors">
                  {s.step}
                </div>

                <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:text-white transition-all transform group-hover:scale-110">
                  <Icon className="w-8 h-8" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 font-sans mb-3">
                  {s.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Dispatch & Driver Coordination Feature with taxi one.png */}
        <div className="mt-14 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 max-w-xs">
              <img
                src={encodeURI('/taxi one.png')}
                alt="Cambodia Taxi Cab 24/7 Dispatch Desk & Driver Coordinator"
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=600&auto=format&fit=crop';
                }}
              />
              <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg text-center">
                ● Live Driver Coordination Active
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider">
              <span>Direct Chauffeur Dispatch</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-sans">
              24/7 Dedicated Driver Dispatch & Real-Time Flight Monitoring
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              When you submit a trip request, our local coordination team checks road conditions, schedules your assigned driver, and tracks inbound flight numbers for timely terminal pickups without waiting.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span> Instant WhatsApp Confirmation</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span> Flight Delay Buffer Time Included</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span> Direct Driver Contact Card</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
