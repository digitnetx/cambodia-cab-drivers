import React from 'react';
import { useApp } from '../../../context/AppContext';
import { Compass, Home, MapPin } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-28 pb-20 bg-[#FAF9F6] text-slate-800 text-center px-4">
      <div className="max-w-md mx-auto space-y-6 bg-white border border-slate-200 p-8 sm:p-12 rounded-3xl shadow-md">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto">
          <MapPin className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-red-600 font-mono">
          404 — Page Not Found
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans">
          Looks like you've taken a wrong turn.
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed">
          Let's get you back to exploring Cambodia with driver Sareth.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-red-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Back Home</span>
          </button>
          <button
            onClick={() => navigate('/tours')}
            className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-red-600" />
            <span>Explore Tours</span>
          </button>
        </div>
      </div>
    </div>
  );
};
