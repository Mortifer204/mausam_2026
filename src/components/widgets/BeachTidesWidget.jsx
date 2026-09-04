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
      className="mausam-card-interactive rounded-3xl p-5 border border-white/[0.08] cursor-pointer relative overflow-hidden group"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-2xl bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
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
        /* 1. Real Coastal View matching Specification screen */
        <>
          {/* Tide Harmonic Sine Wave Chart */}
          <div className="mausam-subcard p-3 rounded-2xl border border-white/[0.06] mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tide Harmonic Chart</span>
              <div className="flex items-center gap-1.5 text-[9px]">
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">High</span>
                <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-400 font-medium">Low</span>
              </div>
            </div>

            {/* Glowing Sine Wave SVG */}
            <div className="relative w-full h-20">
              <svg viewBox="0 0 280 80" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="tideWaveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Gradient Fill under wave */}
                <path
                  d="M 0 50 Q 35 15, 70 50 T 140 50 T 210 50 T 280 50 L 280 80 L 0 80 Z"
                  fill="url(#tideWaveGrad)"
                />
                {/* Glowing Wave Stroke */}
                <path
                  d="M 0 50 Q 35 15, 70 50 T 140 50 T 210 50 T 280 50"
                  fill="none"
                  stroke="#06B6D4"
                  strokeWidth="2.5"
                  className="drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                />
                {/* Peak High Marker */}
                <circle cx="70" cy="28" r="3.5" fill="#2DD4BF" className="animate-pulse" />
                <rect x="52" y="10" width="36" height="14" rx="4" fill="rgba(6, 182, 212, 0.25)" stroke="#06B6D4" strokeWidth="0.8" />
                <text x="70" y="20" fill="#E2E8F0" fontSize="8" fontWeight="bold" textAnchor="middle">High</text>
                
                {/* Low Trough Marker */}
                <circle cx="210" cy="50" r="3" fill="#94A3B8" />
                <text x="210" y="66" fill="#94A3B8" fontSize="8" fontWeight="bold" textAnchor="middle">Low</text>
              </svg>
            </div>

            <div className="flex justify-between text-[9px] text-slate-400 font-medium px-1 mt-1">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>

          {/* Wave Height & Swell Quality Pill */}
          <div className="mausam-subcard p-3 rounded-2xl border border-white/[0.06] mb-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Wave Height</div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-extrabold text-[#F1F5F9]">{beach.waveHeightMeters || 1.2}</span>
                <span className="text-xs text-slate-400 font-medium">meters</span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-full border bg-cyan-500/15 text-cyan-300 border-cyan-500/30">
              {beach.surfQuality || "Moderate Swell"}
            </span>
          </div>

          {/* Metric Indicators */}
          <div className="grid grid-cols-2 gap-2 my-2 text-center text-xs">
            <div className="mausam-subcard p-2.5 rounded-xl border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Sea Water Temp</span>
              <div className="font-bold text-slate-200 mt-0.5">{beach.waterTempC ?? 28}°C</div>
            </div>
            <div className="mausam-subcard p-2.5 rounded-xl border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Rip Current Risk</span>
              <div className="font-bold text-slate-200 mt-0.5">{beach.ripCurrentRisk}</div>
            </div>
          </div>
        </>
      ) : (
        /* 2. Inland View (for landlocked locations) */
        <div className="my-2 p-3.5 rounded-2xl mausam-subcard border border-white/[0.08] space-y-2.5 text-center">
          <div className="w-9 h-9 rounded-2xl bg-cyan-500/15 border border-cyan-500/25 text-cyan-400 flex items-center justify-center mx-auto">
            <Compass className="w-4 h-4" />
          </div>

          <div>
            <div className="text-xs font-bold text-white flex items-center justify-center gap-1.5">
              <span>Inland Landlocked Location</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-300 font-semibold border border-white/[0.08]">
                No Coastline
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              <strong>{weatherData?.name}</strong> is situated in an inland geography with <strong>0 km oceanic coastline</strong>. 
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-300 text-left flex items-start gap-2">
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
