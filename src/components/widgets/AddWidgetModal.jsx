import React from 'react';
import { 
  X, 
  Plus, 
  Sparkles, 
  HeartPulse, 
  Plane, 
  Flame, 
  Sprout, 
  Car, 
  Waves, 
  Users, 
  CalendarCheck,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Sunrise,
  Gauge,
  Check
} from 'lucide-react';
import { usePersonalization } from '../../context/PersonalizationContext';
import { WIDGET_DEFINITIONS } from '../../utils/widgetScoringEngine';

const WIDGET_ICON_MAP = {
  health_aqi: HeartPulse,
  travel_packing: Plane,
  fitness_running: Flame,
  farming_agro: Sprout,
  commuter_fog: Car,
  beach_tides: Waves,
  family_commute: Users,
  event_forecast: CalendarCheck,
  rain_probability: CloudRain,
  uv_index: Sun,
  wind_metrics: Wind,
  humidity_heat: Droplets,
  sunrise_sunset: Sunrise,
  visibility_pressure: Gauge,
};

const WIDGET_DESC_MAP = {
  health_aqi: "Real-time PM2.5, PM10 and respiratory health advisories.",
  travel_packing: "Luggage recommendations and route weather warnings.",
  fitness_running: "Hourly outdoor workout and jogging comfort score.",
  farming_agro: "Soil moisture, spray window and crop harvesting advisories.",
  commuter_fog: "Dense fog radar, road visibility and commute delay risk.",
  beach_tides: "High/low tide timetable and coastal water safety alerts.",
  family_commute: "School transit protection and child-safe clothing alerts.",
  event_forecast: "Outdoor gathering, wedding and party downpour planner.",
  rain_probability: "Hourly and daily rainfall probability percentage.",
  uv_index: "Peak solar ultraviolet radiation and skin protection advice.",
  wind_metrics: "Surface wind speed, direction and high-speed gust tracker.",
  humidity_heat: "Dew point, relative humidity and thermal feels-like index.",
  sunrise_sunset: "Golden hour photoperiod, dawn and dusk schedule.",
  visibility_pressure: "Mean sea-level barometer and optical road clarity.",
};

export function AddWidgetModal({ isOpen, onClose, hiddenWidgets = [] }) {
  const { addWidget } = usePersonalization();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-md max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-[#091022] border border-white/15 shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Add Weather Widget</h3>
              <p className="text-xs text-slate-400">Choose from available meteorological modules</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: List of Unlisted / Hidden Widgets */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {hiddenWidgets.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-white">All Widgets Active</div>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                You already have every available meteorological module active on your Home canvas!
              </p>
            </div>
          ) : (
            <>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                Available Modules ({hiddenWidgets.length})
              </div>

              {hiddenWidgets.map(widget => {
                const Icon = WIDGET_ICON_MAP[widget.id] || Sparkles;
                const desc = WIDGET_DESC_MAP[widget.id] || "Meteorological data feed.";

                return (
                  <div
                    key={widget.id}
                    className="p-3.5 rounded-2xl glass-card border border-white/10 hover:border-sky-400/40 transition flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-sky-400 flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white truncate">{widget.title}</span>
                          <span className="text-[8px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-white/5 text-slate-400 border border-white/10">
                            {widget.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-tight mt-0.5 line-clamp-2">
                          {desc}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        addWidget(widget.id);
                        onClose();
                      }}
                      className="flex-shrink-0 py-2 px-3 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 hover:text-white border border-sky-400/40 font-bold text-xs flex items-center gap-1 transition active:scale-95 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Modal Footer Note */}
        <div className="p-3 bg-black/40 border-t border-white/10 text-center text-[10px] text-slate-400">
          Adding any widget automatically switches your configuration to <strong>Custom Setup</strong>.
        </div>
      </div>
    </div>
  );
}
