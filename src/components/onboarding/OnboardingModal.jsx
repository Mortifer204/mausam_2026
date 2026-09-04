import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  MapPin, 
  Compass, 
  HeartPulse, 
  Flame, 
  Plane, 
  Sprout, 
  Users, 
  Car, 
  Waves, 
  CalendarCheck,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { PERSONA_CATEGORIES } from '../../data/personaProfiles';
import { usePersonalization } from '../../context/PersonalizationContext';
import { useWeather } from '../../context/WeatherContext';

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

export function OnboardingModal({ isOpen, onClose }) {
  const { 
    activePersonas, 
    togglePersona, 
    setPersonas, 
    answers, 
    saveAnswer, 
    completeOnboarding 
  } = usePersonalization();

  const { allLocations, changeLocation, activeLocationId } = useWeather();

  const [step, setStep] = useState(1); // 1: Welcome, 2: Interests, 3: Micro-questions, 4: Live Preview
  const [selectedLocId, setSelectedLocId] = useState(activeLocationId);

  if (!isOpen) return null;

  // Find questions for selected personas
  const selectedPersonaObjs = PERSONA_CATEGORIES.filter(p => activePersonas.includes(p.id));
  const relevantQuestions = selectedPersonaObjs.flatMap(p => p.questions || []);

  const handleFinish = () => {
    changeLocation(selectedLocId);
    completeOnboarding();
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark blur backdrop */}
      <div className="fixed inset-0 bg-black/85 backdrop-blur-xl animate-fade-in" />

      <div className="relative z-10 w-full max-w-md bg-[#090e1c] border border-white/15 rounded-3xl p-6 shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        {/* Step Progress Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold tracking-wider text-sky-400 uppercase">
              Step {step} of 4
            </span>
          </div>

          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map(s => (
              <div 
                key={s} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? 'w-6 bg-sky-400' : s < step ? 'w-3 bg-emerald-400' : 'w-2 bg-slate-700'
                }`} 
              />
            ))}
          </div>
        </div>

        {/* STEP 1: WELCOME */}
        {step === 1 && (
          <div className="space-y-4 my-auto text-center py-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(56,189,248,0.4)]">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>

            <div>
              <span className="text-[11px] font-bold text-sky-400 tracking-wider uppercase">
                Smart India Hackathon 2026 • MoES / IMD
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                Weather that understands you.
              </h2>
              <p className="text-xs text-slate-300 max-w-xs mx-auto mt-2 leading-relaxed">
                Traditional weather apps show everyone the same static numbers. <strong>Mausam</strong> learns what you care about and dynamically rebuilds your dashboard.
              </p>
            </div>

            <div className="pt-4 space-y-2">
              <button
                onClick={() => setStep(2)}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-sky-500/25 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Personalize My Experience</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleFinish}
                className="w-full py-2.5 text-xs text-slate-400 hover:text-white transition"
              >
                Skip to Standard Dashboard
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: MULTI-INTEREST PICKER */}
        {step === 2 && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            <div>
              <h3 className="text-lg font-bold text-white">What do you use weather for?</h3>
              <p className="text-xs text-slate-400 mt-0.5">Select all categories that apply to your lifestyle.</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {PERSONA_CATEGORIES.map(cat => {
                const IconComponent = ICON_MAP[cat.icon] || Compass;
                const isSelected = activePersonas.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => togglePersona(cat.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 relative group flex flex-col justify-between min-h-[96px] ${
                      isSelected 
                        ? 'bg-sky-500/20 border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.2)]' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-sky-500 text-white' : 'bg-white/5 text-slate-300'}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-sky-400 flex items-center justify-center text-slate-950">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white mt-2">{cat.title}</div>
                      <div className="text-[9px] text-slate-400 truncate max-w-[130px]">{cat.tagline}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-3">
              <button
                onClick={() => setStep(relevantQuestions.length > 0 ? 3 : 4)}
                className="w-full py-3 px-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs tracking-wide shadow-lg shadow-sky-500/25 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CATEGORY-SPECIFIC QUESTIONS */}
        {step === 3 && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            <div>
              <h3 className="text-lg font-bold text-white">Fine-tune your priorities</h3>
              <p className="text-xs text-slate-400 mt-0.5">Quickly personalize how we calculate your daily advice.</p>
            </div>

            <div className="space-y-4">
              {relevantQuestions.slice(0, 3).map((q) => (
                <div key={q.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <span className="text-xs font-semibold text-slate-200 block">{q.prompt}</span>
                  <div className="space-y-1.5">
                    {q.options.map(opt => {
                      const isChosen = answers[q.id] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => saveAnswer(q.id, opt.value)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between border transition ${
                            isChosen 
                              ? 'bg-sky-500/20 border-sky-400 text-sky-300 font-semibold' 
                              : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {isChosen && <Check className="w-3.5 h-3.5 text-sky-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setStep(2)}
                className="py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 py-3 px-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs tracking-wide shadow-lg shadow-sky-500/25 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Preview My Live Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: LIVE PREVIEW & LOCATION */}
        {step === 4 && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-center">
            <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center gap-2 font-medium">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin-slow" />
              <span>Smart Dynamic Canvas Generated!</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Select Your Primary Region</h3>
              <p className="text-xs text-slate-400 mt-0.5">Where should we base your initial weather forecast?</p>
            </div>

            <div className="space-y-1.5 text-left">
              {allLocations.map(loc => {
                const isSelected = selectedLocId === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => setSelectedLocId(loc.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs transition ${
                      isSelected 
                        ? 'bg-sky-500/20 border-sky-400 text-white font-bold' 
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <div className="text-xs">{loc.name}</div>
                      <div className="text-[10px] text-slate-400">{loc.type}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{loc.current?.temp ?? loc.temp ?? "--"}°C</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-sky-400" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-left text-xs text-slate-300 space-y-1">
              <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                Prioritized Widgets Ready:
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedPersonaObjs.map(p => (
                  <span key={p.id} className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-semibold">
                    {p.title}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleFinish}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-white font-bold text-xs tracking-wide shadow-xl shadow-emerald-500/25 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Launch My Personalized Mausam</span>
                <Check className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
