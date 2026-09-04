import React from 'react';
import { 
  Sliders, 
  Sparkles, 
  Check, 
  RotateCcw, 
  ShieldCheck, 
  Settings2, 
  Pin,
  HeartPulse,
  Flame,
  Plane,
  Sprout,
  Users,
  Car,
  Waves,
  CalendarCheck,
  LogOut,
  User,
  Zap
} from 'lucide-react';
import { PERSONA_CATEGORIES } from '../data/personaProfiles';
import { usePersonalization } from '../context/PersonalizationContext';
import { useAuth } from '../context/AuthContext';

const ICON_MAP = {
  HeartPulse,
  Flame,
  Plane,
  Sprout,
  Users,
  Car,
  Waves,
  CalendarCheck
};

export function ProfileScreen({ onOpenOnboarding }) {
  const { 
    activePersonas, 
    togglePersona, 
    pinnedWidgetIds, 
    togglePinWidget,
    unit,
    setUnit,
    isCustomLifestyle,
    resetToDefaultPersonas
  } = usePersonalization();

  const { user, logout } = useAuth();

  return (
    <div className="w-full max-w-md mx-auto px-4 pb-28 pt-2 space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Personalization Center</h2>
        <p className="text-xs text-slate-400">Configure how Mausam tailors intelligence to your life</p>
      </div>

      {/* 0. Citizen Account Card with Log Out */}
      {user && (
        <div className="glass-card rounded-3xl p-4 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${
              user.isGuest 
                ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' 
                : 'bg-sky-500/20 border-sky-500/30 text-sky-400'
            }`}>
              {user.isGuest ? <Zap className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{user.name}</span>
                {user.isGuest && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-extrabold uppercase">
                    Guest Mode
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400">{user.email}</div>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/30 text-xs font-semibold text-slate-300 hover:text-rose-300 transition flex items-center gap-1.5"
            title="Log out and return to Welcome page"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      )}

      {/* 1. Active Persona Multi-Selector */}
      <div className="glass-card rounded-3xl p-5 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className={`w-4 h-4 ${isCustomLifestyle ? 'text-amber-400' : 'text-sky-400'}`} />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Your Lifestyle Interests
            </h3>
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
            isCustomLifestyle 
              ? 'bg-amber-500/15 border-amber-500/30 text-amber-300' 
              : 'bg-sky-500/10 border-sky-500/20 text-sky-400'
          }`}>
            {isCustomLifestyle ? 'Custom Setup Active' : `${activePersonas.length} Active`}
          </span>
        </div>

        {isCustomLifestyle && (
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between text-xs animate-fade-in">
            <span className="text-amber-300 text-[11px] leading-tight">
              You customized widgets by adding or removing cards.
            </span>
            <button
              onClick={resetToDefaultPersonas}
              className="text-[10px] font-bold text-amber-200 bg-amber-500/25 hover:bg-amber-500/35 px-2.5 py-1 rounded-lg border border-amber-500/40 flex items-center gap-1 flex-shrink-0 ml-2 transition"
            >
              <RotateCcw className="w-3 h-3" /> Reset Categories
            </button>
          </div>
        )}

        <p className="text-xs text-slate-400">
          Tap any category to add or remove it from your real-time widget prioritization formula.
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          {PERSONA_CATEGORIES.map(cat => {
            const Icon = ICON_MAP[cat.icon] || Sparkles;
            const isSelected = activePersonas.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => togglePersona(cat.id)}
                className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                  isSelected 
                    ? 'bg-sky-500/20 border-sky-400 text-white font-bold' 
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-sky-400' : 'text-slate-400'}`} />
                  <span className="text-xs">{cat.title}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-sky-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Pinned Top-Priority Cards Manager */}
      <div className="glass-card rounded-3xl p-5 border border-white/10 space-y-3">
        <div className="flex items-center gap-2">
          <Pin className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Pinned Priority Widgets
          </h3>
        </div>

        <p className="text-xs text-slate-400">
          Widgets you pin are given an automatic scoring boost, guaranteeing top placement on your Home canvas.
        </p>

        {pinnedWidgetIds.length === 0 ? (
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center text-xs text-slate-400">
            No widgets pinned yet. Tap the pin icon on any widget card to lock it to the top.
          </div>
        ) : (
          <div className="space-y-1.5">
            {pinnedWidgetIds.map(wId => (
              <div key={wId} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-white">
                <span className="capitalize">{wId.replace('_', ' ')}</span>
                <button
                  onClick={() => togglePinWidget(wId)}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
                >
                  Unpin
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Measurement Units */}
      <div className="glass-card rounded-3xl p-5 border border-white/10 space-y-3">
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-slate-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Meteorological Measurement Units
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setUnit('celsius')}
            className={`p-2.5 rounded-xl border text-xs font-semibold transition ${
              unit === 'celsius'
                ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                : 'bg-white/5 border-white/5 text-slate-400'
            }`}
          >
            Metric (°C, km/h, mm)
          </button>
          <button
            onClick={() => setUnit('fahrenheit')}
            className={`p-2.5 rounded-xl border text-xs font-semibold transition ${
              unit === 'fahrenheit'
                ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                : 'bg-white/5 border-white/5 text-slate-400'
            }`}
          >
            Imperial (°F, mph, in)
          </button>
        </div>
      </div>

      {/* 4. Onboarding & Reset */}
      <div className="space-y-2">
        <button
          onClick={onOpenOnboarding}
          className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-bold flex items-center justify-center gap-2 transition"
        >
          <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
          <span>Re-run Guided Onboarding Flow</span>
        </button>
      </div>

      {/* Official MoES & SIH 2026 Credits */}
      <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center justify-center gap-1.5 text-white font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Ministry of Earth Sciences (MoES) & IMD</span>
        </div>
        <p>Smart India Hackathon 2026 • Problem Statement 26076</p>
        <p className="text-[10px] text-slate-500">Theme: Smart Automation & Personalized Forecasting</p>
      </div>
    </div>
  );
}
