import React from 'react';
import { Droplet, Sprout, AlertTriangle, Clock, ExternalLink } from 'lucide-react';
import { usePersonalization } from '../../context/PersonalizationContext';
import { WidgetHeaderActions } from './WidgetHeaderActions';

export function FarmingAgroWidget({ weatherData, onSelect, isHero = false }) {
  const { pinnedWidgetIds } = usePersonalization();
  const isPinned = pinnedWidgetIds.includes('farming_agro');

  const farm = weatherData?.specialized?.farming || {
    soilMoisture: 68,
    evapotranspiration: 23.5,
    soilEvaporation: 1.0,
    cropRiskIndex: 23,
    unfavorableIndex: 48,
    cropAdvisory: "Favorable window for field irrigation. Maintain optimal schedule to prevent root saturation."
  };

  // Mock days data for soil moisture progress bars matching UI specification
  const moistureDays = [
    { day: 'Mon', value: 68, prev: 55 },
    { day: 'Tue', value: 78, prev: 60 },
    { day: 'Sat', value: 45, prev: 70 },
  ];

  return (
    <div 
      onClick={() => onSelect?.('farming_agro')}
      className="mausam-card-interactive p-5 cursor-pointer relative overflow-hidden group select-none transition-all duration-300"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
            Agriculture Advisor
          </h4>
          <span className="text-[10px] text-slate-400">IMD Agromet & Soil Status</span>
        </div>

        <WidgetHeaderActions widgetId="farming_agro" />
      </div>

      {/* 1. Soil Moisture Bar (Horizontal Gradient Multi-Bar Chart) */}
      <div className="mausam-subcard p-4 mb-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-white">Soil Moisture Bar</span>
          <span className="text-[10px] font-semibold text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-2 py-0.5 rounded-full">
            Optimal Range
          </span>
        </div>

        {/* Horizontal Stacked Bars */}
        <div className="space-y-2.5">
          {moistureDays.map((item) => (
            <div key={item.day} className="flex items-center gap-3">
              <span className="text-[11px] font-semibold text-slate-400 w-7">{item.day}</span>
              
              <div className="flex-1 relative h-3 bg-[#111A2E] rounded-full overflow-hidden">
                {/* Previous days baseline indicator */}
                <div 
                  className="absolute top-0 bottom-0 left-0 bg-slate-700/50 rounded-full"
                  style={{ width: `${item.prev}%` }}
                />
                {/* Current moisture active glowing cyan bar */}
                <div 
                  className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-teal-400 to-accent-cyan rounded-full shadow-[0_0_10px_rgba(0,229,255,0.4)]"
                  style={{ width: `${item.value}%` }}
                />
              </div>

              <span className="text-[11px] font-bold text-white w-8 text-right">{item.value}%</span>
            </div>
          ))}
        </div>

        {/* Scale Ticks */}
        <div className="flex justify-between pl-10 pr-11 text-[9px] text-slate-500 font-medium mt-2">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 pt-2.5 border-t border-white/[0.06] text-[10px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-cyan" />
            <span>Current</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-600" />
            <span>Previous days</span>
          </div>
        </div>
      </div>

      {/* 2. 2x2 Metric Cards Grid (Evapotranspiration, Crop Risk, etc.) */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {/* Metric 1 */}
        <div className="mausam-subcard p-3 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Droplet className="w-3.5 h-3.5 text-accent-cyan" />
            <span className="text-[10px] font-medium truncate">Evapotranspiration</span>
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl font-extrabold text-white">{farm.evapotranspiration}</span>
            <span className="text-[10px] text-slate-400">mm/h</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="mausam-subcard p-3 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Sprout className="w-3.5 h-3.5 text-accent-green" />
            <span className="text-[10px] font-medium truncate">Evapotranspiration</span>
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl font-extrabold text-white">{farm.soilEvaporation?.toFixed(2) || "1.00"}</span>
            <span className="text-[10px] text-slate-400">mm/h</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="mausam-subcard p-3 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-accent-yellow" />
            <span className="text-[10px] font-medium truncate">Crop Risk Index</span>
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl font-extrabold text-accent-yellow">{farm.cropRiskIndex}</span>
            <span className="text-[10px] text-emerald-400 font-semibold">Low</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="mausam-subcard p-3 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-medium truncate">Unfavourable index</span>
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl font-extrabold text-white">&lt;51%</span>
            <span className="text-[10px] text-accent-cyan font-semibold">Safe</span>
          </div>
        </div>
      </div>

      {/* 3. Advisory Callout Box matching UI specification */}
      <div className="mausam-subcard p-3 border-l-2 border-l-accent-cyan bg-[#151F34]">
        <div className="text-[11px] font-bold text-accent-cyan mb-0.5">Advice</div>
        <p className="text-xs text-slate-300 leading-relaxed font-normal">
          {farm.cropAdvisory}
        </p>
      </div>

      {/* Drill-down prompt */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-accent-cyan transition">
        <span>Tap to view 7-day soil moisture & foliar advisory</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </div>
    </div>
  );
}
