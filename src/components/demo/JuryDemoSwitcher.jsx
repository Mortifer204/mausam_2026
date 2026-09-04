import React, { useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  Plane, 
  Sprout, 
  Waves, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  RefreshCw 
} from 'lucide-react';
import { usePersonalization } from '../../context/PersonalizationContext';
import { useWeather } from '../../context/WeatherContext';

export function JuryDemoSwitcher({ onOpenOnboarding }) {
  const [isOpen, setIsOpen] = useState(false);
  const { applyPreset, activePersonas } = usePersonalization();
  const { changeLocation, conditionOverride, setConditionOverride, refreshWeather } = useWeather();

  const handlePersonaPreset = (presetKey, locationId) => {
    applyPreset(presetKey);
    if (locationId) {
      changeLocation(locationId);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 pt-2">
      <div className="rounded-3xl bg-[#1A2436]/75 border border-white/[0.08] p-3 backdrop-blur-xl shadow-glass">
        {/* Toggle Bar */}
        <div 
          onClick={() => setIsOpen(prev => !prev)}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div>
              <div className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                SIH 2026 Jury Demo Toolbar
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">PS 26076</span>
              </div>
              <p className="text-[10px] text-slate-400">
                1-Click Persona & Severity Switcher
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-semibold">
              {isOpen ? 'Close' : 'Test Scenarios'}
            </span>
            {isOpen ? (
              <ChevronUp className="w-4 h-4 text-amber-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-amber-400" />
            )}
          </div>
        </div>

        {/* Expanded Controls for Hackathon Evaluators */}
        {isOpen && (
          <div className="mt-3 pt-2.5 border-t border-white/[0.08] space-y-2.5 text-xs animate-fade-in">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Pre-configured SIH Persona Scenarios:
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {/* Scenario 1: Travel + Health */}
                <button
                  onClick={() => handlePersonaPreset('travel_health', 'delhi')}
                  className="p-2.5 rounded-2xl bg-[#111A2E]/70 hover:bg-[#111A2E] border border-white/[0.06] hover:border-cyan-500/30 text-left transition-all flex items-center gap-2"
                >
                  <Plane className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <div>
                    <div className="text-[11px] font-bold text-white">Travel + Health</div>
                    <div className="text-[9px] text-slate-400">Delhi (AQI & Packing)</div>
                  </div>
                </button>

                {/* Scenario 2: Farming */}
                <button
                  onClick={() => handlePersonaPreset('farming', 'punjab_farm')}
                  className="p-2.5 rounded-2xl bg-[#111A2E]/70 hover:bg-[#111A2E] border border-white/[0.06] hover:border-emerald-500/30 text-left transition-all flex items-center gap-2"
                >
                  <Sprout className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <div className="text-[11px] font-bold text-white">Farming & Agri</div>
                    <div className="text-[9px] text-slate-400">Punjab (Soil & Frost)</div>
                  </div>
                </button>

                {/* Scenario 3: Fitness + Commuter */}
                <button
                  onClick={() => handlePersonaPreset('fitness_commute', 'bengaluru')}
                  className="p-2.5 rounded-2xl bg-[#111A2E]/70 hover:bg-[#111A2E] border border-white/[0.06] hover:border-amber-500/30 text-left transition-all flex items-center gap-2"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <div>
                    <div className="text-[11px] font-bold text-white">Fitness + Commute</div>
                    <div className="text-[9px] text-slate-400">Bengaluru (Run & Fog)</div>
                  </div>
                </button>

                {/* Scenario 4: Coastal Beach */}
                <button
                  onClick={() => handlePersonaPreset('beach_surf', 'goa')}
                  className="p-2.5 rounded-2xl bg-[#111A2E]/70 hover:bg-[#111A2E] border border-white/[0.06] hover:border-cyan-500/30 text-left transition-all flex items-center gap-2"
                >
                  <Waves className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <div>
                    <div className="text-[11px] font-bold text-white">Beach & Marine</div>
                    <div className="text-[9px] text-slate-400">Goa (Tides & Swell)</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Meteorological Urgency Overrides */}
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Simulate Weather Severity:
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setConditionOverride('thunder')}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    conditionOverride === 'thunder'
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-200 font-bold'
                      : 'bg-[#111A2E]/70 border-white/[0.06] text-slate-300 hover:bg-[#111A2E]'
                  }`}
                >
                  <div className="text-[10px] flex items-center justify-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-400" /> Orange Alert
                  </div>
                </button>

                <button
                  onClick={() => setConditionOverride('rain')}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    conditionOverride === 'rain'
                      ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-200 font-bold shadow-glow-cyan'
                      : 'bg-[#111A2E]/70 border-white/[0.06] text-slate-300 hover:bg-[#111A2E]'
                  }`}
                >
                  <div className="text-[10px]">Monsoon Rain</div>
                </button>

                <button
                  onClick={() => setConditionOverride(null)}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    conditionOverride === null
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200 font-bold'
                      : 'bg-[#111A2E]/70 border-white/[0.06] text-slate-300 hover:bg-[#111A2E]'
                  }`}
                >
                  <div className="text-[10px]">Real IMD Feed</div>
                </button>
              </div>
            </div>

            {/* Launch full onboarding flow */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={onOpenOnboarding}
                className="flex-1 py-2.5 px-3 rounded-2xl bg-[#111A2E]/80 hover:bg-[#111A2E] border border-white/[0.08] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Re-run Onboarding Flow</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
