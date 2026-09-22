import React from 'react';
import { MessageSquare } from 'lucide-react';
import { getWhatsAppGeneralUrl } from '../../lib/whatsapp';
import { useApp } from '../../context/AppContext';

export const FloatingWhatsApp: React.FC = () => {
  const { showToast } = useApp();

  return (
    <a
      href={getWhatsAppGeneralUrl()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => showToast('Opening WhatsApp to message driver team...', 'success')}
      className="fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-40 flex items-center gap-2 px-3 sm:px-4 py-3 bg-white hover:bg-slate-50 text-slate-800 font-medium rounded-full shadow-2xl hover:scale-105 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-red-500 border border-slate-200"
      aria-label="Contact Driver Team via WhatsApp"
    >
      <div className="relative">
        <MessageSquare className="w-5 h-5 text-red-500" />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
      </div>
      <span className="text-sm font-bold tracking-wide hidden sm:inline">
        WhatsApp Us
      </span>
    </a>
  );
};
