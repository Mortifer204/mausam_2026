import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  Zap,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth, isValidGmail } from '../context/AuthContext';

export function AuthScreen({ initialMode = 'login' }) {
  const { setAuthView, login, signup, continueAsGuest, authLoading } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const isEmailValidGmail = isValidGmail(email);
  const showEmailHint = email.length > 0 && !isEmailValidGmail;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Strict Gmail validation
    if (!isValidGmail(email)) {
      setError('Please enter a valid Gmail address ending with @gmail.com (e.g., yourname@gmail.com).');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your details.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0B1220] via-[#0E1626] to-[#111A2E] text-white flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

      {/* 1. Header with Back Button */}
      <div className="relative z-10 max-w-sm mx-auto w-full pt-2 flex items-center justify-between">
        <button
          onClick={() => setAuthView('welcome')}
          className="w-10 h-10 rounded-2xl bg-[#1A2436]/80 border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#1A2436] transition shadow-glass"
          title="Back to Welcome Page"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium px-3 py-1.5 rounded-full bg-[#1A2436]/80 border border-white/[0.08]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>MoES Secure Citizen Portal</span>
        </div>
      </div>

      {/* 2. Main Auth Card */}
      <div className="relative z-10 max-w-sm mx-auto w-full my-auto py-6">
        <div className="mausam-card rounded-3xl p-6 border border-white/[0.08] shadow-glass space-y-5">
          <div>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
              {mode === 'login' ? 'Citizen Account Access' : 'New Citizen Registration'}
            </span>
            <h2 className="text-2xl font-black text-white mt-1">
              {mode === 'login' ? 'Log in with Gmail' : 'Register with Gmail'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {mode === 'login' 
                ? 'Sign in with your registered Gmail to restore your saved locations and weather preferences.'
                : 'Your profile and personalized dashboard are stored permanently on the backend.'}
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name field for Sign Up */}
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Roshan Kumar"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#111A2E]/80 border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 transition"
                  />
                </div>
              </div>
            )}

            {/* Email Address field with Gmail Validation */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-300">Gmail Address</label>
                {isEmailValidGmail && (
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Valid Gmail
                  </span>
                )}
              </div>
              <div className="relative">
                <Mail className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                  isEmailValidGmail ? 'text-emerald-400' : 'text-slate-400'
                }`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="yourname@gmail.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-[#111A2E]/80 border text-xs text-white placeholder-slate-500 focus:outline-none transition ${
                    isEmailValidGmail 
                      ? 'border-emerald-500/40 focus:border-emerald-400' 
                      : showEmailHint 
                      ? 'border-amber-500/50 focus:border-amber-400' 
                      : 'border-white/[0.08] focus:border-cyan-400/60'
                  }`}
                />
              </div>

              {showEmailHint && (
                <p className="text-[10px] text-amber-400 pt-0.5">
                  Must end with <strong>@gmail.com</strong>
                </p>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-300">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => alert('Password reset link will be sent to your Gmail address.')}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 font-medium"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-2xl bg-[#111A2E]/80 border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-cyan-400 active:text-cyan-300 transition-colors z-20 flex items-center justify-center cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs tracking-wider uppercase shadow-glow-cyan transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {authLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Log In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle between Login and Signup */}
          <div className="pt-2 text-center text-xs text-slate-400">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setError(''); }}
                  className="text-cyan-400 hover:text-cyan-300 font-bold ml-1"
                >
                  Sign Up
                </button>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); }}
                  className="text-cyan-400 hover:text-cyan-300 font-bold ml-1"
                >
                  Log In
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Or Trial/Guest link */}
        <div className="pt-4 text-center">
          <button
            onClick={continueAsGuest}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center justify-center gap-1.5 mx-auto"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Or explore as Trial / Guest without account</span>
          </button>
        </div>
      </div>

      {/* 3. Bottom Credits */}
      <div className="relative z-10 text-center text-[10px] text-slate-500 pb-2">
        Mausam • Ministry of Earth Sciences • Government of India
      </div>
    </div>
  );
}
