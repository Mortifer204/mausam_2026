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
              className={`mausam-card-interactive rounded-3xl p-4 border cursor-pointer relative overflow-hidden transition-all ${
                isSelected 
                  ? 'border-cyan-400 bg-cyan-500/15 shadow-glow-cyan' 
                  : 'border-white/[0.08]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-bold text-white">{loc.name}</span>
                    {loc.isLive && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                        Live GPS
                      </span>
                    )}
                    {isSelected && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase tracking-wider">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{loc.state} • {loc.type}</div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-extrabold text-white">{loc.current?.temp ?? loc.temp ?? "--"}°C</span>
                  <div className="text-[11px] text-slate-300 font-medium">{loc.current?.condition ?? loc.condition ?? "Clear"}</div>
                </div>
              </div>

              {/* Sub metrics */}
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${(loc.current?.aqi || 50) > 150 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    AQI {loc.current?.aqi ?? 45}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300">Humidity {loc.current?.humidity ?? 60}%</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300">Wind {loc.current?.windSpeed ?? 10} km/h</span>
                </div>

                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                  {hasOrangeAlert && (
                    <span className="text-[10px] font-bold text-orange-400 bg-orange-500/15 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5" /> Alert
                    </span>
                  )}
                  <button
                    onClick={() => toggleSavedLocation(loc.id)}
                    className="p-1 rounded text-slate-400 hover:text-white transition"
                    title={isSaved ? "Remove from saved" : "Save location"}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'text-sky-400 fill-sky-400' : ''}`} />
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
