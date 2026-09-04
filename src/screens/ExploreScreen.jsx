import React, { useState } from 'react';
import { 
  Radar, 
  Satellite, 
  Wind, 
  Layers, 
  Play, 
  Pause, 
  ShieldCheck, 
  Activity,
  Gauge,
  Droplets,
  Eye,
  Sun,
  HeartPulse
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

export function ExploreScreen() {
  const { weatherData } = useWeather();
  const [activeLayer, setActiveLayer] = useState('radar'); // 'radar' | 'satellite' | 'aqi' | 'wind'
  const [isPlayingRadar, setIsPlayingRadar] = useState(true);

  if (!weatherData) return null;
  const current = weatherData.current;

  return (
    <div className="w-full max-w-md mx-auto px-4 pb-24 pt-2 space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Meteorological Explorer</h2>
          <p className="text-xs text-slate-400">Live Observation Feeds for {weatherData.name}</p>
        </div>
        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
          <Activity className="w-3 h-3 animate-pulse" /> Live Feeds
        </span>
      </div>

      {/* Layer Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'radar', label: 'Doppler Radar Scan', icon: Radar },
          { id: 'satellite', label: 'INSAT Satellite Layer', icon: Satellite },
          { id: 'aqi', label: 'Air Quality Sensor', icon: Wind },
          { id: 'wind', label: 'Wind Dynamics', icon: Layers },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeLayer === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveLayer(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap border transition ${
                isActive 
                  ? 'bg-sky-500/25 border-sky-400 text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.3)]' 
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Radar & Geospatial Surface Box */}
      <div className="relative rounded-3xl glass-card border border-white/15 overflow-hidden aspect-[4/3] flex flex-col justify-between p-4 bg-[#081120]">
        {/* Radar concentric range circles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
          <div className="w-64 h-64 rounded-full border border-sky-400/40 flex items-center justify-center">
            <div className="w-44 h-44 rounded-full border border-sky-400/50 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border border-sky-400/60 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,1)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Weather Overlays */}
        {activeLayer === 'radar' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-32 h-24 rounded-full bg-gradient-to-tr from-cyan-500/30 via-emerald-500/30 to-sky-500/40 blur-xl translate-x-8 -translate-y-6 animate-pulse-slow" />
          </div>
        )}

        {activeLayer === 'satellite' && (
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 via-indigo-950/40 to-slate-900/80 pointer-events-none flex items-center justify-center">
            <div className="w-48 h-36 bg-white/15 blur-2xl rounded-full transform -rotate-12 animate-pulse-slow" />
          </div>
        )}

        {activeLayer === 'aqi' && (
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-sky-500/20 to-indigo-500/20 blur-2xl pointer-events-none" />
        )}

        {/* Top Controls Overlay */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{weatherData.name.toUpperCase()} • Live Radar Scan</span>
          </div>

          <button
            onClick={() => setIsPlayingRadar(p => !p)}
            className="p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition"
            title="Play/Pause loop"
          >
            {isPlayingRadar ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Bottom Legend Overlay */}
        <div className="relative z-10 p-2.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-between text-[10px]">
          <div>
            <span className="text-slate-400 block font-semibold">Reflectivity Scale</span>
            <div className="flex items-center gap-1 mt-1">
              <span className="w-4 h-2 rounded bg-cyan-400" title="Light Rain" />
              <span className="w-4 h-2 rounded bg-emerald-400" title="Moderate" />
              <span className="w-4 h-2 rounded bg-amber-400" title="Heavy" />
              <span className="w-4 h-2 rounded bg-rose-500" title="Severe Squall" />
              <span className="text-[9px] text-slate-300 ml-1">15 - 55 dBZ</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-slate-400 font-semibold block">Sweep Interval</span>
            <span className="text-sky-300 font-bold">15 min scan cycle</span>
          </div>
        </div>
      </div>

      {/* Real-time Synoptic Station Readings */}
      <div className="glass-card rounded-3xl p-4 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Live Synoptic Telemetry ({weatherData.name})
          </h4>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Real Sensors
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-400 text-[10px] font-bold uppercase">
              <Gauge className="w-3.5 h-3.5" /> Atmospheric Pressure
            </div>
            <div className="text-base font-bold text-white">{current.pressure} hPa</div>
            <div className="text-[10px] text-slate-400">Mean sea-level barometer</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-400 text-[10px] font-bold uppercase">
              <Droplets className="w-3.5 h-3.5" /> Dew Point
            </div>
            <div className="text-base font-bold text-white">{current.dewPoint}°C</div>
            <div className="text-[10px] text-slate-400">Humidity at {current.humidity}%</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-teal-400 text-[10px] font-bold uppercase">
              <Wind className="w-3.5 h-3.5" /> Wind & Peak Gusts
            </div>
            <div className="text-base font-bold text-white">{current.windSpeed} km/h {current.windDirection}</div>
            <div className="text-[10px] text-slate-400">Peak gusts: {current.windGust} km/h</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-sky-400 text-[10px] font-bold uppercase">
              <Eye className="w-3.5 h-3.5" /> Road Visibility
            </div>
            <div className="text-base font-bold text-white">{current.visibility} km</div>
            <div className="text-[10px] text-slate-400">Optical transmission</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold uppercase">
              <HeartPulse className="w-3.5 h-3.5" /> Particulate Matter
            </div>
            <div className="text-base font-bold text-white">PM2.5: {current.pm25} µg/m³</div>
            <div className="text-[10px] text-slate-400">PM10: {current.pm10} µg/m³</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-bold uppercase">
              <Sun className="w-3.5 h-3.5" /> Solar Radiation
            </div>
            <div className="text-base font-bold text-white">UV Index: {current.uv}</div>
            <div className="text-[10px] text-slate-400">Sun: {current.sunrise} - {current.sunset}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
