import React from 'react';
import { 
  Flame, 
  Thermometer, 
  Wind, 
  Sun, 
  Droplet, 
  Clock, 
  Moon, 
  ExternalLink,
  TrendingUp
} from 'lucide-react';
import { usePersonalization } from '../../context/PersonalizationContext';
import { WidgetHeaderActions } from './WidgetHeaderActions';

export function FitnessRunningWidget({ weatherData, onSelect, isHero = false }) {
  const { pinnedWidgetIds } = usePersonalization();
  const isPinned = pinnedWidgetIds.includes('fitness_running');

  const fitness = weatherData?.specialized?.fitness || {
    runningScore: 72,
    status: "Moderate",
    bestWindow: "Early Morning: 05:30 – 07:30 AM",
    hydrationAdvice: "Hydrate with 300ml water per 45 min workout. Current feels like is 31°C."
  };

  const score = Math.round(fitness.runningScore || 72);
  const feelsLike = weatherData?.current?.feelsLike ?? 31;
  const uv = weatherData?.current?.uv ?? 8;
  const uvCategory = uv >= 8 ? 'Very High' : uv >= 6 ? 'High' : uv >= 3 ? 'Moderate' : 'Low';

  // Status computation for running score
  const isGood = score >= 75;
  const isModerate = score >= 50 && score < 75;
  const statusLabel = isGood ? 'EXCELLENT' : isModerate ? 'MODERATE' : 'SUBOPTIMAL';

  const scoreColor = isGood ? '#34D399' : isModerate ? '#2DD4BF' : '#F43F5E';
  const scoreBadgeBg = isGood 
    ? 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300' 
    : isModerate 
    ? 'bg-teal-500/15 border-teal-400/30 text-teal-300' 
    : 'bg-rose-500/15 border-rose-400/30 text-rose-300';

  // Arc gauge calculation:
  // Semi-circle from 180° to 360°. Radius = 64, Center = (100, 85).
  // Arc length = Math.PI * 64 ≈ 201.06
  const arcLength = 201.06;
  const progressRatio = Math.min(1, Math.max(0, score / 100));
  const strokeDashoffset = arcLength * (1 - progressRatio);

  return (
    <div 
      onClick={() => onSelect?.('fitness_running')}
      className="mausam-card-interactive p-5 cursor-pointer relative overflow-hidden group select-none transition-all duration-300"
    >
      {/* 1. Header Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Beveled Golden-Teal Flame Badge matching reference */}
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400/25 via-teal-500/15 to-emerald-900/30 border border-teal-400/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.20)] flex items-center justify-center text-amber-300 relative flex-shrink-0">
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400/30 stroke-[2.2]" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Outdoor Fitness & Running
            </h4>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide">WORKOUT COMFORT METER</span>
          </div>
        </div>

        <WidgetHeaderActions widgetId="fitness_running" />
      </div>

      {/* 2. Sleek Workout Quality Score Card (Left: Text & Score, Right: Mini Arc Gauge matching reference) */}
      <div className="mausam-subcard p-3.5 sm:p-4 rounded-2xl border border-white/[0.07] my-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
            Workout Quality Score
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className={`text-3xl sm:text-4xl font-black tracking-tight ${
              isGood ? 'text-emerald-400' : isModerate ? 'text-teal-300' : 'text-rose-400'
            }`}>
              {score}
            </span>
            <span className="text-xs text-slate-400 font-bold">/ 100</span>
          </div>
          <span className={`text-[11px] font-semibold mt-0.5 block ${
            isGood ? 'text-emerald-300' : isModerate ? 'text-teal-300' : 'text-rose-300'
          }`}>
            {isGood 
              ? 'Optimal Running Conditions' 
              : isModerate 
              ? 'Moderate Workout Quality' 
              : 'Suboptimal Running Climate'}
          </span>
        </div>

        {/* Mini Arc Gauge on the Right (smooth round bar) */}
        <div className="relative w-24 h-14 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 100 55" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="fitnessMiniGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="40%" stopColor="#F59E0B" />
                <stop offset="70%" stopColor="#14B8A6" />
                <stop offset="100%" stopColor="#22C55E" />
              </linearGradient>
            </defs>

            {/* Inactive Track */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="rgba(255, 255, 255, 0.10)"
              strokeWidth="8"
              strokeLinecap="round"
            />

            {/* Active Colored Arc */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="url(#fitnessMiniGaugeGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="125.66"
              strokeDashoffset={125.66 * (1 - Math.min(1, Math.max(0, score / 100)))}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
        </div>
      </div>

      {/* 3. Top Row: Quick Metrics (Feels Like & UV Index side by side) */}
      <div className="grid grid-cols-2 gap-2.5 my-3 auto-rows-fr">
        {/* Feels Like Pill */}
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-300 flex-shrink-0">
            <div className="flex items-center gap-0.5">
              <Thermometer className="w-3.5 h-3.5 text-slate-300" />
              <Wind className="w-3 h-3 text-cyan-400" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block truncate">
              FEELS LIKE
            </span>
            <span className="text-sm font-extrabold text-white mt-0.5 block truncate">
              {feelsLike}°C
            </span>
          </div>
        </div>

        {/* UV Index Pill with Stepped Signal Bars */}
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col items-center justify-center text-amber-400 flex-shrink-0">
            <Sun className="w-4 h-4 stroke-[2.2]" />
            <span className="text-[8px] font-extrabold leading-none -mt-0.5 text-amber-300">{uv}</span>
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block truncate">
              UV INDEX
            </span>
            <div className="flex items-center justify-between gap-1 mt-0.5">
              <span className="text-xs font-extrabold text-white whitespace-nowrap">
                {uv} {uvCategory}
              </span>
              {/* Stepped signal bar chart */}
              <div className="flex items-end gap-0.5 h-3 flex-shrink-0">
                {[1, 2, 3, 4, 5].map(barIdx => (
                  <span 
                    key={barIdx} 
                    className={`w-0.5 sm:w-1 rounded-full ${barIdx <= Math.ceil(uv / 2.2) ? 'bg-amber-400' : 'bg-slate-700/60'}`}
                    style={{ height: `${barIdx * 2.4}px` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Full-Width Stacked Cards: Workout Window & Hydration Guide */}
      <div className="space-y-2.5 mb-3">
        {/* Optimal Workout Window Pill (Wide Full-Width) */}
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.07] w-full">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-indigo-300 flex-shrink-0">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300">
              OPTIMAL WORKOUT WINDOW
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate-200">
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/[0.02] border border-white/[0.05] min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-slate-400 block text-[9px] uppercase font-semibold">Morning Slot</span>
                <strong className="text-white font-bold text-[10.5px] whitespace-nowrap tracking-tight block">05:30–07:30 AM</strong>
              </div>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/[0.02] border border-white/[0.05] min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-slate-400 block text-[9px] uppercase font-semibold">Evening Slot</span>
                <span className="text-white font-bold text-[10.5px] whitespace-nowrap tracking-tight flex items-center gap-1">
                  Post-Sunset <Moon className="w-3 h-3 text-indigo-300 inline" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Hydration Guide Pill (Wide Full-Width) */}
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.07] w-full relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              HYDRATION GUIDE
            </span>
            <div className="w-6 h-6 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Droplet className="w-3.5 h-3.5 fill-amber-400/40" />
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            <strong className="text-amber-300 font-bold">Hydrate</strong> with <strong className="text-white font-bold">300ml water</strong> per 45 min workout. Current feels like is <strong className="text-white font-bold">{feelsLike}°C</strong>.
          </p>
        </div>
      </div>

      {/* 4. Footer Link */}
      <div className="flex items-center justify-between text-xs text-slate-400 group-hover:text-teal-300 transition pt-1">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-teal-400" />
          <span>View hourly comfort curves</span>
        </div>
        <ExternalLink className="w-4 h-4 text-teal-400" />
      </div>
    </div>
  );
}
