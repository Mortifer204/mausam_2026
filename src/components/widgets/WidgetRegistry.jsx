import React from 'react';
import { HealthAqiWidget } from './HealthAqiWidget';
import { FitnessRunningWidget } from './FitnessRunningWidget';
import { TravelPackingWidget } from './TravelPackingWidget';
import { FarmingAgroWidget } from './FarmingAgroWidget';
import { CommuterFogWidget } from './CommuterFogWidget';
import { BeachTidesWidget } from './BeachTidesWidget';
import { FamilyCommuteWidget } from './FamilyCommuteWidget';
import { EventForecastWidget } from './EventForecastWidget';
import {
  RainProbabilityWidget,
  UvIndexWidget,
  WindMetricsWidget,
  HumidityHeatWidget,
  SunriseSunsetWidget,
  VisibilityPressureWidget
} from './UniversalWidgets';

export const COMPONENT_MAP = {
  health_aqi: HealthAqiWidget,
  fitness_running: FitnessRunningWidget,
  travel_packing: TravelPackingWidget,
  farming_agro: FarmingAgroWidget,
  commuter_fog: CommuterFogWidget,
  beach_tides: BeachTidesWidget,
  family_commute: FamilyCommuteWidget,
  event_forecast: EventForecastWidget,
  rain_probability: RainProbabilityWidget,
  uv_index: UvIndexWidget,
  wind_metrics: WindMetricsWidget,
  humidity_heat: HumidityHeatWidget,
  sunrise_sunset: SunriseSunsetWidget,
  visibility_pressure: VisibilityPressureWidget
};

export function renderWidget(widgetKey, weatherData, onSelect, isHero = false) {
  const Component = COMPONENT_MAP[widgetKey];
  if (!Component) return null;

  return (
    <Component 
      key={widgetKey}
      weatherData={weatherData} 
      onSelect={onSelect} 
      isHero={isHero}
    />
  );
}
