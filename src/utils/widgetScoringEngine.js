// Core Personalization & Dynamic Prioritization Engine for Mausam
// Computes dynamic scores for weather widgets and STRICTLY FILTERS OUT unrelated widgets:
// - Specialized category widgets (Travel, Farming, Fitness, etc.) are ONLY shown if that category is active.
// - Universal weather widgets (Rain, UV, Wind, Humidity, Solar, Barometer) adapt their score based on relevance.

export const WIDGET_DEFINITIONS = {
  // 1. Specialized Category Widgets (STRICTLY gated by active user category)
  health_aqi: {
    id: "health_aqi",
    title: "Air Quality & Respiratory",
    category: "health",
    isSpecialized: true,
    baseAffinities: { health: 10, family: 7, fitness: 6, commuter: 5, travel: 5, events: 4, farming: 2, beach: 2 },
    component: "HealthAqiWidget",
  },
  fitness_running: {
    id: "fitness_running",
    title: "Running & Outdoor Workout",
    category: "fitness",
    isSpecialized: true,
    baseAffinities: { fitness: 10, health: 6, family: 4, beach: 4, events: 3, commuter: 2, travel: 2, farming: 1 },
    component: "FitnessRunningWidget",
  },
  travel_packing: {
    id: "travel_packing",
    title: "Travel Radar & Packing Assistant",
    category: "travel",
    isSpecialized: true,
    baseAffinities: { travel: 10, commuter: 6, events: 5, family: 4, health: 3, fitness: 2, farming: 1, beach: 3 },
    component: "TravelPackingWidget",
  },
  farming_agro: {
    id: "farming_agro",
    title: "Agromet Advisory & Soil Moisture",
    category: "farming",
    isSpecialized: true,
    baseAffinities: { farming: 10, events: 3, family: 2, travel: 1, fitness: 1, health: 2, commuter: 1, beach: 1 },
    component: "FarmingAgroWidget",
  },
  commuter_fog: {
    id: "commuter_fog",
    title: "Commute Highway & Visibility",
    category: "commuter",
    isSpecialized: true,
    baseAffinities: { commuter: 10, travel: 7, family: 6, fitness: 4, events: 4, health: 3, farming: 3, beach: 2 },
    component: "CommuterFogWidget",
  },
  beach_tides: {
    id: "beach_tides",
    title: "Tides, Waves & Water Temp",
    category: "beach",
    isSpecialized: true,
    baseAffinities: { beach: 10, travel: 6, fitness: 5, events: 4, family: 3, commuter: 1, health: 2, farming: 1 },
    component: "BeachTidesWidget",
  },
  family_commute: {
    id: "family_commute",
    title: "Family School & Play Safety",
    category: "family",
    isSpecialized: true,
    baseAffinities: { family: 10, commuter: 6, health: 5, events: 4, travel: 3, fitness: 2, farming: 2, beach: 3 },
    component: "FamilyCommuteWidget",
  },
  event_forecast: {
    id: "event_forecast",
    title: "Outdoor Event Comfort Index",
    category: "events",
    isSpecialized: true,
    baseAffinities: { events: 10, family: 6, travel: 5, fitness: 5, beach: 4, commuter: 2, health: 3, farming: 2 },
    component: "EventForecastWidget",
  },

  // 2. Core Universal Weather Metrics (General meteorological tiles)
  rain_probability: {
    id: "rain_probability",
    title: "Precipitation Probability",
    category: "universal",
    isSpecialized: false,
    baseAffinities: { travel: 9, farming: 10, commuter: 9, events: 9, family: 8, fitness: 7, health: 5, beach: 6 },
    component: "RainProbabilityWidget",
  },
  uv_index: {
    id: "uv_index",
    title: "UV Exposure & Protection",
    category: "universal",
    isSpecialized: false,
    baseAffinities: { health: 9, fitness: 8, beach: 10, family: 7, events: 6, travel: 5, farming: 5, commuter: 3 },
    component: "UvIndexWidget",
  },
  wind_metrics: {
    id: "wind_metrics",
    title: "Wind Speed & Direction",
    category: "universal",
    isSpecialized: false,
    baseAffinities: { beach: 9, fitness: 8, farming: 8, commuter: 6, events: 7, travel: 5, health: 4, family: 4 },
    component: "WindMetricsWidget",
  },
  humidity_heat: {
    id: "humidity_heat",
    title: "Humidity & Heat Index",
    category: "universal",
    isSpecialized: false,
    baseAffinities: { health: 8, fitness: 8, farming: 7, events: 6, commuter: 5, family: 5, travel: 4, beach: 5 },
    component: "HumidityHeatWidget",
  },
  sunrise_sunset: {
    id: "sunrise_sunset",
    title: "Sunrise & Sunset Golden Hour",
    category: "universal",
    isSpecialized: false,
    baseAffinities: { fitness: 8, beach: 8, events: 7, travel: 6, family: 4, farming: 5, commuter: 3, health: 3 },
    component: "SunriseSunsetWidget",
  },
  visibility_pressure: {
    id: "visibility_pressure",
    title: "Visibility & Barometer",
    category: "universal",
    isSpecialized: false,
    baseAffinities: { commuter: 8, travel: 7, events: 5, fitness: 4, beach: 4, farming: 4, health: 4, family: 3 },
    component: "VisibilityPressureWidget",
  }
};

/**
 * Calculates display score for a widget based on user profile and live weather
 */
export function calculateWidgetScore(widgetKey, activePersonas = [], weatherData = {}, pinnedWidgetIds = []) {
  const widget = WIDGET_DEFINITIONS[widgetKey];
  if (!widget) return 0;

  // Persona Affinity Score (0 - 10)
  let maxPersonaAffinity = 0;
  for (const personaId of activePersonas) {
    const affinity = widget.baseAffinities[personaId] || 0;
    if (affinity > maxPersonaAffinity) {
      maxPersonaAffinity = affinity;
    }
  }

  // Meteorological Urgency Multiplier (0 - 10)
  let urgencyScore = 0;
  const current = weatherData.current || {};
  const alerts = weatherData.alerts || [];

  const hasSevereAlert = alerts.some(a => a.level === 'orange' || a.level === 'red');
  if (hasSevereAlert) {
    if (widgetKey === 'rain_probability' || widgetKey === 'commuter_fog') {
      urgencyScore += 9;
    }
  }

  // Severe AQI boost
  if (current.aqi > 150 && widgetKey === 'health_aqi') {
    urgencyScore += 10;
  }

  // Rain / Storm boost
  if (current.conditionCode === 'thunder' || current.conditionCode === 'rain') {
    if (widgetKey === 'rain_probability') urgencyScore += 9;
  }

  // Extreme UV boost
  if (current.uv >= 8 && widgetKey === 'uv_index') {
    urgencyScore += 8;
  }

  // Diurnal Relevance (0 - 10)
  const hour = new Date().getHours();
  let diurnalScore = 5;
  if (hour >= 5 && hour <= 9) {
    if (widgetKey === 'fitness_running' || widgetKey === 'commuter_fog' || widgetKey === 'family_commute') {
      diurnalScore = 9;
    }
  } else if (hour >= 11 && hour <= 15) {
    if (widgetKey === 'uv_index' || widgetKey === 'humidity_heat') {
      diurnalScore = 9;
    }
  } else if (hour >= 16 && hour <= 20) {
    if (widgetKey === 'commuter_fog' || widgetKey === 'fitness_running' || widgetKey === 'event_forecast') {
      diurnalScore = 9;
    }
  }

  const isPinned = pinnedWidgetIds.includes(widgetKey);
  const pinnedBonus = isPinned ? 20 : 0;

  return (maxPersonaAffinity * 4.5) + (urgencyScore * 3.5) + (diurnalScore * 1.5) + pinnedBonus;
}

/**
 * Returns prioritized widgets with STRICT FILTERING:
 * - Specialized widgets that do NOT match the user's active personas (and are not pinned) are HIDDEN.
 * - Only the relevant specialized widgets appear in heroPriority.
 * - Only relevant universal metrics appear in secondary tiles.
 */
export function getPrioritizedWidgets(activePersonas = [], weatherData = {}, pinnedWidgetIds = [], removedWidgetIds = [], customAddedWidgetIds = []) {
  const widgetKeys = Object.keys(WIDGET_DEFINITIONS);

  // 1. Filter widgets strictly by relevance, removed list, and custom additions
  const eligibleWidgets = [];
  const hiddenWidgets = [];

  for (const key of widgetKeys) {
    const def = WIDGET_DEFINITIONS[key];
    const isPinned = pinnedWidgetIds.includes(key);
    const isRemoved = removedWidgetIds.includes(key);
    const isCustomAdded = customAddedWidgetIds.includes(key);

    if (isRemoved) {
      // User explicitly removed this widget -> place in hidden
      hiddenWidgets.push(def);
      continue;
    }

    if (def.isSpecialized) {
      // Specialized widget: eligible if matches active persona, or pinned, or custom added
      const isRelevant = activePersonas.includes(def.category) || isPinned || isCustomAdded;
      if (isRelevant) {
        eligibleWidgets.push({
          ...def,
          score: calculateWidgetScore(key, activePersonas, weatherData, pinnedWidgetIds),
          isPinned,
          isCustomAdded
        });
      } else {
        hiddenWidgets.push(def);
      }
    } else {
      // Universal metric widget: eligible unless removed
      eligibleWidgets.push({
        ...def,
        score: calculateWidgetScore(key, activePersonas, weatherData, pinnedWidgetIds),
        isPinned,
        isCustomAdded
      });
    }
  }

  // 2. Separate into active specialized cards and universal metric tiles
  const activeSpecialized = eligibleWidgets
    .filter(w => w.isSpecialized)
    .sort((a, b) => b.score - a.score);

  const universalMetrics = eligibleWidgets
    .filter(w => !w.isSpecialized)
    .sort((a, b) => b.score - a.score);

  // 3. Assemble Hero Priority:
  // Show all active specialized persona cards (e.g. Health + Travel gives 2 cards)
  const heroPriority = [...activeSpecialized];

  // If user only has 1 specialized card (e.g. only Farming), promote the top universal card (e.g. Rain Probability)
  if (heroPriority.length < 2 && universalMetrics.length > 0) {
    heroPriority.push(universalMetrics.shift());
  }

  // 4. Assemble Secondary Metrics:
  // Return all eligible universal metric tiles for horizontal swipe
  const secondary = [...universalMetrics];

  return {
    heroPriority,
    secondary,
    hiddenWidgets,
    activeSpecializedCount: activeSpecialized.length,
    activePersonas
  };
}
