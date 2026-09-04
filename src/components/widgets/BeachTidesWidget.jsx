import React from 'react';
import { Waves, Wind, Compass, AlertCircle, Pin, ExternalLink, MapPin, Anchor } from 'lucide-react';
import { usePersonalization } from '../../context/PersonalizationContext';
import { WidgetHeaderActions } from './WidgetHeaderActions';

export function BeachTidesWidget({ weatherData = {}, onSelect, isHero = false }) {
  const beach = weatherData?.specialized?.beach || {
    hasCoastline: false,
    waveHeightMeters: null,
    tideStatus: "Inland - No Marine Tides",
    nextLowTide: "0 km Coastline",
    surfQuality: "Landlocked",
    ripCurrentRisk: "N/A"
  };

  const isCoastal = !!beach.hasCoastline;

  return (
    <div 
      onClick={() => onSelect?.('beach_tides')}
      className={`glass-card-interactive rounded-3xl p-5 border border-white/10 cursor-pointer relative overflow-hidden group ${
        isHero ? 'bg-gradient-to-br from-[#0c2233]/90 to-[#091522]/95' : ''
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            {isCoastal ? <Waves className="w-4 h-4" /> : <Anchor className="w-4 h-4" />}
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Coastal Tides & Surf
            </h4>
            <span className="text-[10px] text-slate-400">
              {isCoastal ? "Live Marine Satellite Telemetry" : "Marine Coastline Detector"}
            </span>
          </div>
        </div>

        <WidgetHeaderActions widgetId="beach_tides" />
      </div>

      {isCoastal ? (
        /* 1. Real Coastal View (for cities on the sea like Mumbai, Goa, Chennai, Puri) */
        <>
          <div className="flex items-baseline justify-between my-2">
            <div>
              <span className="text-4xl font-extrabold tracking-tight text-cyan-400">
                {beach.waveHeightMeters}
              </span>
              <span className="text-xs text-slate-400 ml-1 font-medium">m Real Wave Height</span>
            </div>

            <span className="text-xs font-bold px-2.5 py-1 rounded-full border bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
              {beach.surfQuality}
            </span>
          </div>

          {/* Tide & Wave Period Box */}
          <div className="my-3 p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-1">
            <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center justify-between">
              <span>Open-Meteo Marine Buoy</span>
              {beach.wavePeriod && <span>Wave Period: {beach.wavePeriod}s</span>}
            </div>
            <div className="text-xs font-bold text-white">
              {beach.tideStatus}
            </div>
            <div className="text-[11px] text-slate-300">
              {beach.nextLowTide}
            </div>
          </div>

          {/* Metric Indicators */}
          <div className="grid grid-cols-2 gap-2 my-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Sea Water Temp</span>
              <div className="font-bold text-slate-200 mt-0.5">{beach.waterTempC ?? 28}°C</div>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Rip Current Risk</span>
              <div className="font-bold text-slate-200 mt-0.5">{beach.ripCurrentRisk}</div>
            </div>
          </div>
        </>
      ) : (
        /* 2. Inland View (for landlocked cities like Bhagalpur, Patna, Delhi, Jaipur) */
        <div className="my-2 p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 text-center">
          <div className="w-9 h-9 rounded-2xl bg-cyan-500/15 border border-cyan-500/25 text-cyan-400 flex items-center justify-center mx-auto">
            <Compass className="w-4 h-4" />
          </div>

          <div>
            <div className="text-xs font-bold text-white flex items-center justify-center gap-1.5">
              <span>Inland Landlocked Location</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-slate-300 font-semibold">
                No Sea Coast
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              <strong>{weatherData?.name}</strong> is situated in an inland riverine basin (Ganga River valley) with <strong>0 km oceanic coastline</strong>. 
            </p>
          </div>

          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-300 text-left flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <span className="leading-snug">
              Marine surf and oceanic tidal charts apply only to coastal stations (e.g. Mumbai, Goa, Puri). Real marine sensors activate automatically when a coastal hub is selected.
            </span>
          </div>
        </div>
      )}

      {/* Tap prompt */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-cyan-400 transition">
        <span>{isCoastal ? "View 24h marine swell & bathymetry" : "Tap to explore coastal ports & marine radar"}</span>
        <ExternalLink className="w-3 h-3" />
      </div>
    </div>
  );
}
