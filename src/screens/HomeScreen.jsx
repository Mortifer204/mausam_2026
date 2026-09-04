import React, { useState } from 'react';
import { AtmosphericHero } from '../components/hero/AtmosphericHero';
import { AlertBanner } from '../components/common/AlertBanner';
import { HourlyScrubber } from '../components/hero/HourlyScrubber';
import { ForecastSection } from '../components/hero/ForecastSection';
import { WidgetModalSheet } from '../components/widgets/WidgetModalSheet';
import { AddWidgetModal } from '../components/widgets/AddWidgetModal';
import { renderWidget } from '../components/widgets/WidgetRegistry';
import { getPrioritizedWidgets } from '../utils/widgetScoringEngine';
import { useWeather } from '../context/WeatherContext';
import { usePersonalization } from '../context/PersonalizationContext';
import { Sparkles, LayoutGrid, EyeOff, ShieldCheck, Plus, RotateCcw } from 'lucide-react';
import { PERSONA_CATEGORIES } from '../data/personaProfiles';

export function HomeScreen() {
  const { weatherData } = useWeather();
  const { 
    activePersonas, 
    pinnedWidgetIds, 
    removedWidgetIds, 
    customAddedWidgetIds, 
    isCustomLifestyle,
    resetToDefaultPersonas
  } = usePersonalization();

  const [selectedWidgetKey, setSelectedWidgetKey] = useState(null);
  const [isAddWidgetModalOpen, setIsAddWidgetModalOpen] = useState(false);

  // Compute prioritized widget layout respecting user's active personas, custom additions, and removals
  const prioritized = getPrioritizedWidgets(
    activePersonas, 
    weatherData, 
    pinnedWidgetIds, 
    removedWidgetIds, 
    customAddedWidgetIds
  );

  const activePersonaObjs = PERSONA_CATEGORIES.filter(p => activePersonas.includes(p.id));
  const hiddenCount = prioritized.hiddenWidgets?.length || 0;

  return (
    <div className="w-full max-w-md mx-auto px-4 pb-24 pt-2">
      {/* 1. Atmospheric Hero with AI Weather Assistant tagline */}
      <AtmosphericHero />

      {/* 2. Official IMD Color-coded Alert Banner (if hazards exist) */}
      <AlertBanner alerts={weatherData.alerts} />

      {/* 3. TIER 1: HIGH-PRIORITY PERSONALIZED WIDGETS */}
      <div className="mb-5 space-y-3">
        <div className="flex items-center justify-between px-1 gap-2">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <Sparkles className="w-4 h-4 text-sky-400 flex-shrink-0" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 truncate">
              {isCustomLifestyle ? "Customized Priority Widgets" : "Personalized Priority Widgets"}
            </h3>
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap flex-shrink-0 ${
            isCustomLifestyle 
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' 
              : 'bg-sky-500/10 text-sky-400 border-sky-500/20'
          }`}>
            {isCustomLifestyle ? "Custom Setup" : "Relevant Only"}
          </span>
        </div>

        {/* Dynamic Relevance Badge */}
        <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="truncate">
              {isCustomLifestyle ? (
                <span>
                  Lifestyle: <strong className="text-amber-300">Custom Configuration</strong>
                </span>
              ) : (
                <span>
                  Active: <strong className="text-slate-200">{activePersonaObjs.map(p => p.title).join(', ')}</strong>
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            {isCustomLifestyle && (
              <button
                onClick={resetToDefaultPersonas}
                className="text-[10px] text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold"
                title="Reset to default category layout"
              >
                <RotateCcw className="w-2.5 h-2.5" /> Reset
              </button>
            )}
            {hiddenCount > 0 && (
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <EyeOff className="w-3 h-3" /> {hiddenCount} unlisted
              </span>
            )}
          </div>
        </div>

        {/* Hero Priority Cards (Only active persona and custom widgets!) */}
        <div className="space-y-4">
          {prioritized.heroPriority.length === 0 ? (
            <div className="p-6 rounded-3xl glass-card border border-white/10 text-center space-y-2">
              <div className="text-xs font-bold text-slate-300">No Hero Cards Active</div>
              <p className="text-[11px] text-slate-400">
                You have removed all hero cards. Tap "Add Desired Widget" below to restore your preferred cards.
              </p>
            </div>
          ) : (
            prioritized.heroPriority.map(item => (
              <div key={item.id} className="transition-all duration-500 animate-fade-in">
                {renderWidget(item.id, weatherData, setSelectedWidgetKey, true)}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4. Hourly Interactive Scrubber & Precipitation Timeline */}
      <HourlyScrubber />

      {/* 5. TIER 2: ESSENTIAL WEATHER METRICS (Universal tiles) */}
      {prioritized.secondary.length > 0 && (
        <div className="mb-5 space-y-3">
          <div className="flex items-center justify-between px-1 gap-2">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <LayoutGrid className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 truncate">
                Essential Weather Conditions
              </h3>
            </div>
            <span className="text-[10px] text-slate-500 whitespace-nowrap flex-shrink-0">Universal Metrics</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {prioritized.secondary.map(item => (
              <div key={item.id} className="transition-all duration-300">
                {renderWidget(item.id, weatherData, setSelectedWidgetKey, false)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. 7-Day Extended Meteorological Outlook */}
      <ForecastSection />

      {/* 7. NEW: Add Desired Widget Button at the end of the Home Page */}
      <div className="mt-5 pt-2">
        <button
          onClick={() => setIsAddWidgetModalOpen(true)}
          className="w-full py-4 px-4 rounded-3xl border border-dashed border-sky-400/35 hover:border-sky-400 bg-sky-500/5 hover:bg-sky-500/10 text-sky-300 font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-lg group active:scale-[0.98]"
        >
          <div className="w-7 h-7 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 group-hover:scale-110 group-hover:bg-sky-500/30 transition-all">
            <Plus className="w-4 h-4" />
          </div>
          <span>Add Desired Widget to Home</span>
          {hiddenCount > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-400/20 text-sky-200 border border-sky-400/30">
              {hiddenCount} Available
            </span>
          )}
        </button>
      </div>

      {/* 8. Deep Drilldown Modal Sheet for Any Selected Widget */}
      <WidgetModalSheet
        selectedWidgetKey={selectedWidgetKey}
        onClose={() => setSelectedWidgetKey(null)}
        weatherData={weatherData}
      />

      {/* 9. Modal to Add Desired Widgets */}
      <AddWidgetModal
        isOpen={isAddWidgetModalOpen}
        onClose={() => setIsAddWidgetModalOpen(false)}
        hiddenWidgets={prioritized.hiddenWidgets}
      />
    </div>
  );
}
