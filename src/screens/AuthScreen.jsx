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
  CheckCircle2
} from 'lucide-react';
import { useAuth, isValidGmail } from '../context/AuthContext';

export function AuthScreen({ initialMode = 'login' }) {
  const { setAuthView, login, signup, continueAsGuest, authLoading } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen w-full bg-[#050814] text-white flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

      {/* 1. Header with Back Button */}
      <div className="relative z-10 max-w-sm mx-auto w-full pt-2 flex items-center justify-between">
        <button
          onClick={() => setAuthView('welcome')}
          className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition"
          title="Back to Welcome Page"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>MoES Secure Citizen Portal</span>
        </div>
      </div>

      {/* 2. Main Auth Card */}
      <div className="relative z-10 max-w-sm mx-auto w-full my-auto py-6">
        <div className="glass-card rounded-3xl p-6 border border-white/15 shadow-2xl space-y-5">
          <div>
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
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
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400/60 transition"
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
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border text-xs text-white placeholder-slate-500 focus:outline-none transition ${
                    isEmailValidGmail 
                      ? 'border-emerald-500/40 focus:border-emerald-400' 
                      : showEmailHint 
                      ? 'border-amber-500/50 focus:border-amber-400' 
                      : 'border-white/10 focus:border-sky-400/60'
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
                    className="text-[10px] text-sky-400 hover:text-sky-300 font-medium"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400/60 transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-sky-500/25 transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
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
                  className="text-sky-400 hover:text-sky-300 font-bold ml-1"
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
                  className="text-sky-400 hover:text-sky-300 font-bold ml-1"
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
