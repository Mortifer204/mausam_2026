import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  PhoneCall, 
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { IMD_ALERT_STYLES } from '../utils/weatherThemes';

export function AlertsScreen() {
  const { weatherData, allLocations } = useWeather();
  const [filterLevel, setFilterLevel] = useState('all'); // 'all' | 'orange_red'

  // Only real alerts from the user's active real location and saved locations
  const activeAlerts = (weatherData?.alerts || []).map(a => ({
    ...a,
    locationName: weatherData.name,
    locationState: weatherData.state
  }));

  const filteredAlerts = filterLevel === 'orange_red'
    ? activeAlerts.filter(a => a.level === 'orange' || a.level === 'red')
    : activeAlerts;

  const hasSevere = activeAlerts.some(a => a.level === 'orange' || a.level === 'red');

  return (
    <div className="w-full max-w-md mx-auto px-4 pb-24 pt-2 space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Meteorological Warnings</h2>
          <p className="text-xs text-slate-400">Live Bulletins for {weatherData?.name || "Your Location"}</p>
        </div>
        <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${
          hasSevere 
            ? 'bg-orange-500/15 border-orange-500/30 text-orange-400 animate-pulse' 
            : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
        }`}>
          {hasSevere ? <AlertTriangle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterLevel('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
            filterLevel === 'all' 
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
              : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white'
          }`}
        >
          All Bulletins ({activeAlerts.length})
        </button>
        <button
          onClick={() => setFilterLevel('orange_red')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
            filterLevel === 'orange_red' 
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' 
              : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white'
          }`}
        >
          Hazardous Only
        </button>
      </div>

      {/* Real Alerts Cards */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-5 rounded-3xl glass-card border border-white/10 text-center space-y-2">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="text-sm font-bold text-white">No Severe Weather Warnings</div>
            <p className="text-xs text-slate-400">
              No orange or red meteorological hazards are currently active for {weatherData?.name}.
            </p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const style = IMD_ALERT_STYLES[alert.level] || IMD_ALERT_STYLES.green;
            return (
              <div 
                key={alert.id}
                className={`rounded-3xl p-4 border glass-card ${style.border} ${style.glow} space-y-3`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${style.badgeBg} uppercase tracking-wider`}>
                        {style.label}
                      </span>
                      <span className="text-[11px] font-semibold text-white">{alert.locationName}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white leading-snug">{alert.title}</h3>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-black/20 p-2.5 rounded-2xl border border-white/5">
                  {alert.headline}
                </p>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Advisory Protocols:
                  </span>
                  {alert.instructions?.map((inst, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 flex-shrink-0 mt-0.5" />
                      <span>{inst}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Valid: {alert.validUntil}
                  </span>
                  <span className="text-sky-400 font-semibold">{alert.issuedBy}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Civil Helpline Card */}
      <div className="rounded-3xl p-4 bg-gradient-to-r from-rose-950/40 to-slate-900 border border-rose-500/20 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wider text-[11px]">
          <PhoneCall className="w-4 h-4" />
          National Disaster Management (NDMA) Helplines
        </div>
        <p className="text-[11px] text-slate-300">
          In case of severe local cyclone, flash floods, or lightning hazards, contact emergency services:
        </p>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-2 rounded-xl bg-black/30 border border-white/5 text-center">
            <span className="text-[10px] text-slate-400 block">NDMA Control Room</span>
            <span className="text-xs font-bold text-white">1078</span>
          </div>
          <div className="p-2 rounded-xl bg-black/30 border border-white/5 text-center">
            <span className="text-[10px] text-slate-400 block">National Emergency</span>
            <span className="text-xs font-bold text-white">112</span>
          </div>
        </div>
      </div>
    </div>
  );
}
