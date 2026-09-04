import React from 'react';
import { HeartPulse, Wind, ShieldAlert, Pin, ExternalLink } from 'lucide-react';
import { usePersonalization } from '../../context/PersonalizationContext';
import { WidgetHeaderActions } from './WidgetHeaderActions';

export function HealthAqiWidget({ weatherData, onSelect, isHero = false }) {
  const { pinnedWidgetIds, togglePinWidget } = usePersonalization();
  const isPinned = pinnedWidgetIds.includes('health_aqi');

  const health = weatherData.specialized?.health || {
    aqi: weatherData.current.aqi,
    category: weatherData.current.aqiStatus,
    pm25Value: weatherData.current.pm25,
    pm10Value: weatherData.current.pm10,
    pollenLevel: "Moderate",
    uvIndex: weatherData.current.uv,
    actionGuideline: "Air quality requires caution for sensitive individuals."
  };

  const aqi = health.aqi;
  const isBad = aqi > 150;
  const isMod = aqi > 100 && aqi <= 150;

  const aqiColor = isBad ? 'text-rose-400' : isMod ? 'text-amber-400' : 'text-emerald-400';
  const aqiBg = isBad ? 'bg-rose-500/20 border-rose-500/30' : isMod ? 'bg-amber-500/20 border-amber-500/30' : 'bg-emerald-500/20 border-emerald-500/30';

  return (
    <div 
      onClick={() => onSelect?.('health_aqi')}
      className={`glass-card-interactive rounded-3xl p-5 border border-white/10 cursor-pointer relative overflow-hidden group ${
        isHero ? 'bg-gradient-to-br from-[#121c33]/90 to-[#0d1629]/95' : ''
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <HeartPulse className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Air Quality & Respiratory
            </h4>
            <span className="text-[10px] text-slate-400">National AQI Index</span>
          </div>
        </div>

        <WidgetHeaderActions widgetId="health_aqi" />
      </div>

      {/* Main Metric Value */}
      <div className="flex items-baseline justify-between my-2">
        <div>
          <span className={`text-4xl font-extrabold tracking-tight ${aqiColor}`}>
            {aqi}
          </span>
          <span className="text-xs text-slate-400 ml-1.5 font-medium">AQI</span>
        </div>

        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${aqiBg} ${aqiColor}`}>
          {health.category}
        </span>
      </div>

      {/* Pollutant breakdown gauges */}
      <div className="grid grid-cols-2 gap-2 my-3">
        <div className="p-2 rounded-xl bg-white/5 border border-white/5">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">PM2.5 Level</div>
          <div className="text-xs font-bold text-slate-200 mt-0.5">
            {health.pm25Value} <span className="text-[10px] font-normal text-slate-400">µg/m³</span>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full ${health.pm25Value > 60 ? 'bg-rose-400' : 'bg-emerald-400'}`}
              style={{ width: `${Math.min(100, (health.pm25Value / 120) * 100)}%` }}
            />
          </div>
        </div>

        <div className="p-2 rounded-xl bg-white/5 border border-white/5">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">PM10 Level</div>
          <div className="text-xs font-bold text-slate-200 mt-0.5">
            {health.pm10Value} <span className="text-[10px] font-normal text-slate-400">µg/m³</span>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full ${health.pm10Value > 100 ? 'bg-amber-400' : 'bg-emerald-400'}`}
              style={{ width: `${Math.min(100, (health.pm10Value / 200) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Actionable Health Guideline */}
      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        <span className="text-[11px] leading-relaxed text-slate-200">{health.actionGuideline}</span>
      </div>

      {/* Drill-down prompt */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-emerald-400 transition">
        <span>Tap to inspect 24h pollutant curve</span>
        <ExternalLink className="w-3 h-3" />
      </div>
    </div>
  );
}
