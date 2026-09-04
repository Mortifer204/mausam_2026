import React from 'react';
import { Calendar, Umbrella, Droplets } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

export function ForecastSection() {
  const { weatherData } = useWeather();
  const daily = weatherData.daily || [];

  return (
    <div className="w-full glass-card rounded-3xl p-5 mb-5 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            7-Day Meteorological Outlook
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">IMD Regional Model</span>
      </div>

      <div className="space-y-3">
        {daily.map((day, idx) => {
          // Temperature bar calculation (relative range 10°C to 42°C)
          const minRange = 10;
          const maxRange = 42;
          const leftPercent = Math.max(0, ((day.low - minRange) / (maxRange - minRange)) * 100);
          const widthPercent = Math.max(15, ((day.high - day.low) / (maxRange - minRange)) * 100);

          return (
            <div 
              key={idx} 
              className="flex items-center justify-between gap-3 text-xs py-1 border-b border-white/5 last:border-0"
            >
              {/* Day Label */}
              <div className="w-14 font-semibold text-slate-200">
                {day.day}
              </div>

              {/* Condition & Pop */}
              <div className="flex items-center gap-2 w-28">
                <span className="truncate text-slate-300 font-medium">{day.condition}</span>
                {day.pop > 25 && (
                  <span className="text-[10px] text-cyan-400 font-bold flex items-center gap-0.5">
                    <Umbrella className="w-2.5 h-2.5" /> {day.pop}%
                  </span>
                )}
              </div>

              {/* Low Temp */}
              <span className="w-6 text-right text-slate-400 font-medium">
                {day.low}°
              </span>

              {/* Visual Temperature Bar */}
              <div className="flex-1 h-2 bg-slate-800 rounded-full relative overflow-hidden">
                <div 
                  className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400"
                  style={{
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`,
                  }}
                />
              </div>

              {/* High Temp */}
              <span className="w-6 text-left text-white font-bold">
                {day.high}°
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
