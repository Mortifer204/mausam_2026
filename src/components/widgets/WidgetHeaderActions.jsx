import React from 'react';
import { Pin, Minus } from 'lucide-react';
import { usePersonalization } from '../../context/PersonalizationContext';

export function WidgetHeaderActions({ widgetId, className = '' }) {
  const { pinnedWidgetIds, togglePinWidget, removeWidget } = usePersonalization();
  const isPinned = pinnedWidgetIds.includes(widgetId);

  return (
    <div 
      className={`flex items-center gap-1 sm:gap-1.5 flex-shrink-0 ${className}`} 
      onClick={e => e.stopPropagation()}
    >
      {/* 1. Pin Button */}
      <button
        onClick={() => togglePinWidget(widgetId)}
        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border transition flex items-center justify-center flex-shrink-0 ${
          isPinned 
            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-glow-cyan' 
            : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08]'
        }`}
        title={isPinned ? "Unpin widget" : "Pin widget to top"}
      >
        <Pin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      </button>

      {/* 2. Remove Button (-) */}
      <button
        onClick={() => removeWidget(widgetId)}
        className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-white/[0.08] bg-white/[0.04] text-slate-400 hover:text-rose-400 hover:border-rose-500/40 hover:bg-rose-500/15 transition active:scale-95 flex items-center justify-center flex-shrink-0 group"
        title="Remove widget from home page"
      >
        <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
}
