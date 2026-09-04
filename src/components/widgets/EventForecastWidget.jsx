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
      className={`glass-card-interactive rounded-3xl p-5 border border-white/10 cursor-pointer relative overflow-hidden group ${
        isHero ? 'bg-gradient-to-br from-[#24121d]/90 to-[#140e1b]/95' : ''
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
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
          <span className={`text-4xl font-extrabold tracking-tight ${isGood ? 'text-rose-400' : 'text-amber-400'}`}>
            {score}
          </span>
          <span className="text-xs text-slate-400 ml-1 font-medium">/ 100</span>
        </div>

        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
          isGood ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
        }`}>
          {events.rating}
        </span>
      </div>

      {/* Detail info */}
      <div className="space-y-2 my-3">
        <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Weather Window:</span>
          <span className="text-white font-medium">{events.criticalWindow}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-slate-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <span className="text-[11px] leading-relaxed text-slate-200">{events.recommendation}</span>
        </div>
      </div>

      {/* Tap prompt */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-rose-400 transition">
        <span>View extended rain & wind gust risk</span>
        <ExternalLink className="w-3 h-3" />
      </div>
    </div>
  );
}
