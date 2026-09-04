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
    <header className="sticky top-0 z-30 w-full px-4 pt-4 pb-2 bg-[#0B111E]/90 backdrop-blur-xl border-b border-white/[0.06] transition-all duration-300">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* Left: 4-Dot Grid Menu Icon matching UI specification */}
        <button
          onClick={onOpenPersonaModal}
          className="w-10 h-10 rounded-2xl bg-[#131B2E] hover:bg-[#1A233B] border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white transition active:scale-95 shadow-sm"
          title="Open Customization & Personas"
        >
          <div className="grid grid-cols-2 gap-1 w-4 h-4 place-items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-white" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-white" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-white" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-white" />
          </div>
        </button>

        {/* Center: Location Pill Selector */}
        <div className="relative flex-1 flex justify-center">
          <button
            onClick={() => setIsLocationDropdownOpen(prev => !prev)}
            className="flex flex-col items-center justify-center text-center group focus:outline-none px-3 py-1 rounded-2xl hover:bg-[#131B2E]/60 transition"
            title="Switch Location"
          >
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-300 fill-slate-400/20" />
              <span className="font-bold text-sm tracking-tight text-white group-hover:text-accent-cyan transition truncate max-w-[150px]">
                {weatherData?.name || "Locating..."}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isLocationDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
            <span className="text-[10px] text-slate-400/90 font-medium">
              {isRefreshing ? 'Updating...' : weatherData?.isLive ? 'Live Real-Time' : weatherData?.district || 'Verified'}
            </span>
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
                              <span className="text-xs font-semibold">{loc.current.temp}°C</span>
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

        {/* Right: Quick Refresh & More Options (...) */}
        <div className="flex items-center gap-1.5">
          {/* Refresh Button */}
          <button
            onClick={refreshWeather}
            disabled={isRefreshing}
            className="w-10 h-10 rounded-2xl bg-[#131B2E] hover:bg-[#1A233B] border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white transition active:scale-95 shadow-sm"
            title="Refresh Meteorological Feeds"
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-accent-cyan' : ''}`} />
          </button>

          {/* More Options / 3-dots Menu Button */}
          <button
            onClick={onOpenPersonaModal}
            className="w-10 h-10 rounded-2xl bg-[#131B2E] hover:bg-[#1A233B] border border-white/[0.08] flex flex-col items-center justify-center gap-0.5 text-slate-300 hover:text-white transition active:scale-95 shadow-sm"
            title="Configure Dashboard"
          >
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="w-1 h-1 rounded-full bg-slate-300" />
          </button>
        </div>
      </div>
    </header>
  );
}
