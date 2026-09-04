import React from 'react';
import { Flame, Clock, Droplet, Sun, Pin, ExternalLink } from 'lucide-react';
import { usePersonalization } from '../../context/PersonalizationContext';
import { WidgetHeaderActions } from './WidgetHeaderActions';

export function FitnessRunningWidget({ weatherData, onSelect, isHero = false }) {
  const { pinnedWidgetIds } = usePersonalization();
  const isPinned = pinnedWidgetIds.includes('fitness_running');

  const fitness = weatherData.specialized?.fitness || {
    runningScore: 85,
    status: "Good Conditions",
    bestWindow: "6:00 AM - 7:30 AM",
    heatIndex: 26,
    hydrationAdvice: "Drink 250ml water prior to training."
  };

  const score = fitness.runningScore;
  const isPrime = score >= 80;
  const isSub = score < 60;

  const scoreColor = isPrime ? 'text-amber-400' : isSub ? 'text-rose-400' : 'text-emerald-400';
  const badgeBg = isPrime ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-slate-500/20 text-slate-300 border-slate-500/30';

  return (
    <div 
      onClick={() => onSelect?.('fitness_running')}
      className={`glass-card-interactive rounded-3xl p-5 border border-white/10 cursor-pointer relative overflow-hidden group ${
        isHero ? 'bg-gradient-to-br from-[#1c1a14]/90 to-[#121626]/95' : ''
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Outdoor Fitness & Running
            </h4>
            <span className="text-[10px] text-slate-400">Workout Comfort Meter</span>
          </div>
        </div>

        <WidgetHeaderActions widgetId="fitness_running" />
      </div>

      {/* Main Score Display */}
      <div className="flex items-baseline justify-between my-2">
        <div>
          <span className={`text-4xl font-extrabold tracking-tight ${scoreColor}`}>
            {score}
          </span>
          <span className="text-xs text-slate-400 ml-1 font-medium">/ 100</span>
        </div>

        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badgeBg}`}>
          {fitness.status}
        </span>
      </div>

      {/* Best Running Windows */}
      <div className="my-3 p-2.5 rounded-2xl bg-white/5 border border-white/5 space-y-1.5">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Clock className="w-3 h-3 text-amber-400" />
          Optimal Workout Window:
        </div>
        <div className="text-xs font-semibold text-white">
          {fitness.bestWindow}
        </div>
      </div>

      {/* Mini metric indicators */}
      <div className="grid grid-cols-2 gap-2 my-2 text-center text-xs">
        <div className="p-2 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Feels Like</span>
          <div className="font-bold text-slate-200 mt-0.5">{weatherData.current.feelsLike}°C</div>
        </div>
        <div className="p-2 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">UV Index</span>
          <div className="font-bold text-slate-200 mt-0.5">{weatherData.current.uv} Moderate</div>
        </div>
      </div>

      {/* Hydration Guidance */}
      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-300 flex items-start gap-2">
        <Droplet className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <span className="text-[11px] leading-relaxed text-slate-200">{fitness.hydrationAdvice}</span>
      </div>

      {/* Tap prompt */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-amber-400 transition">
        <span>View hourly comfort curves</span>
        <ExternalLink className="w-3 h-3" />
      </div>
    </div>
  );
}
