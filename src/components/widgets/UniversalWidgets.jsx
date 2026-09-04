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
      className="mausam-card-interactive rounded-3xl p-3.5 sm:p-4 border border-white/[0.08] cursor-pointer relative h-full flex flex-col justify-between"
    >
      <div className="flex items-center justify-between gap-1 mb-1">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center text-cyan-400 flex-shrink-0">
            <CloudRain className="w-3 h-3" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">Rain Probability</span>
        </div>
        <WidgetHeaderActions widgetId="rain_probability" />
      </div>

      <div className="my-auto py-1">
        <div className="text-2xl sm:text-3xl font-extrabold text-[#F1F5F9] tracking-tight">
          {pop}%
        </div>
        <div className="text-[10.5px] text-slate-400 mt-0.5 truncate">
          {pop > 60 ? 'Heavy precipitation' : pop > 30 ? 'Scattered rain' : 'Dry conditions'}
        </div>
      </div>

      <div className="w-full bg-white/[0.08] h-1.5 rounded-full overflow-hidden mt-1">
        <div 
          className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full" 
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

  return (
    <div 
      onClick={() => onSelect?.('uv_index')}
      className="mausam-card-interactive rounded-3xl p-3.5 sm:p-4 border border-white/[0.08] cursor-pointer relative h-full flex flex-col justify-between"
    >
      <div className="flex items-center justify-between gap-1 mb-1">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400 flex-shrink-0">
            <Sun className="w-3 h-3" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">UV Exposure</span>
        </div>
        <WidgetHeaderActions widgetId="uv_index" />
      </div>

      <div className="my-auto py-1">
        <div className="flex items-baseline gap-1.5">
          <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${uvColor}`}>{uv}</span>
          <span className="text-xs font-semibold text-slate-300 truncate">{uvCategory}</span>
        </div>
        <div className="text-[10.5px] text-slate-400 mt-0.5 truncate">
          {uv >= 6 ? 'Apply SPF 30+' : 'Sun exposure safe'}
        </div>
      </div>

      <div className="w-full bg-white/[0.08] h-1.5 rounded-full overflow-hidden mt-1">
        <div 
          className={`h-full rounded-full ${uv >= 8 ? 'bg-rose-400' : uv >= 6 ? 'bg-amber-400' : 'bg-emerald-400'}`}
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
      className="mausam-card-interactive rounded-3xl p-3.5 sm:p-4 border border-white/[0.08] cursor-pointer relative h-full flex flex-col justify-between"
    >
      <div className="flex items-center justify-between gap-1 mb-1">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <div className="w-6 h-6 rounded-lg bg-teal-500/15 border border-teal-500/25 flex items-center justify-center text-teal-400 flex-shrink-0">
            <Wind className="w-3 h-3" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">Wind Dynamics</span>
        </div>
        <WidgetHeaderActions widgetId="wind_metrics" />
      </div>

      <div className="my-auto py-1">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#F1F5F9] tracking-tight">{current.windSpeed}</span>
          <span className="text-xs text-slate-400 font-medium">km/h</span>
          <span className="text-[11px] font-bold text-teal-300 ml-1 truncate">Dir {current.windDirection}</span>
        </div>
        <div className="text-[10.5px] text-slate-400 mt-0.5 truncate">
          Gusts: {current.windGust || current.windSpeed + 12} km/h
        </div>
      </div>

      <div className="w-full bg-white/[0.08] h-1.5 rounded-full overflow-hidden mt-1">
        <div 
          className="h-full bg-teal-400 rounded-full" 
          style={{ width: `${Math.min(100, (current.windSpeed / 60) * 100)}%` }}
        />
      </div>
    </div>
  );
}

export function HumidityHeatWidget({ weatherData, onSelect }) {
  const current = weatherData.current;

  return (
    <div 
      onClick={() => onSelect?.('humidity_heat')}
      className="mausam-card-interactive rounded-3xl p-3.5 sm:p-4 border border-white/[0.08] cursor-pointer relative h-full flex flex-col justify-between"
    >
      <div className="flex items-center justify-between gap-1 mb-1">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center text-cyan-400 flex-shrink-0">
            <Droplets className="w-3 h-3" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">Humidity & Dew</span>
        </div>
        <WidgetHeaderActions widgetId="humidity_heat" />
      </div>

      <div className="my-auto py-1">
        <div className="text-2xl sm:text-3xl font-extrabold text-[#F1F5F9] tracking-tight">
          {current.humidity}%
        </div>
        <div className="text-[10.5px] text-slate-400 mt-0.5 truncate">
          Dew point: {current.dewPoint || 21}°C
        </div>
      </div>

      <div className="w-full bg-white/[0.08] h-1.5 rounded-full overflow-hidden mt-1">
        <div 
          className="h-full bg-cyan-400 rounded-full" 
          style={{ width: `${current.humidity}%` }}
        />
      </div>
    </div>
  );
}

export function SunriseSunsetWidget({ weatherData, onSelect }) {
  const current = weatherData.current;

  return (
    <div 
      onClick={() => onSelect?.('sunrise_sunset')}
      className="mausam-card-interactive rounded-3xl p-3.5 sm:p-4 border border-white/[0.08] cursor-pointer relative h-full flex flex-col justify-between"
    >
      <div className="flex items-center justify-between gap-1 mb-1">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <div className="w-6 h-6 rounded-lg bg-yellow-500/15 border border-yellow-500/25 flex items-center justify-center text-yellow-400 flex-shrink-0">
            <Sunrise className="w-3 h-3" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">Solar Cycle</span>
        </div>
        <WidgetHeaderActions widgetId="sunrise_sunset" />
      </div>

      <div className="grid grid-cols-2 gap-1.5 my-auto py-1">
        <div className="mausam-subcard py-1.5 px-1 rounded-xl text-center min-w-0">
          <span className="text-[8.5px] text-slate-400 uppercase font-semibold block truncate">Rise</span>
          <span className="text-[11px] font-bold text-slate-200 block truncate">{current.sunrise || "06:05 AM"}</span>
        </div>
        <div className="mausam-subcard py-1.5 px-1 rounded-xl text-center min-w-0">
          <span className="text-[8.5px] text-slate-400 uppercase font-semibold block truncate">Set</span>
          <span className="text-[11px] font-bold text-slate-200 block truncate">{current.sunset || "06:40 PM"}</span>
        </div>
      </div>

      <div className="text-[10.5px] text-slate-400 text-center truncate mt-0.5">
        Daylight: ~12.5 hrs
      </div>
    </div>
  );
}

export function VisibilityPressureWidget({ weatherData, onSelect }) {
  const current = weatherData.current;

  return (
    <div 
      onClick={() => onSelect?.('visibility_pressure')}
      className="mausam-card-interactive rounded-3xl p-3.5 sm:p-4 border border-white/[0.08] cursor-pointer relative h-full flex flex-col justify-between"
    >
      <div className="flex items-center justify-between gap-1 mb-1">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400 flex-shrink-0">
            <Gauge className="w-3 h-3" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">Atmosphere</span>
        </div>
        <WidgetHeaderActions widgetId="visibility_pressure" />
      </div>

      <div className="grid grid-cols-2 gap-1.5 my-auto py-1">
        <div className="mausam-subcard py-1.5 px-1 rounded-xl text-center min-w-0 flex flex-col items-center justify-center">
          <span className="text-[8.5px] text-slate-400 uppercase font-semibold tracking-tight block truncate w-full">
            Visibility
          </span>
          <span className="text-xs font-bold text-slate-200 mt-0.5 block truncate w-full">
            {current.visibility} <span className="text-[9px] font-normal text-slate-400">km</span>
          </span>
        </div>
        <div className="mausam-subcard py-1.5 px-1 rounded-xl text-center min-w-0 flex flex-col items-center justify-center">
          <span className="text-[8.5px] text-slate-400 uppercase font-semibold tracking-tight block truncate w-full">
            Pressure
          </span>
          <span className="text-xs font-bold text-slate-200 mt-0.5 block truncate w-full">
            {current.pressure} <span className="text-[9px] font-normal text-slate-400">hPa</span>
          </span>
        </div>
      </div>

      <div className="text-[10.5px] text-slate-400 text-center truncate mt-0.5">
        Stable barometric level
      </div>
    </div>
  );
}
