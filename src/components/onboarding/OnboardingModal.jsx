import React, { useState, useEffect } from 'react';
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
  RotateCcw,
  Navigation,
  Search,
  Loader2,
  AlertCircle,
  Globe2
} from 'lucide-react';
import { PERSONA_CATEGORIES } from '../../data/personaProfiles';
import { usePersonalization } from '../../context/PersonalizationContext';
import { useWeather } from '../../context/WeatherContext';
import { searchCitiesApi } from '../../services/liveWeatherService';

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
    completeOnboarding 
  } = usePersonalization();

  const { 
    allLocations, 
    changeLocation, 
    activeLocationId, 
    fetchCurrentGpsLocation, 
    fetchAndSelectCity, 
    isLoadingGps, 
    gpsError, 
    setGpsError 
  } = useWeather();

  const [step, setStep] = useState(1); // 1: Welcome, 2: Interests, 3: Live Preview & Region
  const [selectedLocId, setSelectedLocId] = useState(activeLocationId);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasPromptedGps, setHasPromptedGps] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedLocId(activeLocationId);
      setHasPromptedGps(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [isOpen, activeLocationId]);

  // Auto-prompt GPS when step 3 is reached
  useEffect(() => {
    if (step === 3 && !hasPromptedGps) {
      setHasPromptedGps(true);
      handleDetectGps();
    }
  }, [step, hasPromptedGps]);

  const handleDetectGps = async () => {
    try {
      const liveLoc = await fetchCurrentGpsLocation();
      if (liveLoc?.id) {
        setSelectedLocId(liveLoc.id);
      }
    } catch (e) {
      console.warn("GPS detection failed:", e);
    }
  };

  // Debounced geocoding search for any Indian city
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchCitiesApi(searchQuery);
        setSearchResults(results);
      } catch (e) {
        console.warn("City search failed:", e);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectSearchedCity = async (city) => {
    try {
      const liveLoc = await fetchAndSelectCity(city);
      if (liveLoc?.id) {
        setSelectedLocId(liveLoc.id);
        setSearchQuery('');
        setSearchResults([]);
      }
    } catch (e) {
      console.warn("Failed to fetch searched city weather:", e);
    }
  };

  if (!isOpen) return null;

  // Find selected persona objects for widget previews
  const selectedPersonaObjs = PERSONA_CATEGORIES.filter(p => activePersonas.includes(p.id));
  const liveLocation = allLocations.find(l => l.isLive || l.id?.startsWith('live_'));
  const otherLocations = allLocations.filter(l => l.id !== liveLocation?.id);

  const handleFinish = () => {
    if (selectedLocId) {
      changeLocation(selectedLocId);
    }
    completeOnboarding();
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark blur backdrop */}
      <div className="fixed inset-0 bg-black/85 backdrop-blur-xl animate-fade-in" />

      <div className="relative z-10 w-full max-w-md bg-[#111A2E]/95 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-6 shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        {/* Step Progress Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold tracking-wider text-cyan-400 uppercase">
              Step {step} of 3
            </span>
          </div>

          <div className="flex gap-1.5">
            {[1, 2, 3].map(s => (
              <div 
                key={s} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? 'w-6 bg-cyan-400 shadow-glow-cyan' : s < step ? 'w-3 bg-emerald-400' : 'w-2 bg-slate-700'
                }`} 
              />
            ))}
          </div>
        </div>

        {/* STEP 1: WELCOME */}
        {step === 1 && (
          <div className="space-y-4 my-auto text-center py-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 to-teal-500 flex items-center justify-center mx-auto shadow-glow-cyan">
              <Sparkles className="w-8 h-8 text-slate-950 animate-pulse" />
            </div>

            <div>
              <span className="text-[11px] font-bold text-cyan-400 tracking-wider uppercase">
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
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs tracking-wide shadow-glow-cyan transition active:scale-95 flex items-center justify-center gap-2"
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
                        ? 'bg-cyan-500/15 border-cyan-500/40 shadow-glow-cyan' 
                        : 'bg-[#1A2436]/70 border-white/[0.06] hover:bg-[#1A2436]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-cyan-400 text-slate-950' : 'bg-white/5 text-slate-300'}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-cyan-400 flex items-center justify-center text-slate-950">
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

            <div className="pt-3 flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="py-3 px-4 rounded-2xl bg-[#1A2436]/80 hover:bg-[#1A2436] border border-white/[0.08] text-slate-300 text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 px-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wide shadow-glow-cyan transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: LIVE PREVIEW & LOCATION */}
        {step === 3 && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-center">
            <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center gap-2 font-medium">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin-slow" />
              <span>Smart Dynamic Canvas Generated!</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Select Your Primary Region</h3>
              <p className="text-xs text-slate-400 mt-0.5">Where should we base your initial weather forecast?</p>
            </div>

            {/* 1. Live GPS Detection Card */}
            {isLoadingGps ? (
              <div className="w-full p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-3 animate-pulse text-left">
                <Loader2 className="w-5 h-5 text-cyan-400 animate-spin flex-shrink-0" />
                <div>
                  <div className="text-xs font-bold text-cyan-300">Detecting Your Live Location...</div>
                  <div className="text-[10px] text-slate-400">Please tap "Allow" when the browser requests location access.</div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (liveLocation) {
                    setSelectedLocId(liveLocation.id);
                  } else {
                    handleDetectGps();
                  }
                }}
                className={`w-full p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between group ${
                  selectedLocId === liveLocation?.id 
                    ? 'bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border-emerald-400/60 shadow-glow-cyan' 
                    : 'bg-[#1A2436]/80 hover:bg-[#1A2436] border-emerald-500/30'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                      <span>{liveLocation ? liveLocation.name : "Use My Live GPS Location"}</span>
                      <span className="text-[8px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded-full font-extrabold uppercase">
                        Live GPS
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {liveLocation 
                        ? `${liveLocation.district || liveLocation.state || 'Local Region'} • Real-Time Weather` 
                        : "Detects exact weather outside your window"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  {liveLocation ? (
                    <>
                      <span className="text-xs font-bold text-emerald-300">{liveLocation.current?.temp ?? liveLocation.temp ?? "--"}°C</span>
                      {selectedLocId === liveLocation.id && <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />}
                    </>
                  ) : (
                    <span className="px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 font-bold text-[10px] border border-cyan-500/30">
                      Detect
                    </span>
                  )}
                </div>
              </button>
            )}

            {/* GPS Error fallback alert */}
            {gpsError && (
              <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-[11px] text-amber-200 text-left flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div>{gpsError}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Tip: You can search any city or town below directly.</div>
                </div>
              </div>
            )}

            {/* 2. City Search Bar */}
            <div className="relative text-left">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Or search any Indian city (e.g. Pune, Patna, Lucknow)..."
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-[#1A2436]/70 border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 transition"
              />
              {isSearching && (
                <Loader2 className="w-3.5 h-3.5 text-cyan-400 absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin" />
              )}

              {searchResults.length > 0 && (
                <div className="absolute top-11 left-0 right-0 z-30 p-2 rounded-2xl bg-[#0e1628] border border-white/15 shadow-2xl backdrop-blur-2xl space-y-1 max-h-48 overflow-y-auto">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 px-2 py-0.5">
                    Select Your City:
                  </div>
                  {searchResults.map(city => (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => handleSelectSearchedCity(city)}
                      className="w-full p-2 rounded-xl hover:bg-cyan-500/20 text-left text-xs text-slate-200 hover:text-white flex items-center justify-between transition"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Globe2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span className="font-bold text-white truncate">{city.name}</span>
                        <span className="text-[10px] text-slate-400 truncate">{city.state || city.country}</span>
                      </div>
                      <span className="text-[9px] text-cyan-300 font-semibold bg-cyan-500/15 px-2 py-0.5 rounded-full flex-shrink-0 ml-1">
                        Select
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Available Meteorological Hubs */}
            {otherLocations.length > 0 && (
              <div className="space-y-1.5 text-left">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  Saved Meteorological Hubs:
                </div>
                {otherLocations.map(loc => {
                  const isSelected = selectedLocId === loc.id;
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => setSelectedLocId(loc.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl border text-xs transition-all ${
                        isSelected 
                          ? 'bg-cyan-500/15 border-cyan-500/40 text-white font-bold shadow-glow-cyan' 
                          : 'bg-[#1A2436]/70 border-white/[0.06] text-slate-300 hover:bg-[#1A2436]'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <MapPin className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                        <div className="truncate">
                          <div className="text-xs font-medium text-slate-200">{loc.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">{loc.district || loc.state || loc.type}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <span className="font-semibold">{loc.current?.temp ?? loc.temp ?? "--"}°C</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-[#1A2436]/70 border border-white/[0.06] text-left text-xs text-slate-300 space-y-1">
              <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                Prioritized Widgets Ready:
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedPersonaObjs.map(p => (
                  <span key={p.id} className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold">
                    {p.title}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-3.5 px-4 rounded-2xl bg-[#1A2436]/80 hover:bg-[#1A2436] border border-white/[0.08] text-slate-300 text-xs font-semibold"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs tracking-wide shadow-xl shadow-emerald-500/25 transition active:scale-95 flex items-center justify-center gap-2"
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
