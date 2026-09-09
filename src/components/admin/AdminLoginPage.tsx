import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import { Logo } from '../common/Logo';

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin, navigate } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await loginAdmin(email, password);
    setLoading(false);
    if (success) {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#1e3a5f_0,_#0f172a_45%,_#020617_100%)]" />
      <div className="absolute -top-32 -left-24 w-96 h-96 bg-red-600/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-32 -right-24 w-96 h-96 bg-amber-400/10 blur-3xl rounded-full" />
      <div className="max-w-md w-full bg-white/95 backdrop-blur border border-white/30 rounded-3xl p-7 sm:p-9 shadow-2xl space-y-7 text-slate-800 relative">
        
        <div className="text-center space-y-3">
          <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 p-1.5 flex items-center justify-center mx-auto shadow-lg shadow-slate-900/10">
            <Logo variant="icon" size="xl" className="w-full h-full" />
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-slate-600 uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-red-600" /> Secure access
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Welcome back
          </h1>

          <p className="text-xs text-slate-600">
            Sign in to manage Cambodia Taxi Cab.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-red-600" />
              Admin Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-red-600" />
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white font-extrabold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-red-600/25 cursor-pointer"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-100">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-slate-500 hover:text-slate-900 transition font-bold cursor-pointer"
          >
            ← Back to Public Website
          </button>
        </div>

      </div>
    </div>
  );
};
