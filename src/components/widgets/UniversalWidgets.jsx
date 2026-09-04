import React from 'react';
import { 
  CloudRain, 
  Sun, 
  Wind, 
  Droplets, 
  Sunrise, 
  Sunset, 
  Eye, 
  Gauge
} from 'lucide-react';
import { usePersonalization } from '../../context/PersonalizationContext';
import { WidgetHeaderActions } from './WidgetHeaderActions';

export function RainProbabilityWidget({ weatherData, onSelect }) {
  const current = weatherData.current;
  const pop = weatherData.daily?.[0]?.pop || 30;

  return (
    <div 
      onClick={() => onSelect?.('rain_probability')}
      className="glass-card-interactive rounded-3xl p-3.5 border border-white/10 cursor-pointer relative overflow-hidden flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="p-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex-shrink-0">
            <CloudRain className="w-4 h-4" />
          </div>
          <WidgetHeaderActions widgetId="rain_probability" />
        </div>

        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate mb-1">
          Rain Probability
        </div>

        <div className="text-2xl font-extrabold text-white">
          {pop}%
        </div>
        <div className="text-[11px] text-slate-400 mt-0.5 leading-tight line-clamp-2">
          {pop > 60 ? 'Heavy precipitation expected' : pop > 30 ? 'Scattered rain possible' : 'Dry conditions likely'}
        </div>
      </div>

      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
        <div 
          className="h-full bg-cyan-400 rounded-full transition-all duration-500" 
          style={{ width: `${pop}%` }}
        />
      </div>
    </div>
  );
}

export function UvIndexWidget({ weatherData, onSelect }) {
  const uv = weatherData.current.uv;
  const uvCategory = uv >= 8 ? 'Very High' : uv >= 6 ? 'High' : uv >= 3 ? 'Moderate' : 'Low';
  const uvColor = uv >= 8 ? 'text-rose-400' : uv >= 6 ? 'text-amber-400' : 'text-emerald-400';
  const barBg = uv >= 8 ? 'bg-rose-400' : uv >= 6 ? 'bg-amber-400' : 'bg-emerald-400';

  return (
    <div 
      onClick={() => onSelect?.('uv_index')}
      className="glass-card-interactive rounded-3xl p-3.5 border border-white/10 cursor-pointer relative overflow-hidden flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex-shrink-0">
            <Sun className="w-4 h-4" />
          </div>
          <WidgetHeaderActions widgetId="uv_index" />
        </div>

        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate mb-1">
          UV Exposure
        </div>

        <div className="flex items-baseline gap-1.5">
          <span className={`text-2xl font-extrabold ${uvColor}`}>{uv}</span>
          <span className="text-xs font-semibold text-slate-300">{uvCategory}</span>
        </div>
        <div className="text-[11px] text-slate-400 mt-0.5 leading-tight line-clamp-2">
          {uv >= 6 ? 'Apply SPF 30+ outdoors' : 'Standard sun exposure safe'}
        </div>
      </div>

      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${barBg}`}
          style={{ width: `${Math.min(100, (uv / 11) * 100)}%` }}
        />
      </div>
    </div>
  );
}

export function WindMetricsWidget({ weatherData, onSelect }) {
  const current = weatherData.current;

  return (
    <div 
      onClick={() => onSelect?.('wind_metrics')}
      className="glass-card-interactive rounded-3xl p-3.5 border border-white/10 cursor-pointer relative overflow-hidden flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="p-1.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex-shrink-0">
            <Wind className="w-4 h-4" />
          </div>
          <WidgetHeaderActions widgetId="wind_metrics" />
        </div>

        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate mb-1">
          Wind Dynamics
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-extrabold text-white">{current.windSpeed}</span>
          <span className="text-xs text-slate-400 font-medium">km/h</span>
          <span className="text-xs font-bold text-teal-300 ml-1 truncate">{current.windDirection}</span>
        </div>
        <div className="text-[11px] text-slate-400 mt-0.5 leading-tight line-clamp-2">
          Gusts reaching {current.windGust || current.windSpeed + 12} km/h
        </div>
      </div>
    </div>
  );
}

export function HumidityHeatWidget({ weatherData, onSelect }) {
  const current = weatherData.current;

  return (
    <div 
      onClick={() => onSelect?.('humidity_heat')}
      className="glass-card-interactive rounded-3xl p-3.5 border border-white/10 cursor-pointer relative overflow-hidden flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="p-1.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex-shrink-0">
            <Droplets className="w-4 h-4" />
          </div>
          <WidgetHeaderActions widgetId="humidity_heat" />
        </div>

        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate mb-1">
          Humidity & Dew
        </div>

        <div className="text-2xl font-extrabold text-white">
          {current.humidity}%
        </div>
        <div className="text-[11px] text-slate-400 mt-0.5 leading-tight line-clamp-2">
          Dew point is {current.dewPoint || 21}°C right now
        </div>
      </div>
    </div>
  );
}

export function SunriseSunsetWidget({ weatherData, onSelect }) {
  const current = weatherData.current;

  return (
    <div 
      onClick={() => onSelect?.('sunrise_sunset')}
      className="glass-card-interactive rounded-3xl p-3.5 border border-white/10 cursor-pointer relative overflow-hidden flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 flex-shrink-0">
            <Sunrise className="w-4 h-4" />
          </div>
          <WidgetHeaderActions widgetId="sunrise_sunset" />
        </div>

        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate mb-1">
          Solar Cycle
        </div>

        <div className="grid grid-cols-2 gap-2 mt-1">
          <div>
            <span className="text-[10px] text-slate-400 block">Sunrise</span>
            <span className="text-xs font-bold text-slate-200">{current.sunrise || "06:05 AM"}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Sunset</span>
            <span className="text-xs font-bold text-slate-200">{current.sunset || "06:40 PM"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VisibilityPressureWidget({ weatherData, onSelect }) {
  const current = weatherData.current;

  return (
    <div 
      onClick={() => onSelect?.('visibility_pressure')}
      className="glass-card-interactive rounded-3xl p-3.5 border border-white/10 cursor-pointer relative overflow-hidden flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="p-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex-shrink-0">
            <Gauge className="w-4 h-4" />
          </div>
          <WidgetHeaderActions widgetId="visibility_pressure" />
        </div>

        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate mb-1">
          Atmosphere
        </div>

        <div className="grid grid-cols-2 gap-2 mt-1">
          <div>
            <span className="text-[10px] text-slate-400 block">Visibility</span>
            <span className="text-xs font-bold text-slate-200">{current.visibility} km</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Barometer</span>
            <span className="text-xs font-bold text-slate-200">{current.pressure} hPa</span>
          </div>
        </div>
      </div>
    </div>
  );
}
