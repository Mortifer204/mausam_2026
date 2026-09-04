import React from 'react';
import { Sprout, Droplets, ThermometerSnowflake, ShieldCheck, Pin, ExternalLink } from 'lucide-react';
import { usePersonalization } from '../../context/PersonalizationContext';
import { WidgetHeaderActions } from './WidgetHeaderActions';

export function FarmingAgroWidget({ weatherData, onSelect, isHero = false }) {
  const { pinnedWidgetIds, togglePinWidget } = usePersonalization();
  const isPinned = pinnedWidgetIds.includes('farming_agro');

  const farm = weatherData.specialized?.farming || {
    soilMoisture: 64,
    soilTemp: 22,
    evapotranspiration: 3.8,
    frostRisk: "Low Risk",
    cropAdvisory: "Maintain balanced irrigation schedule.",
    sprayCondition: "Favorable"
  };

  const isMoistureOptimal = farm.soilMoisture >= 55 && farm.soilMoisture <= 75;

  return (
    <div 
      onClick={() => onSelect?.('farming_agro')}
      className={`glass-card-interactive rounded-3xl p-5 border border-white/10 cursor-pointer relative overflow-hidden group ${
        isHero ? 'bg-gradient-to-br from-[#112217]/90 to-[#0e1924]/95' : ''
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30">
            <Sprout className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              IMD Agromet & Soil Status
            </h4>
            <span className="text-[10px] text-slate-400">Agricultural Guidance Hub</span>
          </div>
        </div>

        <WidgetHeaderActions widgetId="farming_agro" />
      </div>

      {/* Main Metric: Soil Moisture */}
      <div className="flex items-baseline justify-between my-2">
        <div>
          <span className="text-4xl font-extrabold tracking-tight text-green-400">
            {farm.soilMoisture}%
          </span>
          <span className="text-xs text-slate-400 ml-1.5 font-medium">Soil Moisture</span>
        </div>

        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
          isMoistureOptimal 
            ? 'bg-green-500/20 text-green-300 border-green-500/30' 
            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
        }`}>
          {isMoistureOptimal ? 'Optimal Root Saturation' : 'Irrigation Required'}
        </span>
      </div>

      {/* Moisture Progress Bar */}
      <div className="w-full bg-slate-800 h-2 rounded-full my-2 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
          style={{ width: `${farm.soilMoisture}%` }}
        />
      </div>

      {/* Agromet Indicators Grid */}
      <div className="grid grid-cols-3 gap-2 my-3 text-center">
        <div className="p-2 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[9px] text-slate-400 uppercase font-semibold">Evapotranspiration</span>
          <div className="text-xs font-bold text-slate-200 mt-0.5">{farm.evapotranspiration} <span className="text-[9px] font-normal">mm/d</span></div>
        </div>

        <div className="p-2 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[9px] text-slate-400 uppercase font-semibold">Frost Risk</span>
          <div className="text-xs font-bold text-slate-200 mt-0.5 flex items-center justify-center gap-1">
            <ThermometerSnowflake className="w-3 h-3 text-sky-400" />
            {farm.frostRisk}
          </div>
        </div>

        <div className="p-2 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[9px] text-slate-400 uppercase font-semibold">Foliar Spray</span>
          <div className="text-xs font-bold text-emerald-400 mt-0.5">{farm.sprayCondition}</div>
        </div>
      </div>

      {/* Official Crop Advisory */}
      <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-xs text-slate-300 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
        <span className="text-[11px] leading-relaxed text-slate-200">{farm.cropAdvisory}</span>
      </div>

      {/* Tap prompt */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-green-400 transition">
        <span>View 7-day soil evaporation & rainfall forecast</span>
        <ExternalLink className="w-3 h-3" />
      </div>
    </div>
  );
}
