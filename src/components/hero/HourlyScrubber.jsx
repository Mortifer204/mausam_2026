import React, { useState } from 'react';
import { 
  Clock, 
  Sun, 
  CloudSun, 
  CloudRain, 
  CloudLightning, 
  Cloud, 
  Moon, 
  Waves, 
  Wind,
  Umbrella
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { usePersonalization } from '../../context/PersonalizationContext';

export function HourlyScrubber() {
  const { weatherData } = useWeather();
  const { activePersonas } = usePersonalization();
  const [selectedHourIndex, setSelectedHourIndex] = useState(0);

  const hourly = weatherData.hourly || [];
  const selectedHour = hourly[selectedHourIndex] || hourly[0];

  const renderHourlyIcon = (iconName) => {
    switch (iconName) {
      case 'Sun': return <Sun className="w-5 h-5 text-amber-400" />;
      case 'CloudSun': return <CloudSun className="w-5 h-5 text-sky-400" />;
      case 'CloudRain': return <CloudRain className="w-5 h-5 text-cyan-400" />;
      case 'CloudLightning': return <CloudLightning className="w-5 h-5 text-amber-500 animate-pulse" />;
      case 'Moon': return <Moon className="w-5 h-5 text-indigo-300" />;
      case 'Waves': return <Waves className="w-5 h-5 text-cyan-300" />;
      case 'Wind': return <Wind className="w-5 h-5 text-teal-300" />;
      default: return <Cloud className="w-5 h-5 text-slate-300" />;
    }
  };

  const showFitness = activePersonas.includes('fitness');
  const showHealth = activePersonas.includes('health');

  return (
    <div className="w-full mausam-card rounded-3xl p-5 mb-5 border border-white/[0.08]">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Hourly Scrubber & Timeline
          </h3>
        </div>
        {selectedHour && (
          <div className="text-[11px] text-cyan-300 font-semibold flex items-center gap-1.5 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
            <span>{selectedHour.time}: {selectedHour.condition}</span>
            <span>• {selectedHour.pop}% Rain</span>
          </div>
        )}
      </div>

      {/* Horizontal Scrollable Scrubber */}
      <div className="flex items-center gap-3 overflow-x-auto p-2 no-scrollbar scroll-smooth">
        {hourly.map((hour, idx) => {
          const isSelected = selectedHourIndex === idx;
          const isHighRain = hour.pop >= 60;
          return (
            <button
              key={idx}
              onClick={() => setSelectedHourIndex(idx)}
              className={`flex-shrink-0 w-16 py-3 px-2 rounded-2xl flex flex-col items-center justify-between gap-1.5 transition-all duration-200 text-center relative ${
                isSelected
                  ? 'bg-cyan-500/25 border-2 border-cyan-400 text-white shadow-[0_0_16px_rgba(6,182,212,0.35)] ring-1 ring-cyan-400/40'
                  : 'bg-white/[0.04] border border-white/[0.07] text-slate-300 hover:bg-white/[0.08]'
              }`}
            >
              <span className="text-[11px] font-semibold text-slate-300">{hour.time}</span>
              
              <div className="my-1">
                {renderHourlyIcon(hour.icon)}
              </div>

              <span className="text-sm font-bold text-white">{hour.temp}°</span>

              {/* Rain Probability Bar Indicator */}
              <div className="w-full mt-1 flex flex-col items-center">
                <div className="w-full bg-slate-700/50 h-1 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${isHighRain ? 'bg-cyan-400' : 'bg-slate-400'}`}
                    style={{ width: `${hour.pop}%` }}
                  />
                </div>
                <span className={`text-[10px] mt-0.5 font-medium flex items-center gap-0.5 ${
                  isHighRain ? 'text-cyan-300 font-bold' : 'text-slate-400'
                }`}>
                  {hour.pop > 20 && <Umbrella className="w-2 h-2" />}
                  {hour.pop}%
                </span>
              </div>

              {/* Persona Context Pill */}
              {showFitness && (
                <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded truncate max-w-[58px] ${
                  hour.fitScore > 80 ? 'bg-emerald-500/20 text-emerald-300' :
                  hour.fitScore > 60 ? 'bg-amber-500/20 text-amber-300' :
                  'bg-rose-500/20 text-rose-300'
                }`}>
                  Fit: {Math.round(hour.fitScore)}
                </div>
              )}
              {showHealth && !showFitness && (
                <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded truncate max-w-[58px] ${
                  hour.aqi < 100 ? 'bg-emerald-500/20 text-emerald-300' :
                  hour.aqi < 150 ? 'bg-amber-500/20 text-amber-300' :
                  'bg-rose-500/20 text-rose-300'
                }`}>
                  AQI {Math.round(hour.aqi)}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
