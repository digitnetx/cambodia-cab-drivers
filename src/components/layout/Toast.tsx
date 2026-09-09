import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { notifications, removeToast } = useApp();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-xl border transition-all duration-300 transform translate-y-0 ${
            n.type === 'success'
              ? 'bg-white text-slate-900 border-emerald-500 shadow-emerald-500/10'
              : n.type === 'error'
              ? 'bg-white text-slate-900 border-red-500 shadow-red-500/10'
              : 'bg-white text-slate-900 border-blue-500 shadow-blue-500/10'
          }`}
        >
          <div className="flex items-center gap-3 pr-2">
            {n.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
            {n.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />}
            {n.type === 'info' && <Info className="w-5 h-5 text-blue-600 shrink-0" />}
            <p className="text-sm font-semibold">{n.message}</p>
          </div>
          <button
            onClick={() => removeToast(n.id)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
