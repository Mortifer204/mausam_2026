import React, { useState, useRef, useMemo } from 'react';
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
import { Sparkles, LayoutGrid, EyeOff, ShieldCheck, Plus, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { PERSONA_CATEGORIES } from '../data/personaProfiles';

export function HomeScreen({ onOpenOnboarding }) {
  const { weatherData } = useWeather();
  const { 
    activePersonas, 
    pinnedWidgetIds, 
    removedWidgetIds, 
    customAddedWidgetIds, 
    isCustomLifestyle,
    resetToDefaultPersonas,
    setIsOnboardingModalOpen
  } = usePersonalization();

  const handleOpenOnboarding = onOpenOnboarding || (() => setIsOnboardingModalOpen?.(true));

  const [selectedWidgetKey, setSelectedWidgetKey] = useState(null);
  const [isAddWidgetModalOpen, setIsAddWidgetModalOpen] = useState(false);
  const [universalPageIndex, setUniversalPageIndex] = useState(0);
  const universalScrollRef = useRef(null);

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

  // Group secondary cards into 2-row vertical columns so 4 cards show at once (2 columns)
  // Col 0: [card 0, card 2] (Top-left, Bottom-left)
  // Col 1: [card 1, card 3] (Top-right, Bottom-right)
  // Col 2: [card 4, card 5] (Revealed on horizontal swipe)
  const universalColumns = useMemo(() => {
    const cards = prioritized.secondary;
    if (!cards || cards.length === 0) return [];
    if (cards.length <= 2) return [cards];
    
    // First 4 cards form a 2x2 grid (Col 0: [0, 2], Col 1: [1, 3])
    const cols = [
      [cards[0], cards[2]].filter(Boolean),
      [cards[1], cards[3]].filter(Boolean)
    ];
    
    // Subsequent cards form extra columns
    for (let i = 4; i < cards.length; i += 2) {
      cols.push(cards.slice(i, i + 2));
    }
    return cols;
  }, [prioritized.secondary]);

  const handleUniversalScroll = (e) => {
    const el = e.currentTarget;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll > 0) {
      const progress = el.scrollLeft / maxScroll;
      setUniversalPageIndex(progress > 0.4 ? 1 : 0);
    }
  };

  const scrollToUniversalCol = (targetIndex) => {
    if (universalScrollRef.current) {
      const el = universalScrollRef.current;
      const targetLeft = targetIndex === 0 ? 0 : el.scrollWidth - el.clientWidth;
      el.scrollTo({ left: targetLeft, behavior: 'smooth' });
      setUniversalPageIndex(targetIndex);
    }
  };

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
            <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 truncate">
              {isCustomLifestyle ? "Customized Priority Widgets" : "Personalized Priority Widgets"}
            </h3>
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap flex-shrink-0 ${
            isCustomLifestyle 
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' 
              : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
          }`}>
            {isCustomLifestyle ? "Custom Setup" : "Relevant Only"}
          </span>
        </div>

        {/* Dynamic Relevance Badge */}
        <div className="px-3.5 py-2 rounded-2xl mausam-subcard border border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
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
                className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
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
            <div className="p-6 rounded-3xl mausam-card border border-white/[0.08] text-center space-y-2">
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

      {/* 5. TIER 2: ESSENTIAL WEATHER METRICS (Universal tiles with horizontal swipe) */}
      {prioritized.secondary.length > 0 && (
        <div className="mb-5 space-y-3">
          <div className="flex items-center justify-between px-1 gap-2">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <LayoutGrid className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 truncate">
                Essential Weather Conditions
              </h3>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[10px] text-slate-500 hidden sm:inline whitespace-nowrap">Universal Metrics</span>
              {universalColumns.length > 2 && (
                <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-full border border-white/[0.08]">
                  <button
                    onClick={() => scrollToUniversalCol(0)}
                    disabled={universalPageIndex === 0}
                    className="w-4 h-4 rounded-full flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition"
                    aria-label="Previous metrics"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  <div className="flex items-center gap-1 px-0.5">
                    <button
                      onClick={() => scrollToUniversalCol(0)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        universalPageIndex === 0 ? 'w-3.5 bg-cyan-400' : 'w-1.5 bg-slate-600'
                      }`}
                      aria-label="Page 1 metrics"
                    />
                    <button
                      onClick={() => scrollToUniversalCol(1)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        universalPageIndex === 1 ? 'w-3.5 bg-cyan-400' : 'w-1.5 bg-slate-600'
                      }`}
                      aria-label="Page 2 metrics"
                    />
                  </div>
                  <button
                    onClick={() => scrollToUniversalCol(1)}
                    disabled={universalPageIndex === 1}
                    className="w-4 h-4 rounded-full flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition"
                    aria-label="Next metrics"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Horizontal Swipeable 2-Row Columns Carousel */}
          <div 
            ref={universalScrollRef}
            onScroll={handleUniversalScroll}
            className="flex overflow-x-auto gap-3 snap-x snap-mandatory scrollbar-none pb-1 select-none"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {universalColumns.map((colCards, colIdx) => (
              <div 
                key={colIdx} 
                className={`w-[calc(50%-6px)] min-w-[calc(50%-6px)] max-w-[calc(50%-6px)] flex-shrink-0 flex flex-col gap-3 ${
                  colIdx === 0 ? 'snap-start' : colIdx === universalColumns.length - 1 ? 'snap-end' : 'snap-start'
                }`}
              >
                {colCards.map(item => (
                  <div key={item.id} className="h-[148px] transition-all duration-300">
                    {renderWidget(item.id, weatherData, setSelectedWidgetKey, false)}
                  </div>
                ))}
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
          className="w-full py-4 px-4 rounded-3xl border border-dashed border-cyan-400/30 hover:border-cyan-400/60 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-glass group active:scale-[0.98]"
        >
          <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/30 transition-all">
            <Plus className="w-4 h-4" />
          </div>
          <span>Add Desired Widget to Home</span>
          {hiddenCount > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-200 border border-cyan-400/30">
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
