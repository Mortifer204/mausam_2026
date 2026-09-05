import React, { useState, useEffect } from 'react';
import { 
  Bookmark, 
  MapPin, 
  Search, 
  Trash2, 
  Check, 
  Plus, 
  ArrowUpRight, 
  AlertTriangle,
  Navigation,
  Loader2,
  Sparkles,
  Globe2
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { usePersonalization } from '../context/PersonalizationContext';
import { searchCitiesApi } from '../services/liveWeatherService';
import { Weather3DIcon } from '../components/common/Weather3DIcon';

export function SavedLocationsScreen({ onSelectLocation }) {
  const { 
    allLocations, 
    activeLocationId, 
    changeLocation,
    fetchCurrentGpsLocation,
    fetchAndSelectCity,
    isLoadingGps,
    gpsError
  } = useWeather();
  const { savedLocationIds, toggleSavedLocation } = usePersonalization();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced live geocoding search
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
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectSearchedCity = async (cityObj) => {
    try {
      await fetchAndSelectCity(cityObj);
      setSearchQuery('');
      setSearchResults([]);
      onSelectLocation?.();
    } catch (err) {
      alert("Could not fetch weather for this city. Please try again.");
    }
  };

  const handleUseGps = async () => {
    await fetchCurrentGpsLocation();
    onSelectLocation?.();
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 pb-24 pt-2 space-y-4">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Weather Hubs & Real-Time Search</h2>
        <p className="text-xs text-slate-400">Search any Indian city or tap for instant live GPS detection</p>
      </div>

      {/* 1. Live GPS Quick-Action Card */}
      <button
        onClick={handleUseGps}
        disabled={isLoadingGps}
        className="w-full p-4 rounded-3xl bg-gradient-to-r from-emerald-600/20 via-sky-600/20 to-blue-600/20 border border-emerald-500/30 hover:border-emerald-400/50 transition-all text-left flex items-center justify-between group shadow-lg"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
            {isLoadingGps ? (
              <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
            ) : (
              <Navigation className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{isLoadingGps ? "Detecting Live Coordinates..." : "Use Current GPS Location"}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-extrabold uppercase border border-emerald-500/30">
                Live Real-Time
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Fetches real temperature, AQI & rain outside your window
            </div>
          </div>
        </div>
        <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </button>

      {gpsError && (
        <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{gpsError}</span>
        </div>
      )}

      {/* 2. Live Global & Indian City Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search any Indian city (e.g. Patna, Jaipur, Lucknow, Kochi)..."
          className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 transition"
        />
        {isSearching && (
          <Loader2 className="w-4 h-4 text-cyan-400 absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin" />
        )}

        {/* Live Search Suggestions Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute top-12 left-0 right-0 z-30 p-2.5 rounded-3xl bg-[#111A2E]/95 border border-white/[0.08] shadow-2xl backdrop-blur-2xl space-y-1 animate-fade-in">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
              Live City Results (Tap to Fetch Real Weather):
            </div>
            {searchResults.map(city => (
              <button
                key={city.id}
                onClick={() => handleSelectSearchedCity(city)}
                className="w-full p-2.5 rounded-xl hover:bg-cyan-500/20 text-left text-xs text-slate-200 hover:text-white flex items-center justify-between transition border border-transparent hover:border-cyan-500/30"
              >
                <div className="flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="font-bold text-white">{city.name}</span>
                    <span className="text-[10px] text-slate-400 ml-1.5">
                      {city.state ? `${city.state}, ` : ''}{city.country}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-cyan-300 font-semibold bg-cyan-500/15 px-2 py-0.5 rounded-full">
                  Fetch Live
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Available Locations List */}
      <div className="space-y-3 pt-1">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
          Active Regional Hubs ({allLocations.length})
        </div>

        {allLocations.map(loc => {
          const isSelected = loc.id === activeLocationId;
          const isSaved = savedLocationIds.includes(loc.id);
          const hasOrangeAlert = loc.alerts?.some(a => a.level === 'orange' || a.level === 'red');

          return (
            <div
              key={loc.id}
              onClick={() => {
                changeLocation(loc.id);
                onSelectLocation?.();
              }}
              className={`group relative overflow-hidden rounded-[26px] p-4 transition-all duration-300 cursor-pointer backdrop-blur-2xl ${
                isSelected 
                  ? 'weather-card-glass-active' 
                  : 'weather-card-glass'
              }`}
            >
              {/* Subtle ambient light highlight inside card */}
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/[0.03] rounded-full blur-2xl pointer-events-none" />

              {/* Main Top Section: 3D Weather Illustration + Location Details + Glassy Gradient Temperature */}
              <div className="flex items-center gap-3 relative z-10">
                {/* Left: 3D Weather Illustration */}
                <div className="shrink-0 flex items-center justify-center -ml-1">
                  <Weather3DIcon
                    conditionCode={loc.current?.conditionCode || ''}
                    condition={loc.current?.condition || loc.condition || ''}
                    className="w-14 h-14 sm:w-16 sm:h-16 group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                  />
                </div>

                {/* Center: Info Column */}
                <div className="flex-1 min-w-0">
                  {/* Title & Badges */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-base font-bold text-white tracking-tight truncate">
                      {loc.name}
                    </span>
                    {loc.isLive && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider shrink-0">
                        Live GPS
                      </span>
                    )}
                    {isSelected && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase tracking-wider shrink-0">
                        Active
                      </span>
                    )}
                  </div>

                  {/* Subtitle: State & Hub Type */}
                  <div className="text-xs text-slate-400 font-medium truncate mt-0.5">
                    {loc.state} • {loc.type}
                  </div>

                  {/* Condition & Wind Preview matching reference layout */}
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-300 font-medium">
                    <span className="truncate">{loc.current?.condition ?? loc.condition ?? "Clear"}</span>
                    <span className="text-slate-600 shrink-0">•</span>
                    <span className="text-slate-400 flex items-center gap-1 shrink-0 font-sans">
                      <span className="text-[10px] text-cyan-400">➤</span> {loc.current?.windSpeed ?? 10} km/h
                    </span>
                  </div>
                </div>

                {/* Right: Glassy Liquid Metallic Gradient Temperature */}
                <div className="text-right shrink-0 select-none pl-1">
                  <div className="text-4xl sm:text-5xl font-normal tracking-tight text-glass-gradient leading-none">
                    {loc.current?.temp ?? loc.temp ?? "--"}°
                  </div>
                  <div className="text-[10px] font-semibold text-slate-400/80 uppercase tracking-wider mt-1 text-right">
                    {loc.current?.condition ?? loc.condition ?? "Clear"}
                  </div>
                </div>
              </div>

              {/* Frosted Divider & Full Detail Sub-Metrics */}
              <div className="mt-3 pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-[11px] relative z-10">
                {/* Metrics: AQI, Humidity, Wind */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-bold px-1.5 py-0.5 rounded-md ${
                    (loc.current?.aqi ?? 45) > 150 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    AQI {loc.current?.aqi ?? 45}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-300">Humidity {loc.current?.humidity ?? 60}%</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-300">Wind {loc.current?.windSpeed ?? 10} km/h</span>
                </div>

                {/* Actions: Alert & Bookmark */}
                <div className="flex items-center gap-2 shrink-0 ml-2" onClick={e => e.stopPropagation()}>
                  {hasOrangeAlert && (
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5 text-amber-400" /> Alert
                    </span>
                  )}
                  <button
                    onClick={() => toggleSavedLocation(loc.id)}
                    className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] text-slate-400 hover:text-white transition active:scale-95"
                    title={isSaved ? "Remove from saved" : "Save location"}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'text-cyan-400 fill-cyan-400' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
