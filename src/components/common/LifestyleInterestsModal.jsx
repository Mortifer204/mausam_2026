import React from 'react';
import { Sparkles, X, RotateCcw, Check } from 'lucide-react';
import { PERSONA_CATEGORIES } from '../../data/personaProfiles';
import { usePersonalization } from '../../context/PersonalizationContext';
import { 
  HeartPulse, 
  Flame, 
  Plane, 
  Sprout, 
  Users, 
  Car, 
  Waves, 
  CalendarCheck 
} from 'lucide-react';

const ICON_MAP = {
  HeartPulse,
  Flame,
  Plane,
  Sprout,
  Users,
  Car,
  Waves,
  CalendarCheck,
};

export function LifestyleInterestsModal({ isOpen, onClose }) {
  const { 
    activePersonas, 
    togglePersona, 
    isCustomLifestyle, 
    resetToDefaultPersonas 
  } = usePersonalization();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto">
      {/* Soft translucent backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      />

      {/* Outer wrapper constrained to max-w-md mx-auto matching the app's mobile screen column */}
      <div className="fixed inset-x-0 top-0 max-w-md mx-auto pointer-events-none px-4 z-50">
        {/* Popover anchored directly below the 4-dot button inside the mobile frame */}
        <div className="pointer-events-auto mt-14 w-[290px] sm:w-[310px] rounded-3xl mausam-card p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/[0.12] animate-slide-up space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between pb-1 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Lifestyle Interests
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-slate-400 hover:text-white transition"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Custom status badge & reset if customized */}
        <div className="flex items-center justify-between text-xs">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
            isCustomLifestyle 
              ? 'bg-amber-500/15 border-amber-500/30 text-amber-300' 
              : 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400'
          }`}>
            {isCustomLifestyle ? 'Custom Active' : `${activePersonas.length} Active`}
          </span>

          {isCustomLifestyle && (
            <button
              onClick={resetToDefaultPersonas}
              className="text-[10px] font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-2.5 h-2.5" /> Reset
            </button>
          )}
        </div>

        {/* Subtitle description */}
        <p className="text-[11px] text-slate-300 leading-snug">
          Tap categories to tailor your dashboard widgets:
        </p>

        {/* Categories Grid (2 columns, compact pills matching design system) */}
        <div className="grid grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto pr-0.5 no-scrollbar">
          {PERSONA_CATEGORIES.map(cat => {
            const Icon = ICON_MAP[cat.icon] || Sparkles;
            const isSelected = activePersonas.includes(cat.id);

            return (
              <button
                key={cat.id}
                onClick={() => togglePersona(cat.id)}
                className={`py-2 px-2.5 rounded-xl border text-left transition-all duration-200 flex items-center justify-between gap-1.5 ${
                  isSelected 
                    ? 'bg-cyan-500/20 border-cyan-400 text-white font-semibold shadow-[0_0_12px_rgba(6,182,212,0.25)]' 
                    : 'bg-white/[0.04] border-white/[0.07] text-slate-300 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span className="text-[11px] truncate">{cat.title}</span>
                </div>
                {isSelected && (
                  <Check className="w-3 h-3 text-cyan-400 flex-shrink-0 stroke-[2.8]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Apply button */}
        <div className="pt-1">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] tracking-wider uppercase shadow-[0_0_15px_rgba(6,182,212,0.3)] transition active:scale-95 text-center"
          >
            Apply & Done
          </button>
        </div>
      </div>
    </div>
  </div>
);
}
