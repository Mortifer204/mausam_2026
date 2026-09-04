import React from 'react';
import { Droplet, Compass, ExternalLink } from 'lucide-react';
import { usePersonalization } from '../../context/PersonalizationContext';
import { WidgetHeaderActions } from './WidgetHeaderActions';

export function FitnessRunningWidget({ weatherData, onSelect, isHero = false }) {
  const { pinnedWidgetIds } = usePersonalization();
  const isPinned = pinnedWidgetIds.includes('fitness_running');

  const fitness = weatherData?.specialized?.fitness || {
    runningScore: 90,
    status: "Prime Conditions",
    bestWindow: "6:00 AM - 7:30 AM",
    hydrationAdvice: "Hydration guidance: Drink 250ml water prior to training to optimize cardio performance."
  };

  const uv = weatherData?.current?.uv || 2;
  const windSpeed = weatherData?.current?.windSpeed || 7;

  return (
    <div 
      onClick={() => onSelect?.('fitness_running')}
      className="mausam-card-interactive p-5 cursor-pointer relative overflow-hidden group select-none transition-all duration-300"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
            Outdoor Fitness / Running
          </h4>
          <span className="text-[10px] text-slate-400">Workout Comfort & Trail Safety</span>
        </div>

        <WidgetHeaderActions widgetId="fitness_running" />
      </div>

      {/* 1. Dual Half-Arc Gauges (Running Index & UV Index) */}
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        {/* Left Gauge: Running Index (9/10) */}
        <div className="mausam-subcard p-3 flex flex-col items-center justify-between text-center relative">
          <span className="text-[11px] font-bold text-slate-300">Running Index</span>

          <div className="relative w-28 h-16 my-1 flex items-center justify-center">
            <svg viewBox="0 0 120 65" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="runningArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00B0FF" />
                  <stop offset="100%" stopColor="#00E5FF" />
                </linearGradient>
              </defs>

              {/* Background Arc */}
              <path
                d="M 15 55 A 45 45 0 0 1 105 55"
                fill="none"
                stroke="#1B263F"
                strokeWidth="10"
                strokeLinecap="round"
              />

              {/* Active Cyan Arc (90% score) */}
              <path
                d="M 15 55 A 45 45 0 0 1 97 25"
                fill="none"
                stroke="url(#runningArcGrad)"
                strokeWidth="10"
                strokeLinecap="round"
                className="filter drop-shadow-[0_0_6px_rgba(0,229,255,0.6)]"
              />

              <text x="14" y="64" fill="#64748B" fontSize="8" fontWeight="bold">0</text>
              <text x="96" y="64" fill="#64748B" fontSize="8" fontWeight="bold">100</text>
            </svg>

            {/* Readout */}
            <div className="absolute bottom-0 text-center">
              <span className="text-base font-black text-white">9/10</span>
            </div>
          </div>
        </div>

        {/* Right Gauge: UV / Wind Index */}
        <div className="mausam-subcard p-3 flex flex-col items-center justify-between text-center relative">
          <span className="text-[11px] font-bold text-slate-300">UV Index</span>

          <div className="relative w-28 h-16 my-1 flex items-center justify-center">
            <svg viewBox="0 0 120 65" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="uvArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00E676" />
                  <stop offset="50%" stopColor="#FFD600" />
                  <stop offset="100%" stopColor="#FF3D00" />
                </linearGradient>
              </defs>

              {/* Background Arc */}
              <path
                d="M 15 55 A 45 45 0 0 1 105 55"
                fill="none"
                stroke="#1B263F"
                strokeWidth="10"
                strokeLinecap="round"
              />

              {/* Arc */}
              <path
                d="M 15 55 A 45 45 0 0 1 105 55"
                fill="none"
                stroke="url(#uvArcGrad)"
                strokeWidth="10"
                strokeLinecap="round"
              />

              {/* Indicator needle for UV index */}
              <g transform="rotate(35, 60, 55)">
                <line x1="60" y1="55" x2="60" y2="20" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                <circle cx="60" cy="55" r="3" fill="#FFFFFF" />
              </g>

              <text x="14" y="64" fill="#64748B" fontSize="8" fontWeight="bold">0</text>
              <text x="96" y="64" fill="#64748B" fontSize="8" fontWeight="bold">100</text>
            </svg>

            {/* Readout */}
            <div className="absolute bottom-0 text-center">
              <span className="text-xs font-black text-white">{windSpeed} km/h</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Hydration Advice Card */}
      <div className="mausam-subcard p-3 mb-3 flex items-start gap-3 bg-[#162035]">
        <div className="w-8 h-8 rounded-xl bg-accent-cyan/15 border border-accent-cyan/30 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Droplet className="w-4 h-4 text-accent-cyan fill-accent-cyan/30" />
        </div>
        <div className="flex-1">
          <div className="text-[11px] font-bold text-white">Hydration Advice</div>
          <p className="text-xs text-slate-300 leading-relaxed font-normal mt-0.5">
            {fitness.hydrationAdvice}
          </p>
        </div>
      </div>

      {/* 3. Map Trail Visual Widget */}
      <div className="mausam-subcard p-3 relative overflow-hidden bg-[#111A2D]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-300">Map Trail</span>
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-slate-300">
            <Compass className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Trail SVG Graphic Canvas */}
        <div className="relative h-20 w-full rounded-xl bg-[#0F1626] border border-white/[0.04] overflow-hidden flex items-center justify-center">
          {/* Subtle Topographic Contours in background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg viewBox="0 0 200 80" className="w-full h-full">
              <polygon points="120,20 150,50 110,65" fill="#1E2A47" />
              <circle cx="40" cy="50" r="30" fill="none" stroke="#253556" strokeWidth="1" />
              <circle cx="160" cy="30" r="40" fill="none" stroke="#253556" strokeWidth="1" />
            </svg>
          </div>

          {/* Glowing Winding Trail Path */}
          <svg viewBox="0 0 240 70" className="w-full h-full relative z-10 overflow-visible">
            <defs>
              <filter id="trailGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Glowing trail */}
            <path
              d="M 20 58 Q 50 55, 75 35 T 130 45 T 180 25 T 225 15"
              fill="none"
              stroke="#00E5FF"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#trailGlow)"
            />

            {/* Waypoint Nodes */}
            <circle cx="20" cy="58" r="4" fill="#00E676" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="75" cy="35" r="3" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="1" />
            <circle cx="130" cy="45" r="3" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="1" />
            <circle cx="180" cy="25" r="3" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="1" />
            <circle cx="225" cy="15" r="4" fill="#FFD600" stroke="#FFFFFF" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      {/* Drill-down prompt */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-accent-cyan transition">
        <span>View pace forecasts & recommended routes</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </div>
    </div>
  );
}
