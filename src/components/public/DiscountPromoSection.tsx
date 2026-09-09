import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, ShieldCheck, Tag, Percent } from 'lucide-react';

export const DiscountPromoSection: React.FC = () => {
  const { navigate } = useApp();

  return (
    <section className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-red-600 via-red-700 to-slate-950 text-white shadow-xl">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-yellow-400/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
            
            {/* Left Promo Graphic (Cambodia.png) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group max-w-sm">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl blur-xs opacity-75 group-hover:opacity-100 transition duration-300" />
                <div className="relative bg-white rounded-2xl p-4 shadow-2xl border border-yellow-300 text-slate-900">
                  <img
                    src="/Cambodia.png"
                    alt="Cambodia Cab Driver 10% Discount Promotion"
                    className="w-full h-auto object-contain rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                  <div className="mt-3 text-center">
                    <span className="inline-flex items-center gap-1 bg-red-600 text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                      <Tag className="w-3 h-3" />
                      Promo Code: DIRECT10
                    </span>
                    <p className="text-[11px] text-slate-500 font-semibold mt-1">
                      Applied automatically at checkout for all website bookings
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Promo Text & Action */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/20 border border-yellow-300/40 text-yellow-300 text-xs font-bold uppercase tracking-wider">
                <Percent className="w-3.5 h-3.5 text-yellow-300" />
                <span>Special Online Booking Offer</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">
                Save 10% On All Cambodia Taxi & Private Driver Bookings
              </h3>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium max-w-xl">
                Book your airport transfer, intercity ride, or private temple tour directly through our website and enjoy an instant 10% direct booking discount with zero agency commission fees.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-yellow-400 shrink-0" />
                  <span>Fixed upfront rates</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-yellow-400 shrink-0" />
                  <span>No credit card fee</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-yellow-400 shrink-0" />
                  <span>Free cancellation</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate('/book')}
                  className="px-6 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition shadow-lg shadow-yellow-400/30 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Claim 10% Discount & Book</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>

                <button
                  onClick={() => navigate('/transfers')}
                  className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm rounded-xl transition"
                >
                  <span>Explore Route Rates</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
