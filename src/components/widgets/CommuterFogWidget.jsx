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

  return (
    <div 
      onClick={() => onSelect?.('commuter_fog')}
      className={`glass-card-interactive rounded-3xl p-5 border border-white/10 cursor-pointer relative overflow-hidden group ${
        isHero ? 'bg-gradient-to-br from-[#121c2e]/90 to-[#0b1322]/95' : ''
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Commute & Road Safety
            </h4>
            <span className="text-[10px] text-slate-400">Visibility & Highway Monitor</span>
          </div>
        </div>

        <WidgetHeaderActions widgetId="commuter_fog" />
      </div>

      {/* Main Metric: Highway Visibility */}
      <div className="flex items-baseline justify-between my-2">
        <div>
          <span className={`text-4xl font-extrabold tracking-tight ${isLowVis ? 'text-amber-400' : 'text-blue-400'}`}>
            {vis}
          </span>
          <span className="text-xs text-slate-400 ml-1 font-medium">km Visibility</span>
        </div>

        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
          isLowVis ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
        }`}>
          {isLowVis ? 'Moderate Fog / Haze' : 'Clear Road Ahead'}
        </span>
      </div>

      {/* Commute Indicators */}
      <div className="grid grid-cols-2 gap-2 my-3 text-center">
        <div className="p-2 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Dense Fog Risk</span>
          <div className="text-xs font-bold text-slate-200 mt-0.5 flex items-center justify-center gap-1">
            <Eye className="w-3 h-3 text-blue-400" />
            {commute.fogRisk}
          </div>
        </div>

        <div className="p-2 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Underpass Flood Risk</span>
          <div className="text-xs font-bold text-slate-200 mt-0.5 flex items-center justify-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            {commute.flashFloodRisk}
          </div>
        </div>
      </div>

      {/* Peak Commute Advisory */}
      <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-slate-300 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <span className="text-[11px] leading-relaxed text-slate-200">{commute.peakWindowImpact}</span>
      </div>

      {/* Tap prompt */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-blue-400 transition">
        <span>Check route congestion & weather radar</span>
        <ExternalLink className="w-3 h-3" />
      </div>
    </div>
  );
}
