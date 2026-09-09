import React, { useState } from 'react';
import { FAQ } from '../../types';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQAccordion: React.FC<{ faqs: FAQ[] }> = ({ faqs }) => {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-3">
      {faqs.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div
            key={faq.id}
            className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
              isOpen
                ? 'bg-white border-red-500 shadow-sm ring-1 ring-red-500/20'
                : 'bg-white border-slate-200 hover:border-red-500/50 shadow-xs'
            }`}
          >
            <button
              onClick={() => toggle(faq.id)}
              className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className={`w-5 h-5 shrink-0 transition-colors ${isOpen ? 'text-red-600' : 'text-slate-400'}`} />
                <span className="font-sans font-bold text-sm sm:text-base text-slate-900">
                  {faq.question}
                </span>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                  isOpen ? 'rotate-180 text-red-600' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-1">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
