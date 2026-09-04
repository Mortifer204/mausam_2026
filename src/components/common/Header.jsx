import React, { useState } from 'react';
import { 
  MapPin, 
  RotateCw, 
  Sliders, 
  ChevronDown, 
  ShieldCheck, 
  Check, 
  Sparkles,
  Navigation,
  Loader2,
  AlertCircle,
  X
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { usePersonalization } from '../../context/PersonalizationContext';
import { PERSONA_CATEGORIES } from '../../data/personaProfiles';

export function Header({ onOpenPersonaModal, onOpenLocationModal }) {
  const { 
    weatherData, 
    allLocations, 
    activeLocationId, 
    changeLocation, 
    removeLocation,
    isRefreshing, 
    refreshWeather,
    fetchCurrentGpsLocation,
    isLoadingGps,
    gpsError
  } = useWeather();
  const { activePersonas, isCustomLifestyle } = usePersonalization();
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  const activePersonaObjs = PERSONA_CATEGORIES.filter(p => activePersonas.includes(p.id));

  return (
    <header className="sticky top-0 z-30 w-full px-4 pt-3 pb-2 backdrop-blur-xl bg-[#060a16]/80 border-b border-white/10 transition-all duration-300">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* Left: Location Selector */}
        <div className="relative">
          <button
            onClick={() => setIsLocationDropdownOpen(prev => !prev)}
            className="flex items-center gap-2 text-left group focus:outline-none"
            title="Switch Location"
          >
            <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition ${
              weatherData?.isLive 
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                : 'bg-sky-500/15 border-sky-500/30 text-sky-400 group-hover:bg-sky-500/25'
            }`}>
              {isLoadingGps ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              ) : weatherData?.isLive ? (
                <Navigation className="w-4 h-4 animate-pulse" />
              ) : (
                <MapPin className="w-4 h-4" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-white group-hover:text-sky-300 transition truncate max-w-[130px]">
                  {weatherData?.name || "Locating..."}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isLocationDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="truncate max-w-[100px]">{weatherData?.district || weatherData?.state || "India"}</span>
                <span className="w-1 h-1 rounded-full bg-slate-500"></span>
                <span className={`text-[10px] font-medium flex items-center gap-0.5 ${
                  weatherData?.isLive ? 'text-emerald-400 font-bold' : 'text-sky-400'
                }`}>
                  <ShieldCheck className="w-2.5 h-2.5" /> {weatherData?.isLive ? 'Live Real-Time' : 'IMD Verified'}
                </span>
              </div>
            </div>
          </button>

          {/* Quick Dropdown Menu */}
          {isLocationDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsLocationDropdownOpen(false)}
              />
              <div className="absolute top-11 left-0 z-50 w-72 p-2.5 rounded-2xl bg-[#0d1527] border border-white/15 shadow-2xl backdrop-blur-2xl animate-fade-in space-y-2">
                {/* 1. Live GPS Trigger Button */}
                <button
                  onClick={() => {
                    fetchCurrentGpsLocation();
                    setIsLocationDropdownOpen(false);
                  }}
                  disabled={isLoadingGps}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-sky-500/20 hover:from-emerald-500/30 hover:to-sky-500/30 border border-emerald-500/30 text-left text-xs font-bold text-emerald-300 flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-2">
                    {isLoadingGps ? (
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    ) : (
                      <Navigation className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    )}
                    <span>{isLoadingGps ? "Detecting GPS & Weather..." : "Use My Live GPS Location"}</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase">
                    Real-Time
                  </span>
                </button>

                {gpsError && (
                  <div className="p-2 rounded-lg bg-rose-500/15 border border-rose-500/30 text-[10px] text-rose-300 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>{gpsError}</span>
                  </div>
                )}

                {allLocations.length > 0 && (
                  <>
                    <div className="text-[10px] font-semibold text-slate-400 px-2 pt-1 uppercase tracking-wider">
                      Saved & Detected Locations:
                    </div>

                    <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
                      {allLocations.map(loc => {
                        const isSelected = loc.id === activeLocationId;
                        return (
                          <div
                            key={loc.id}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition group/loc ${
                              isSelected 
                                ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30' 
                                : 'text-slate-300 hover:bg-white/5 border border-transparent'
                            }`}
                          >
                            <button
                              onClick={() => {
                                changeLocation(loc.id);
                                setIsLocationDropdownOpen(false);
                              }}
                              className="flex-1 text-left min-w-0 mr-2"
                            >
                              <div className="text-white font-medium flex items-center gap-1.5 truncate">
                                <span>{loc.name}</span>
                                {loc.isLive && (
                                  <span className="text-[8px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1 rounded font-bold uppercase flex-shrink-0">
                                    Live
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate">{loc.district || loc.state}</div>
                            </button>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <span className="text-xs font-semibold">{loc.current?.temp ?? loc.temp ?? "--"}°C</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-sky-400" />}
                              {allLocations.length > 1 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeLocation(loc.id);
                                  }}
                                  className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/20 transition ml-0.5"
                                  title={`Remove ${loc.name}`}
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right: Personalization Tuner & Refresh */}
        <div className="flex items-center gap-2">
          {/* Active Persona Badges */}
          <button
            onClick={onOpenPersonaModal}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full border transition ${
              isCustomLifestyle 
                ? 'bg-amber-500/15 border-amber-400/40 text-amber-300 hover:border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                : 'bg-gradient-to-r from-sky-500/15 via-indigo-500/15 to-purple-500/15 border-sky-500/30 text-sky-300 hover:border-sky-400/50'
            }`}
            title="Adjust Personalization Priorities"
          >
            <Sparkles className={`w-3 h-3 ${isCustomLifestyle ? 'text-amber-400' : 'text-sky-400'} animate-pulse`} />
            <span className="text-[11px] font-semibold tracking-wide">
              {isCustomLifestyle 
                ? 'Custom' 
                : activePersonaObjs.length === 1 
                ? activePersonaObjs[0].title 
                : `${activePersonaObjs.length} Interests`}
            </span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={refreshWeather}
            disabled={isRefreshing}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition active:scale-95"
            title="Refresh Real-Time Weather"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
}
