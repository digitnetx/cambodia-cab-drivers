import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, DollarSign, Clock, HeartHandshake, Compass, Smile, Sparkles, Award, MessageSquare } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  DollarSign,
  ShieldCheck,
  Clock,
  HeartHandshake,
  Compass,
  Smile,
  Award,
  MessageSquare,
  Sparkles,
};

export const WhyBookDirectSection: React.FC = () => {
  const { whyChooseUs = [], t } = useApp();

  const activeBenefits = (whyChooseUs || [])
    .filter((b) => b && b.is_active)
    .sort((a, b) => (a?.display_order || 0) - (b?.display_order || 0));

  return (
    <section className="py-20 bg-white border-b border-slate-200 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            <span>{t.whyDirect.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 font-sans tracking-tight">
            {t.whyDirect.title}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {t.whyDirect.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeBenefits.map((benefit) => {
            const Icon = iconMap[benefit.icon] || ShieldCheck;
            return (
              <div
                key={benefit.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-red-500/60 shadow-xs transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    {benefit.badge && (
                      <span className="text-[10px] font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                        {benefit.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 font-sans">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
