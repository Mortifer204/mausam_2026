import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import { IMD_ALERT_STYLES } from '../../utils/weatherThemes';

export function AlertBanner({ alerts = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!alerts || alerts.length === 0) return null;

  const primaryAlert = alerts[0];
  const style = IMD_ALERT_STYLES[primaryAlert.level] || IMD_ALERT_STYLES.yellow;

  return (
    <div className={`w-full rounded-2xl border transition-all duration-300 overflow-hidden ${style.border} ${style.glow} bg-[#0c1424]/90 backdrop-blur-xl mb-4`}>
      <div 
        onClick={() => setIsExpanded(prev => !prev)}
        className="p-3.5 flex items-start gap-3 cursor-pointer hover:bg-white/[0.02] transition"
      >
        <div className={`mt-0.5 p-2 rounded-xl border ${style.badgeBg} flex-shrink-0`}>
          <AlertTriangle className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.badgeBg} tracking-wide uppercase`}>
              {style.label}
            </span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {primaryAlert.validUntil}
            </span>
          </div>

          <h4 className="text-xs font-bold text-white leading-snug truncate sm:whitespace-normal">
            {primaryAlert.title}
          </h4>
          <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">
            {primaryAlert.headline}
          </p>
        </div>

        <button 
          className="p-1 rounded-lg text-slate-400 hover:text-white transition"
          aria-label="Toggle alert instructions"
        >
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Expanded Official Instructions & Actionable Protocol */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-1 border-t border-white/5 bg-black/20 text-xs text-slate-300 space-y-2.5 animate-fade-in">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-sky-400" />
            Issued by: {primaryAlert.issuedBy}
          </div>

          <div className="space-y-1.5 pl-1">
            <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">
              Safety Directives:
            </div>
            {primaryAlert.instructions?.map((inst, idx) => (
              <div key={idx} className="flex items-start gap-2 text-[11px] leading-relaxed">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 flex-shrink-0 mt-0.5" />
                <span>{inst}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
