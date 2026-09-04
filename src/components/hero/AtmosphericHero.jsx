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
import { WeatherAtmosphereCanvas } from './WeatherAtmosphereCanvas';

export function AtmosphericHero() {
  const { weatherData, lastRefreshedAt, isRefreshing } = useWeather();
  const { activePersonas } = usePersonalization();

  const current = weatherData.current;
  const theme = getThemeForCondition(current.conditionCode);

  // Pick suitable dynamic icon
  const renderWeatherIcon = () => {
    const condCode = (current.conditionCode || '').toLowerCase();
    const condName = (current.condition || '').toLowerCase();

    if (condCode.includes('thunder') || condName.includes('thunder')) {
      return <CloudLightning className="w-16 h-16 text-amber-400 animate-bounce drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />;
    }
    if (condCode.includes('rain') || condName.includes('rain') || condName.includes('drizzle')) {
      return <CloudRain className="w-16 h-16 text-cyan-400 animate-pulse drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />;
    }
    if (condCode === 'overcast' || condName.includes('overcast') || condCode.includes('cloud') || condName.includes('cloud')) {
      return <CloudSun className="w-16 h-16 text-[#F1F5F9] animate-float drop-shadow-[0_0_18px_rgba(241,245,249,0.5)]" />;
    }
    if (condCode.includes('sun') || condName.includes('sunny') || condCode === 'clear') {
      return <Sun className="w-16 h-16 text-amber-400 animate-spin-slow drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]" />;
    }
    return <CloudSun className="w-16 h-16 text-sky-400 animate-float drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]" />;
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
    <div className="relative w-full rounded-3xl p-4 sm:p-6 bg-white/[0.04] border border-white/[0.1] shadow-glass overflow-hidden mb-5 transition-all duration-500 min-h-[300px]">
      {/* Dynamic 3D WebGL Moving Atmosphere Canvas (Photorealistic flowing clouds, rain streaks, and sun rays) */}
      <WeatherAtmosphereCanvas 
        conditionCode={current.conditionCode} 
        temp={current.temp}
      />

      {/* Subtle bottom vignette so bottom text/chips remain crisp and readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/15 to-black/50 pointer-events-none" />

      {/* Ambient background glow orb */}
      <div 
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20 bg-cyan-500/20"
      />

      <div className="relative z-10">
        {/* Top: Persona Indicator Pill & Live Time */}
        <div className="flex items-center justify-between gap-2 mb-3 w-full">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] backdrop-blur-md border border-white/[0.08] text-[11px] font-semibold text-cyan-300 min-w-0 flex-1 mr-1 overflow-hidden">
            <Sparkles className="w-3 h-3 text-cyan-400 flex-shrink-0" />
            <span className="truncate">{personaTitles ? `Tailored for: ${personaTitles}` : "General"}</span>
          </div>

          <div className="text-[11px] text-slate-300 font-medium flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isRefreshing ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
            <span className="whitespace-nowrap font-sans">
              {isRefreshing 
                ? 'Syncing...' 
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
              <span className="text-7xl font-extrabold tracking-tighter text-[#F1F5F9] font-sans">
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
              <span className="flex items-center text-cyan-400">
                <ArrowDown className="w-3 h-3" /> {current.minTemp}°
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center pr-2">
            {renderWeatherIcon()}
          </div>
        </div>

        {/* Bottom Quick Metric Chips */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/[0.08] text-center">
          <div className="p-2.5 rounded-2xl mausam-subcard border border-white/[0.06]">
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Wind</div>
            <div className="text-xs font-bold text-slate-200 mt-0.5 flex items-center justify-center gap-1">
              <Wind className="w-3 h-3 text-cyan-400" />
              {current.windSpeed} km/h {current.windDirection}
            </div>
          </div>

          <div className="p-2.5 rounded-2xl mausam-subcard border border-white/[0.06]">
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Humidity</div>
            <div className="text-xs font-bold text-slate-200 mt-0.5 flex items-center justify-center gap-1">
              <Droplets className="w-3 h-3 text-teal-400" />
              {current.humidity}%
            </div>
          </div>

          <div className="p-2.5 rounded-2xl mausam-subcard border border-white/[0.06]">
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
