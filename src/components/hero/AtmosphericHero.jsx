import React from 'react';
import { 
  CloudSun, 
  CloudRain, 
  CloudLightning, 
  Sun, 
  Wind, 
  Droplets, 
  Sparkles,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { usePersonalization } from '../../context/PersonalizationContext';
import { getThemeForCondition } from '../../utils/weatherThemes';
import { PERSONA_CATEGORIES } from '../../data/personaProfiles';

export function AtmosphericHero() {
  const { weatherData, lastRefreshedAt, isRefreshing } = useWeather();
  const { activePersonas } = usePersonalization();

  const current = weatherData.current;
  const theme = getThemeForCondition(current.conditionCode);

  // Pick suitable dynamic icon
  const renderWeatherIcon = () => {
    switch (current.conditionCode) {
      case 'thunder':
        return <CloudLightning className="w-16 h-16 text-amber-400 animate-bounce" />;
      case 'rain':
        return <CloudRain className="w-16 h-16 text-cyan-400 animate-pulse" />;
      case 'sunny':
        return <Sun className="w-16 h-16 text-amber-400 animate-spin-slow" />;
      case 'pleasant':
      case 'clear':
      default:
        return <CloudSun className="w-16 h-16 text-sky-400 animate-float" />;
    }
  };

  // Generate personalized highlight tagline
  const getPersonalizedTagline = () => {
    if (activePersonas.includes('farming')) {
      return weatherData.specialized?.farming?.cropAdvisory || current.tagline;
    }
    if (activePersonas.includes('fitness')) {
      return weatherData.specialized?.fitness?.bestWindow 
        ? `Best Running Window: ${weatherData.specialized.fitness.bestWindow}. Run Score: ${weatherData.specialized.fitness.runningScore}/100.` 
        : current.tagline;
    }
    if (activePersonas.includes('travel')) {
      return weatherData.specialized?.travel?.advisory || current.tagline;
    }
    if (activePersonas.includes('health')) {
      return weatherData.specialized?.health?.actionGuideline || current.tagline;
    }
    if (activePersonas.includes('beach')) {
      return weatherData.specialized?.beach?.tideStatus 
        ? `Coastal Alert: ${weatherData.specialized.beach.tideStatus}. Wave Swell: ${weatherData.specialized.beach.waveHeightMeters}m.` 
        : current.tagline;
    }
    return current.tagline;
  };

  const personaTitles = PERSONA_CATEGORIES
    .filter(p => activePersonas.includes(p.id))
    .map(p => p.title)
    .join(' + ');

  return (
    <div className={`relative w-full rounded-3xl p-6 bg-gradient-to-b ${theme.gradient} border border-white/15 shadow-2xl overflow-hidden mb-5 transition-all duration-500`}>
      {/* Ambient background glow orb */}
      <div 
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-40"
        style={{ backgroundColor: theme.accentGlow }}
      />

      <div className="relative z-10">
        {/* Top: Persona Indicator Pill */}
        <div className="flex items-center justify-between mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-sky-300">
            <Sparkles className="w-3 h-3 text-sky-400" />
            <span className="truncate max-w-[200px]">Tailored for: {personaTitles || "General"}</span>
          </div>

          <div className="text-[11px] text-slate-300 font-medium flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
            <span>
              {isRefreshing 
                ? 'Syncing Live Data...' 
                : lastRefreshedAt 
                ? `Live • ${new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }).format(lastRefreshedAt)}` 
                : current.updatedAgo}
            </span>
          </div>
        </div>

        {/* Center: Main Temperature & Weather Icon */}
        <div className="flex items-center justify-between my-2">
          <div>
            <div className="flex items-baseline">
              <span className="text-7xl font-extrabold tracking-tighter text-white font-sans">
                {current.temp}
              </span>
              <span className="text-4xl font-light text-slate-400 ml-1">°C</span>
            </div>
            
            <div className="text-base font-semibold text-slate-200 mt-1 flex items-center gap-2">
              <span>{current.condition}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span>Feels like <strong className="text-slate-200">{current.feelsLike}°C</strong></span>
              <span className="flex items-center text-emerald-400">
                <ArrowUp className="w-3 h-3" /> {current.maxTemp}°
              </span>
              <span className="flex items-center text-sky-400">
                <ArrowDown className="w-3 h-3" /> {current.minTemp}°
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center pr-2">
            {renderWeatherIcon()}
          </div>
        </div>

        {/* Dynamic AI Weather Assistant Insight Card */}
        <div className="mt-4 p-3 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10 flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
              Personalized Mausam Assistant
            </div>
            <p className="text-xs text-slate-200 font-medium leading-relaxed mt-0.5">
              {getPersonalizedTagline()}
            </p>
          </div>
        </div>

        {/* Bottom Quick Metric Chips */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10 text-center">
          <div className="p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Wind</div>
            <div className="text-xs font-bold text-slate-200 mt-0.5 flex items-center justify-center gap-1">
              <Wind className="w-3 h-3 text-sky-400" />
              {current.windSpeed} km/h {current.windDirection}
            </div>
          </div>

          <div className="p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Humidity</div>
            <div className="text-xs font-bold text-slate-200 mt-0.5 flex items-center justify-center gap-1">
              <Droplets className="w-3 h-3 text-cyan-400" />
              {current.humidity}%
            </div>
          </div>

          <div className="p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="text-[10px] uppercase tracking-wider text-slate-400">AQI Level</div>
            <div className={`text-xs font-bold mt-0.5 ${
              current.aqi > 150 ? 'text-rose-400' : current.aqi > 100 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {current.aqi} • {current.aqiStatus}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
