import React from 'react';
import { CalendarCheck, AlertCircle, Wind, Pin, ExternalLink } from 'lucide-react';
import { usePersonalization } from '../../context/PersonalizationContext';
import { WidgetHeaderActions } from './WidgetHeaderActions';

export function EventForecastWidget({ weatherData, onSelect, isHero = false }) {
  const { pinnedWidgetIds, togglePinWidget } = usePersonalization();
  const isPinned = pinnedWidgetIds.includes('event_forecast');

  const events = weatherData.specialized?.events || {
    feasibilityScore: 78,
    rating: "Favorable Event Conditions",
    criticalWindow: "Evening Clear",
    recommendation: "Comfortable for outdoor seating."
  };

  const score = events.feasibilityScore;
  const isGood = score >= 75;

  return (
    <div 
      onClick={() => onSelect?.('event_forecast')}
      className="mausam-card-interactive rounded-3xl p-5 border border-white/[0.08] cursor-pointer relative overflow-hidden group"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-2xl bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
            <CalendarCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Outdoor Event Feasibility
            </h4>
            <span className="text-[10px] text-slate-400">Planners & Functions</span>
          </div>
        </div>

        <WidgetHeaderActions widgetId="event_forecast" />
      </div>

      {/* Score */}
      <div className="flex items-baseline justify-between my-2">
        <div>
          <span className="text-4xl font-extrabold tracking-tight text-white">
            {score}
          </span>
          <span className="text-xs text-slate-400 ml-1 font-medium">/ 100</span>
        </div>

        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
          isGood ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
        }`}>
          {events.rating}
        </span>
      </div>

      {/* Two Activity Feasibility Pills (Matching Specification: Picnic vs Concert) */}
      <div className="grid grid-cols-2 gap-2.5 my-3 text-center">
        <div className="mausam-subcard p-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex flex-col items-center justify-center gap-1">
          <span className="text-xl">👍</span>
          <span className="text-xs font-bold text-emerald-300">Picnic / Casual</span>
          <span className="text-[9px] text-slate-300">High Feasibility</span>
        </div>

        <div className="mausam-subcard p-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] flex flex-col items-center justify-center gap-1">
          <span className="text-xl">{score >= 80 ? '👍' : '⚠️'}</span>
          <span className="text-xs font-bold text-slate-200">Outdoor Concert</span>
          <span className="text-[9px] text-slate-400">{score >= 80 ? 'Safe Window' : 'Check Wind Gusts'}</span>
        </div>
      </div>

      {/* Weather Window & Recommendation */}
      <div className="space-y-2 my-2">
        <div className="mausam-subcard p-2.5 rounded-xl border border-white/[0.06] text-xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Critical Window:</span>
          <span className="text-white font-medium">{events.criticalWindow}</span>
        </div>

        <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-slate-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <span className="text-[11px] leading-relaxed text-slate-200">{events.recommendation}</span>
        </div>
      </div>

      {/* Tap prompt */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-cyan-400 transition">
        <span>View extended rain & wind gust risk</span>
        <ExternalLink className="w-3 h-3" />
      </div>
    </div>
  );
}
