import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { notifications, removeToast } = useApp();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col gap-3 max-w-sm w-[calc(100%-2rem)] pointer-events-none sm:bottom-6 sm:right-6 sm:w-full">
      {notifications.map((n) => (
        <div
          key={n.id}
          role="alert"
          className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-2xl border transition-all duration-300 transform translate-y-0 ${
            n.type === 'success'
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-700/30'
              : n.type === 'error'
              ? 'bg-red-600 text-white border-red-500 shadow-red-700/30'
              : 'bg-blue-600 text-white border-blue-500 shadow-blue-700/30'
          }`}
        >
          <div className="flex items-center gap-3 pr-2">
            {n.type === 'success' && <CheckCircle2 className="w-5 h-5 text-white shrink-0" />}
            {n.type === 'error' && <AlertCircle className="w-5 h-5 text-white shrink-0" />}
            {n.type === 'info' && <Info className="w-5 h-5 text-white shrink-0" />}
            <p className="text-sm font-semibold">{n.message}</p>
          </div>
          <button
            onClick={() => removeToast(n.id)}
            aria-label="Dismiss notification"
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
