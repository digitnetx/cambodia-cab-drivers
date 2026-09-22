import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Calendar, MessageSquare, Phone, MapPin } from 'lucide-react';
import { getWhatsAppGeneralUrl } from '../../lib/whatsapp';

export const MobileBottomBar: React.FC = () => {
  const { currentPath, navigate, t, language } = useApp();

  const isHome = currentPath === '/';
  const isBook = currentPath === '/book';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-md border-t border-slate-200 px-2 sm:px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-2xl">
      <div className="grid grid-cols-4 gap-1 items-center max-w-md mx-auto">
        
        {/* Home */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition cursor-pointer ${
            isHome ? 'text-red-600 font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">{t.mobileBar.home}</span>
        </button>

        {/* Routes */}
        <button
          type="button"
          onClick={() => {
            if (currentPath !== '/') {
              navigate('/');
              setTimeout(() => {
                const el = document.getElementById('popular-routes');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 150);
            } else {
              const el = document.getElementById('popular-routes');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-slate-600 hover:text-slate-900 transition cursor-pointer"
        >
          <MapPin className="w-5 h-5 mb-0.5 text-red-600" />
          <span className="text-[10px] tracking-tight">{t.mobileBar.routes}</span>
        </button>

        {/* Book Now (Highlighted CTA) */}
        <button
          type="button"
          onClick={() => navigate('/book')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition cursor-pointer ${
            isBook
              ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/30'
              : 'bg-red-600 text-white font-bold hover:bg-red-700 shadow-md shadow-red-600/30'
          }`}
        >
          <Calendar className="w-5 h-5 mb-0.5 text-white" />
          <span className="text-[10px] font-extrabold tracking-tight">{t.mobileBar.book}</span>
        </button>

        {/* WhatsApp */}
        <a
          href={getWhatsAppGeneralUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 rounded-xl text-slate-700 hover:text-red-600 transition"
        >
          <MessageSquare className="w-5 h-5 mb-0.5 text-red-600" />
          <span className="text-[10px] font-bold tracking-tight">{t.mobileBar.whatsapp}</span>
        </a>

      </div>
    </div>
  );
};
