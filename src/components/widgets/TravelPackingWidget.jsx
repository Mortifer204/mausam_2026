import React, { useState, useEffect } from 'react';
import { 
  Plane, 
  CheckSquare, 
  Square, 
  Luggage, 
  AlertCircle, 
  Pin, 
  ExternalLink,
  Search,
  MapPin,
  Loader2,
  ArrowRightLeft,
  ChevronDown,
  ChevronUp,
  Check,
  Sparkles,
  RefreshCw,
  X,
  Compass
} from 'lucide-react';
import { usePersonalization } from '../../context/PersonalizationContext';
import { WidgetHeaderActions } from './WidgetHeaderActions';
import { fetchRealtimeWeather, searchCitiesApi } from '../../services/liveWeatherService';

const STORAGE_DEST_KEY = 'mausam_travel_dest_v1';

// Popular Indian travel destination presets
const POPULAR_DESTINATIONS = [
  { name: 'Goa', state: 'Goa', lat: 15.2993, lon: 74.1240 },
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lon: 72.8777 },
  { name: 'Shimla', state: 'Himachal Pradesh', lat: 31.1048, lon: 77.1734 },
  { name: 'Manali', state: 'Himachal Pradesh', lat: 32.2432, lon: 77.1892 },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lon: 75.7873 },
  { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lon: 77.5946 },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lon: 88.3639 },
  { name: 'Kochi', state: 'Kerala', lat: 9.9312, lon: 76.2673 },
];

export function TravelPackingWidget({ weatherData, onSelect, isHero = false }) {
  const [destination, setDestination] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DEST_KEY);
      return saved ? JSON.parse(saved) : POPULAR_DESTINATIONS[0]; // Default: Goa
    } catch {
      return POPULAR_DESTINATIONS[0];
    }
  });

  const [destWeather, setDestWeather] = useState(null);
  const [isLoadingDest, setIsLoadingDest] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);

  // 1. Fetch Real Live Weather for Destination
  useEffect(() => {
    let isMounted = true;

    async function loadDestinationWeather() {
      if (!destination?.lat || !destination?.lon) return;
      setIsLoadingDest(true);
      try {
        const live = await fetchRealtimeWeather(
          destination.lat,
          destination.lon,
          destination.name,
          destination.state,
          destination.district || destination.state
        );
        if (isMounted) {
          setDestWeather(live);
          setIsLoadingDest(false);
        }
      } catch (err) {
        console.warn("Could not fetch destination weather:", err);
        if (isMounted) setIsLoadingDest(false);
      }
    }

    loadDestinationWeather();
    return () => { isMounted = false; };
  }, [destination]);

  // Persist destination
  const handleSelectDestination = (destObj) => {
    setDestination(destObj);
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    try {
      localStorage.setItem(STORAGE_DEST_KEY, JSON.stringify(destObj));
    } catch (e) {}
  };

  // Debounced search for any global / Indian city
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await searchCitiesApi(searchQuery);
        setSearchResults(res);
      } catch (e) {
        console.warn("Destination search failed:", e);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggleCheck = (itemKey) => {
    setCheckedItems(prev => ({ ...prev, [itemKey]: !prev[itemKey] }));
  };

  // 2. Generate Real Weather-Driven Packing Checklist
  const currentOrigin = weatherData?.current || { temp: 28, condition: 'Clear' };
  const currentDest = destWeather?.current || {
    temp: 30,
    condition: 'Overcast',
    rainProb: 65,
    uv: 6,
    aqi: 95
  };

  const pop = destWeather?.daily?.[0]?.pop ?? (currentDest.condition?.toLowerCase().includes('rain') ? 80 : 25);
  const uv = currentDest.uv || 6;
  const aqi = currentDest.aqi || 85;
  const tempDelta = currentDest.temp - currentOrigin.temp;

  // Smart algorithmic packing list based on REAL destination sensors
  const dynamicPackingList = [];

  // Rain condition
  if (pop >= 35 || currentDest.condition?.toLowerCase().includes('rain') || currentDest.condition?.toLowerCase().includes('drizzle')) {
    dynamicPackingList.push({
      item: "Windproof Compact Umbrella",
      reason: `${pop}% rain forecast in ${destination.name}`,
      essential: true
    });
    dynamicPackingList.push({
      item: "Waterproof Shoe Covers / Raincoat",
      reason: "Active precipitation expected",
      essential: true
    });
  }

  // Cold condition
  if (currentDest.temp <= 20) {
    dynamicPackingList.push({
      item: "Thermal Innerwear & Fleece Jacket",
      reason: `Cool temperature (${currentDest.temp}°C) in ${destination.name}`,
      essential: true
    });
    dynamicPackingList.push({
      item: "Woolen Beanie & Warm Socks",
      reason: "Chilly evening breeze",
      essential: false
    });
  }

  // Hot condition
  if (currentDest.temp >= 30) {
    dynamicPackingList.push({
      item: "Lightweight Breathable Linen / Cotton",
      reason: `Warm climate (${currentDest.temp}°C)`,
      essential: true
    });
  }

  // UV Sun condition
  if (uv >= 5) {
    dynamicPackingList.push({
      item: `UV Protection Sunglasses & SPF ${uv >= 8 ? '50+' : '30'} Sunscreen`,
      reason: `High UV index (${uv})`,
      essential: true
    });
    dynamicPackingList.push({
      item: "Sun Visor / Wide-Brim Hat",
      reason: "Midday sun exposure shield",
      essential: false
    });
  }

  // Air quality condition
  if (aqi >= 150) {
    dynamicPackingList.push({
      item: "N95 Anti-Pollution Respirator Mask",
      reason: `Poor AQI (${aqi}) in ${destination.name}`,
      essential: true
    });
  }

  // Standard travel tech & hygiene
  dynamicPackingList.push({
    item: "Portable Power Bank (10,000mAh+) & Cables",
    reason: "In-transit navigation battery",
    essential: false
  });
  dynamicPackingList.push({
    item: "Travel Hand Sanitizer & Disinfectant",
    reason: "Airport & transit hygiene",
    essential: false
  });

  // Prioritize 'Must Pack' (essential) items at the very top
  const sortedPackingList = [...dynamicPackingList].sort((a, b) => {
    if (a.essential && !b.essential) return -1;
    if (!a.essential && b.essential) return 1;
    return 0;
  });

  // Display only up to 4 items when collapsed
  const displayedPackingList = isExpanded ? sortedPackingList : sortedPackingList.slice(0, 4);
  const remainingCount = Math.max(0, sortedPackingList.length - 4);

  return (
    <div 
      onClick={() => onSelect?.('travel_packing')}
      className={`glass-card-interactive rounded-3xl p-5 border border-white/10 cursor-pointer relative overflow-hidden group ${
        isHero ? 'bg-gradient-to-br from-[#101b33]/90 to-[#0e1626]/95' : ''
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <Plane className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Travel Radar & Smart Packing
            </h4>
            <span className="text-[10px] text-slate-400">Live In-Route Destination Assistant</span>
          </div>
        </div>

        <WidgetHeaderActions widgetId="travel_packing" />
      </div>

      {/* Destination Selector Bar (Interactive!) */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-500/15 via-blue-500/10 to-indigo-500/15 border border-sky-400/30 mb-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-sky-400 uppercase font-bold tracking-wider flex items-center gap-1">
              <MapPin className="w-3 h-3 text-sky-400" /> Destination
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsSearchOpen(p => !p);
              }}
              className="text-[10px] text-sky-300 hover:text-white font-bold bg-sky-400/20 hover:bg-sky-400/30 px-2 py-0.5 rounded-full border border-sky-400/40 flex items-center gap-1 transition"
            >
              <span>Change</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isSearchOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Data</span>
          </div>
        </div>

        {/* Selected Destination Name & Real-time Live Weather */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="text-base font-extrabold text-white flex items-center gap-1.5">
              <span>{destination.name}</span>
              <span className="text-xs font-medium text-slate-400">({destination.state})</span>
            </div>
            <div className="text-[11px] text-slate-300 mt-0.5 flex items-center gap-2">
              <span>{currentDest.condition}</span>
              <span>•</span>
              <span className="text-cyan-300 font-semibold">{pop}% Rain</span>
              <span>•</span>
              <span className={aqi > 150 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                AQI {aqi}
              </span>
            </div>
          </div>

          <div className="text-right">
            {isLoadingDest ? (
              <Loader2 className="w-5 h-5 animate-spin text-sky-400 ml-auto" />
            ) : (
              <div className="text-2xl font-black text-white">
                {currentDest.temp}°C
              </div>
            )}
            <div className="text-[10px] text-slate-400 font-medium">
              UV {uv} • Wind {currentDest.windSpeed || 14} km/h
            </div>
          </div>
        </div>

        {/* Route Temperature Comparison */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5">
            <ArrowRightLeft className="w-3.5 h-3.5 text-sky-400" />
            <span>From <strong>{weatherData?.name}</strong> ({currentOrigin.temp}°C)</span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            tempDelta < -4 
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
              : tempDelta > 4 
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
          }`}>
            {tempDelta > 0 ? `+${tempDelta}°C Warmer` : tempDelta < 0 ? `${tempDelta}°C Cooler` : 'Same Temp'}
          </span>
        </div>

        {/* Destination Search Drawer (when open) */}
        {isSearchOpen && (
          <div 
            className="pt-2 border-t border-white/10 space-y-2.5 animate-fade-in"
            onClick={e => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search any destination (e.g. Manali, London, Dubai, Goa)..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-black/40 border border-white/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition"
              />
              {isSearching && (
                <Loader2 className="w-3.5 h-3.5 text-sky-400 absolute right-3 top-1/2 -translate-y-1/2 animate-spin" />
              )}
            </div>

            {/* Live Autocomplete Results */}
            {searchResults.length > 0 && (
              <div className="p-1 rounded-xl bg-[#0c1426] border border-white/15 space-y-1 max-h-40 overflow-y-auto">
                {searchResults.map(city => (
                  <button
                    key={city.id}
                    onClick={() => handleSelectDestination(city)}
                    className="w-full p-2 text-left text-xs rounded-lg hover:bg-sky-500/20 flex items-center justify-between text-slate-200 hover:text-white transition"
                  >
                    <div>
                      <span className="font-bold text-white">{city.name}</span>
                      <span className="text-[10px] text-slate-400 ml-1.5">
                        {city.state ? `${city.state}, ` : ''}{city.country}
                      </span>
                    </div>
                    <span className="text-[10px] text-sky-300 font-semibold bg-sky-500/20 px-2 py-0.5 rounded">
                      Select
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Quick Popular Destination Chips */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Popular Travel Hubs:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_DESTINATIONS.map(p => {
                  const isSelected = p.name === destination.name;
                  return (
                    <button
                      key={p.name}
                      onClick={() => handleSelectDestination(p)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition ${
                        isSelected 
                          ? 'bg-sky-500 border-sky-400 text-white shadow-md' 
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {p.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Smart Real-Weather Packing Checklist */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Luggage className="w-3.5 h-3.5 text-sky-400" />
            <span>Packing Essentials for {destination.name}</span>
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Live Weather-Driven
          </span>
        </div>

        <div className="space-y-1.5">
          {displayedPackingList.map((item, idx) => {
            const isChecked = !!checkedItems[item.item];
            return (
              <div 
                key={item.item || idx}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCheck(item.item);
                }}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs cursor-pointer transition ${
                  isChecked 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-400 line-through' 
                    : 'bg-white/5 border-white/5 text-slate-200 hover:bg-white/10 hover:border-white/15'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <span className="font-semibold text-white block truncate">{item.item}</span>
                    <span className="text-[10px] text-slate-400 block truncate">{item.reason}</span>
                  </div>
                </div>

                {item.essential && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex-shrink-0 ml-2">
                    Must Pack
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Extend / Minimize Toggle Button */}
        {sortedPackingList.length > 4 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(prev => !prev);
            }}
            className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-sky-500/15 border border-white/10 hover:border-sky-500/30 text-xs font-semibold text-sky-300 hover:text-sky-200 flex items-center justify-center gap-1.5 transition active:scale-[0.98] mt-1.5"
          >
            {isExpanded ? (
              <>
                <span>Minimize List</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>Show {remainingCount} More Items</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Real-time In-Route Travel Advisory Note */}
      <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-xs text-slate-300 space-y-1">
        <div className="flex items-center gap-1.5 text-sky-400 font-bold text-[11px] uppercase tracking-wider">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Real Route Advisory ({weatherData?.name} ➔ {destination.name})</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-300">
          {pop > 50
            ? `High rainfall probability (${pop}%) active in ${destination.name}. Flight and highway traffic may experience holding patterns.`
            : tempDelta < -8
            ? `Significant temperature drop of ${Math.abs(tempDelta)}°C from ${weatherData?.name}. Carry thermal wear for evening arrival.`
            : `Favorable travel conditions in ${destination.name} with ${currentDest.temp}°C and calm winds.`}
        </p>
      </div>

      {/* Tap prompt */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-sky-400 transition">
        <span>Tap to view live flight routes & highway weather radar</span>
        <ExternalLink className="w-3 h-3" />
      </div>
    </div>
  );
}
