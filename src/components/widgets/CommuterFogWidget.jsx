import React from 'react';
import { Car, Eye, AlertTriangle, ExternalLink } from 'lucide-react';
import { usePersonalization } from '../../context/PersonalizationContext';
import { WidgetHeaderActions } from './WidgetHeaderActions';

export function CommuterFogWidget({ weatherData, onSelect, isHero = false }) {
  const { pinnedWidgetIds } = usePersonalization();
  const isPinned = pinnedWidgetIds.includes('commuter_fog');

  const commute = weatherData.specialized?.commuter || {
    fogRisk: "Low",
    highwayVisibilityKm: weatherData.current.visibility,
    flashFloodRisk: "Low",
    peakWindowImpact: "Normal traffic flow."
  };

  const vis = commute.highwayVisibilityKm;
  const isLowVis = vis < 5;

  const safetyScore = isLowVis ? 6 : 9;
  const safetyAngle = (safetyScore / 10) * 180;

  return (
    <div 
      onClick={() => onSelect?.('commuter_fog')}
      className="mausam-card-interactive rounded-3xl p-5 border border-white/[0.08] cursor-pointer relative overflow-hidden group"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-2xl bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Commute & Safety
            </h4>
            <span className="text-[10px] text-slate-400">Visibility & Transit Monitor</span>
          </div>
        </div>

        <WidgetHeaderActions widgetId="commuter_fog" />
      </div>

      {/* Main Metric: Highway Visibility */}
      <div className="flex items-baseline justify-between my-2">
        <div>
          <span className={`text-4xl font-extrabold tracking-tight ${isLowVis ? 'text-amber-400' : 'text-[#F1F5F9]'}`}>
            {vis}
          </span>
          <span className="text-xs text-slate-400 ml-1 font-medium">km Visibility</span>
        </div>

        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
          isLowVis ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
        }`}>
          {isLowVis ? 'Reduced Visibility' : 'Clear Road Ahead'}
        </span>
      </div>

      {/* Safety Index Gauge Card matching Specification */}
      <div className="mausam-subcard p-3 rounded-2xl border border-white/[0.06] my-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Safety Index</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-extrabold text-emerald-400">{safetyScore}</span>
            <span className="text-xs text-slate-400 font-medium">/ 10</span>
          </div>
          <span className="text-[10px] text-emerald-300 font-medium">Optimal Transit Window</span>
        </div>

        {/* Mini Arc Gauge */}
        <div className="relative w-20 h-12 flex items-center justify-center">
          <svg viewBox="0 0 100 55" className="w-full h-full">
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="url(#commuteGaugeGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="125.6"
              strokeDashoffset={125.6 * (1 - safetyScore / 10)}
            />
            <defs>
              <linearGradient id="commuteGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#22C55E" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Commute Indicators */}
      <div className="grid grid-cols-2 gap-2 my-2 text-center">
        <div className="mausam-subcard p-2.5 rounded-xl border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Dense Fog Risk</span>
          <div className="text-xs font-bold text-slate-200 mt-0.5 flex items-center justify-center gap-1">
            <Eye className="w-3 h-3 text-cyan-400" />
            {commute.fogRisk}
          </div>
        </div>

        <div className="mausam-subcard p-2.5 rounded-xl border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Underpass Flood</span>
          <div className="text-xs font-bold text-slate-200 mt-0.5 flex items-center justify-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            {commute.flashFloodRisk}
          </div>
        </div>
      </div>

      {/* Peak Commute Advisory */}
      <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-slate-300 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <span className="text-[11px] leading-relaxed text-slate-200">{commute.peakWindowImpact}</span>
      </div>

      {/* Tap prompt */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-cyan-400 transition">
        <span>Check route congestion & weather radar</span>
        <ExternalLink className="w-3 h-3" />
      </div>
    </div>
  );
}
