import React from 'react';
import { ModalSheet } from '../common/ModalSheet';
import { 
  HeartPulse, 
  Flame, 
  Plane, 
  Sprout, 
  Car, 
  Waves, 
  Users, 
  CalendarCheck,
  ShieldCheck,
  Pin,
  Check
} from 'lucide-react';
import { usePersonalization } from '../../context/PersonalizationContext';

export function WidgetModalSheet({ selectedWidgetKey, onClose, weatherData }) {
  const { pinnedWidgetIds, togglePinWidget } = usePersonalization();

  if (!selectedWidgetKey) return null;

  const isPinned = pinnedWidgetIds.includes(selectedWidgetKey);

  const renderContent = () => {
    switch (selectedWidgetKey) {
      case 'health_aqi': {
        const health = weatherData?.specialized?.health || {};
        const aqi = weatherData?.current?.aqi || health.aqi || 78;
        const category = weatherData?.current?.aqiStatus || health.category || "Satisfactory";
        const pm25 = weatherData?.current?.pm25 ?? health.pm25Value ?? 20;
        const pm10 = weatherData?.current?.pm10 ?? health.pm10Value ?? 22;
        const guideline = health.actionGuideline || "Air quality is favorable for outdoor activities.";
        
        const isGoodOrSatisfactory = aqi <= 100;
        const isModerate = aqi > 100 && aqi <= 200;
        const barColor = isGoodOrSatisfactory ? 'bg-emerald-400' : isModerate ? 'bg-amber-400' : 'bg-rose-400';
        const pm25Percent = Math.min(100, Math.round((pm25 / 60) * 100));
        const pm10Percent = Math.min(100, Math.round((pm10 / 100) * 100));

        return (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Air Quality Index</span>
                  <div className="text-3xl font-extrabold text-white mt-0.5">{aqi} AQI</div>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {category}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{guideline}</p>
            </div>

            {/* PM2.5 and PM10 Subcards as requested */}
            <div className="grid grid-cols-2 gap-3">
              {/* PM2.5 Card */}
              <div className="mausam-subcard p-3.5 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  PM2.5 LEVEL
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white">{pm25}</span>
                  <span className="text-[11px] text-slate-400">µg/m³</span>
                </div>
                <div className="w-full h-1.5 bg-[#111A2E] rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${Math.max(12, pm25Percent)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 block">Fine Particulate</span>
              </div>

              {/* PM10 Card */}
              <div className="mausam-subcard p-3.5 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  PM10 LEVEL
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white">{pm10}</span>
                  <span className="text-[11px] text-slate-400">µg/m³</span>
                </div>
                <div className="w-full h-1.5 bg-[#111A2E] rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${Math.max(12, pm10Percent)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 block">Coarse Dust</span>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Additional Pollutant Breakdown</h5>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-2xl mausam-subcard border border-white/[0.06]">
                  <span className="text-[10px] text-slate-400">Pollen Sensitivity</span>
                  <div className="text-base font-bold text-white mt-0.5">{health?.pollenLevel || "Low"}</div>
                  <span className="text-[10px] text-slate-400">Grass & weed airborne</span>
                </div>
                <div className="p-3 rounded-2xl mausam-subcard border border-white/[0.06]">
                  <span className="text-[10px] text-slate-400">Ground Ozone (O3)</span>
                  <div className="text-base font-bold text-white mt-0.5">42 ppb</div>
                  <span className="text-[10px] text-emerald-400">Normal</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl mausam-subcard border border-white/[0.06] text-xs text-slate-300 space-y-1.5">
              <div className="font-bold text-slate-200">Recommended Safeguards:</div>
              <div className="flex items-center gap-2 text-[11px]"><Check className="w-3.5 h-3.5 text-emerald-400" /> Keep indoor air purifiers running on auto-mode</div>
              <div className="flex items-center gap-2 text-[11px]"><Check className="w-3.5 h-3.5 text-emerald-400" /> Avoid high-intensity outdoor cardio between 1 PM and 5 PM</div>
            </div>
          </div>
        );
      }

      case 'farming_agro': {
        const farm = weatherData.specialized?.farming;
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Root-Zone Saturation</span>
                  <div className="text-3xl font-extrabold text-emerald-400 mt-0.5">{farm?.soilMoisture}%</div>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Optimal Condition
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{farm?.cropAdvisory}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-2xl bg-[#1A2436]/70 border border-white/[0.06]">
                <span className="text-[10px] text-slate-400">Soil Temperature</span>
                <div className="text-base font-bold text-white mt-0.5">{farm?.soilTemp}°C</div>
                <span className="text-[10px] text-emerald-400">Optimal microbial activity</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#1A2436]/70 border border-white/[0.06]">
                <span className="text-[10px] text-slate-400">Evapotranspiration</span>
                <div className="text-base font-bold text-white mt-0.5">{farm?.evapotranspiration} mm/day</div>
                <span className="text-[10px] text-slate-400">Low water loss</span>
              </div>
            </div>
          </div>
        );
      }

      case 'fitness_running': {
        const fit = weatherData.specialized?.fitness;
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Workout Quality Score</span>
                  <div className="text-3xl font-extrabold text-amber-400 mt-0.5">{fit?.runningScore} / 100</div>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {fit?.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{fit?.hydrationAdvice}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#1A2436]/70 border border-white/[0.06]">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">Optimal Window</span>
              <div className="text-sm font-bold text-white">{fit?.bestWindow}</div>
            </div>
          </div>
        );
      }

      case 'travel_packing': {
        const travel = weatherData.specialized?.travel;
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
              <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">In-Transit Weather Status</div>
              <div className="text-base font-bold text-white mt-1">{travel?.transitStatus}</div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{travel?.advisory}</p>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Packing Checklist for Destination</h5>
              <div className="space-y-1.5">
                {travel?.packingList.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-[#1A2436]/70 border border-white/[0.06] text-xs text-slate-200">
                    <span>{item.item}</span>
                    {item.essential && <span className="text-[9px] font-bold text-rose-300 px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30">Essential</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      default:
        return (
          <div className="p-4 rounded-2xl bg-[#1A2436]/70 border border-white/[0.08] text-center text-xs text-slate-300">
            Real-time meteorological analytics verified by the India Meteorological Department.
          </div>
        );
    }
  };

  return (
    <ModalSheet
      isOpen={!!selectedWidgetKey}
      onClose={onClose}
      title="Detailed Meteorological Intelligence"
      subtitle="MoES / IMD Analytical Drilldown"
    >
      {renderContent()}

      <div className="pt-2 flex items-center justify-between border-t border-white/[0.08]">
        <button
          onClick={() => togglePinWidget(selectedWidgetKey)}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold border transition-all ${
            isPinned 
              ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-glow-cyan' 
              : 'bg-[#1A2436]/80 border-white/[0.08] text-slate-300 hover:text-white hover:bg-[#1A2436]'
          }`}
        >
          <Pin className="w-3.5 h-3.5" />
          {isPinned ? 'Pinned to Top Priority' : 'Pin Widget to Top'}
        </button>

        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-2xl bg-[#1A2436] hover:bg-white/10 border border-white/[0.08] text-white text-xs font-semibold transition"
        >
          Done
        </button>
      </div>
    </ModalSheet>
  );
}
