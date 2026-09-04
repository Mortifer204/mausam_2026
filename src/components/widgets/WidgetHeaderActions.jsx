import React from 'react';
import { Pin, Minus } from 'lucide-react';
import { usePersonalization } from '../../context/PersonalizationContext';

export function WidgetHeaderActions({ widgetId, className = '' }) {
  const { pinnedWidgetIds, togglePinWidget, removeWidget } = usePersonalization();
  const isPinned = pinnedWidgetIds.includes(widgetId);

  return (
    <div 
      className={`flex items-center gap-1.5 ${className}`} 
      onClick={e => e.stopPropagation()}
    >
      {/* 1. Pin Button */}
      <button
        onClick={() => togglePinWidget(widgetId)}
        className={`p-1.5 rounded-xl border transition ${
          isPinned 
            ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.3)]' 
            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
        }`}
        title={isPinned ? "Unpin widget" : "Pin widget to top"}
      >
        <Pin className="w-3.5 h-3.5" />
      </button>

      {/* 2. Remove Button (-) */}
      <button
        onClick={() => removeWidget(widgetId)}
        className="p-1.5 rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 hover:bg-rose-500/15 transition active:scale-95 group"
        title="Remove widget from home page"
      >
        <Minus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
}
