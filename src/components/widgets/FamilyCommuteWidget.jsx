import React from 'react';
import { Users, Umbrella, SunMedium, ShieldCheck, Pin, ExternalLink } from 'lucide-react';
import { usePersonalization } from '../../context/PersonalizationContext';
import { WidgetHeaderActions } from './WidgetHeaderActions';

export function FamilyCommuteWidget({ weatherData, onSelect, isHero = false }) {
  const { pinnedWidgetIds, togglePinWidget } = usePersonalization();
  const isPinned = pinnedWidgetIds.includes('family_commute');

  const family = weatherData.specialized?.family || {
    schoolCommuteSafety: "Safe",
    commuteNote: "Normal school bus pickup conditions.",
    playFeasibility: "Safe for outdoor parks.",
    dressCode: "Comfortable standard casuals."
  };

  return (
    <div 
      onClick={() => onSelect?.('family_commute')}
      className="mausam-card-interactive rounded-3xl p-5 border border-white/[0.08] cursor-pointer relative overflow-hidden group"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-2xl bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Family & School Commute
            </h4>
            <span className="text-[10px] text-slate-400">Child & Elder Safety</span>
          </div>
        </div>

        <WidgetHeaderActions widgetId="family_commute" />
      </div>

      {/* Main Metric */}
      <div className="flex items-baseline justify-between my-2">
        <div>
          <span className="text-3xl font-extrabold tracking-tight text-[#F1F5F9]">
            {family.schoolCommuteSafety}
          </span>
          <div className="text-xs text-slate-400 mt-0.5">School Transit Window</div>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full border bg-emerald-500/15 text-emerald-300 border-emerald-500/30">
          Family Safe
        </span>
      </div>

      {/* Guidance boxes */}
      <div className="space-y-2 my-3">
        <div className="mausam-subcard p-3 rounded-2xl border border-white/[0.06] text-xs text-slate-300">
          <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider block mb-0.5">
            Transit Observation:
          </span>
          {family.commuteNote}
        </div>

        <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-slate-300 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] text-cyan-300 uppercase font-bold tracking-wider block mb-0.5">
              Clothing Recommendation:
            </span>
            <span className="text-[11px] text-slate-200">{family.dressCode}</span>
          </div>
        </div>
      </div>

      {/* Tap prompt */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-cyan-400 transition">
        <span>View hourly bus route safety</span>
        <ExternalLink className="w-3 h-3" />
      </div>
    </div>
  );
}
