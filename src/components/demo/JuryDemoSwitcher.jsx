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
      <div className="rounded-2xl bg-gradient-to-r from-amber-500/15 via-sky-500/15 to-purple-500/15 border border-amber-500/30 p-2.5 backdrop-blur-xl shadow-lg">
        {/* Toggle Bar */}
        <div 
          onClick={() => setIsOpen(prev => !prev)}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div>
              <div className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                SIH 2026 Jury Demo Toolbar
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">PS 26076</span>
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
          <div className="mt-3 pt-2.5 border-t border-white/10 space-y-2.5 text-xs animate-fade-in">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Pre-configured SIH Persona Scenarios:
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {/* Scenario 1: Travel + Health */}
                <button
                  onClick={() => handlePersonaPreset('travel_health', 'delhi')}
                  className="p-2 rounded-xl bg-white/5 hover:bg-sky-500/20 border border-white/10 hover:border-sky-500/30 text-left transition flex items-center gap-2"
                >
                  <Plane className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                  <div>
                    <div className="text-[11px] font-bold text-white">Travel + Health</div>
                    <div className="text-[9px] text-slate-400">Delhi (AQI & Packing)</div>
                  </div>
                </button>

                {/* Scenario 2: Farming */}
                <button
                  onClick={() => handlePersonaPreset('farming', 'punjab_farm')}
                  className="p-2 rounded-xl bg-white/5 hover:bg-green-500/20 border border-white/10 hover:border-green-500/30 text-left transition flex items-center gap-2"
                >
                  <Sprout className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                  <div>
                    <div className="text-[11px] font-bold text-white">Farming & Agri</div>
                    <div className="text-[9px] text-slate-400">Punjab (Soil & Frost)</div>
                  </div>
                </button>

                {/* Scenario 3: Fitness + Commuter */}
                <button
                  onClick={() => handlePersonaPreset('fitness_commute', 'bengaluru')}
                  className="p-2 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/30 text-left transition flex items-center gap-2"
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
                  className="p-2 rounded-xl bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/30 text-left transition flex items-center gap-2"
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
                  className={`p-1.5 rounded-lg border text-center transition ${
                    conditionOverride === 'thunder'
                      ? 'bg-orange-500/30 border-orange-500 text-orange-200 font-bold'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div className="text-[10px] flex items-center justify-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-orange-400" /> Orange Alert
                  </div>
                </button>

                <button
                  onClick={() => setConditionOverride('rain')}
                  className={`p-1.5 rounded-lg border text-center transition ${
                    conditionOverride === 'rain'
                      ? 'bg-cyan-500/30 border-cyan-500 text-cyan-200 font-bold'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div className="text-[10px]">Monsoon Rain</div>
                </button>

                <button
                  onClick={() => setConditionOverride(null)}
                  className={`p-1.5 rounded-lg border text-center transition ${
                    conditionOverride === null
                      ? 'bg-emerald-500/30 border-emerald-500 text-emerald-200 font-bold'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
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
                className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Re-run Onboarding Flow</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
