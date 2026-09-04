import React from 'react';
import { 
  CloudSun, 
  Sparkles, 
  ArrowRight, 
  LogIn, 
  UserPlus, 
  UserCheck, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function WelcomeScreen() {
  const { setAuthView, continueAsGuest } = useAuth();

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0B1220] via-[#0E1626] to-[#111A2E] text-white flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-72 h-72 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none" />

      {/* 1. Top Government & Official MoES / IMD Badge */}
      <div className="relative z-10 pt-4 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1A2436]/80 border border-white/[0.08] text-[11px] font-semibold text-slate-300 backdrop-blur-md shadow-glass">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>MoES & India Meteorological Department (IMD)</span>
        </div>
      </div>

      {/* 2. Hero Centerpiece (Logo, Heading, Tagline, Description) */}
      <div className="relative z-10 max-w-sm mx-auto my-auto text-center space-y-5 py-6">
        {/* Animated App Logo Icon */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-sky-500 opacity-40 blur-xl animate-pulse-slow" />
          <div className="relative w-20 h-20 rounded-3xl bg-[#111A2E] border border-cyan-500/30 shadow-glass flex items-center justify-center">
            <CloudSun className="w-10 h-10 text-cyan-400 animate-float" />
          </div>
        </div>

        {/* Heading & Tagline */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-cyan-400 tracking-widest uppercase">
            SIH 2026 Problem Statement 26076
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Welcome to <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-300 bg-clip-text text-transparent">Mausam</span>
          </h1>
          <p className="text-sm font-semibold text-slate-200">
            Weather that understands you.
          </p>
        </div>

        {/* Short Product Description */}
        <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
          India's first personalized weather assistant. Dynamically organizes live forecasts, AQI warnings, and custom advisories around your daily life.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          {["Live GPS Radar", "Smart Personalization", "Official IMD Bulletins"].map((feat, i) => (
            <span key={i} className="text-[10px] px-2.5 py-1 rounded-full bg-[#111A2E]/80 border border-white/[0.08] text-slate-300 font-medium">
              {feat}
            </span>
          ))}
        </div>
      </div>

      {/* 3. Three Prominent Action Buttons (Login, Sign Up, Trial/Guest) */}
      <div className="relative z-10 max-w-sm mx-auto w-full space-y-3 pb-4">
        {/* Button 1: Sign Up (Primary Highlight) */}
        <button
          onClick={() => setAuthView('signup')}
          className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs tracking-wider uppercase shadow-glow-cyan transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Sign Up with Email</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Button 2: Login */}
        <button
          onClick={() => setAuthView('login')}
          className="w-full py-3.5 px-5 rounded-2xl bg-[#1A2436]/80 hover:bg-[#1A2436] border border-white/[0.08] text-white font-bold text-xs tracking-wider uppercase backdrop-blur-md transition-all active:scale-95 flex items-center justify-center gap-2 shadow-glass"
        >
          <LogIn className="w-4 h-4 text-cyan-400" />
          <span>Log In</span>
        </button>

        {/* Button 3: Trial / Guest Mode */}
        <button
          onClick={continueAsGuest}
          className="w-full py-3 px-5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs tracking-wider uppercase backdrop-blur-md transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Continue as Trial / Guest</span>
        </button>

        {/* Footnote */}
        <p className="text-[10px] text-slate-500 text-center pt-2">
          By continuing, you access official IMD meteorological feeds & local forecasts.
        </p>
      </div>
    </div>
  );
}
