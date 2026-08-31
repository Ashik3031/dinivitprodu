import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Lock, User, AlertCircle, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, demoLogin, error, isLoading, clearError } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    await login(username.trim(), password.trim());
  };

  const handleInputChange = (field: 'user' | 'pass', value: string) => {
    if (error) clearError();
    if (field === 'user') setUsername(value);
    else setPassword(value);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-4 select-none relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-radial from-slate-100 via-slate-50 to-slate-100 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] opacity-40 [background-size:24px_24px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xl shadow-slate-200/50 space-y-6">
        {/* Brand Logo & Title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white mx-auto shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500 block">
            Digital Invitation Studio
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Business Portal Login
          </h1>
          <p className="text-xs text-slate-500">
            Software suite for invitation card printing & design studios
          </p>
        </div>

        {/* Strict Auth Notice */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5 text-slate-700 text-xs leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-900">Private Business Installation: </span>
            Public registration is disabled. Use the login credentials provided by your Administrator.
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-700 font-semibold block mb-1.5">Username / Account ID</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Enter assigned username"
                value={username}
                onChange={(e) => handleInputChange('user', e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 focus:border-slate-900 focus:bg-white rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-colors font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-700 font-semibold block mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => handleInputChange('pass', e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 focus:border-slate-900 focus:bg-white rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-colors font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <span>{isLoading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Logins for Instant Testing */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 block text-center tracking-wider">
            Instant Demo Credentials
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => demoLogin('admin')}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold transition-colors flex flex-col items-center cursor-pointer text-center"
            >
              <span className="text-slate-900 font-bold">Admin Portal</span>
              <span className="text-[10px] text-slate-500">admin / admin123</span>
            </button>

            <button
              type="button"
              onClick={() => demoLogin('business_owner')}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold transition-colors flex flex-col items-center cursor-pointer text-center"
            >
              <span className="text-slate-900 font-bold">Design Studio</span>
              <span className="text-[10px] text-slate-500">royalprints / password123</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
