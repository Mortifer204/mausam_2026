import React from 'react';
import { Activity, Wind, Gauge, ExternalLink } from 'lucide-react';
import { usePersonalization } from '../../context/PersonalizationContext';
import { WidgetHeaderActions } from './WidgetHeaderActions';

export function HealthAqiWidget({ weatherData, onSelect, isHero = false }) {
  const { pinnedWidgetIds } = usePersonalization();
  const isPinned = pinnedWidgetIds.includes('health_aqi');

  const health = weatherData?.specialized?.health || {
    aqi: weatherData?.current?.aqi || 42,
    category: weatherData?.current?.aqiStatus || "Good",
    pm25Value: weatherData?.current?.pm25 || 35,
    pm10Value: weatherData?.current?.pm10 || 50,
    ozoneValue: 22,
    pollenLevel: "Low",
    uvIndex: weatherData?.current?.uv || 3,
    actionGuideline: "Air quality is ideal for outdoor activities."
  };

  const aqi = health.aqi || 42;
  const ozone = health.ozoneValue || 22;
  const pm25 = health.pm25Value || 35;
  const pm10 = health.pm10Value || 50;

  // Normalized gauge angle (0 to 180 degrees) based on AQI up to 300
  const normalizedAqi = Math.min(300, Math.max(0, aqi));
  const needleAngle = (normalizedAqi / 300) * 180; // 0 (left) to 180 (right)

  // Determine status color
  const statusColor = aqi <= 50 ? '#00E676' : aqi <= 100 ? '#FFD600' : aqi <= 200 ? '#FF6D00' : '#FF3D00';
  const statusLabel = aqi <= 50 ? 'Good' : aqi <= 100 ? 'Moderate' : aqi <= 200 ? 'Poor' : 'Hazardous';

  // SVG Gauge calculations
  const radius = 70;
  const strokeWidth = 14;
  const cx = 95;
  const cy = 85;

  return (
    <div 
      onClick={() => onSelect?.('health_aqi')}
      className="mausam-card-interactive p-5 cursor-pointer relative overflow-hidden group select-none transition-all duration-300"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            AQI Deep Dive
          </h4>
          <span className="text-[10px] text-slate-400">National Air Quality Gauge</span>
        </div>

        <WidgetHeaderActions widgetId="health_aqi" />
      </div>

      {/* 1. Semicircle Rainbow Radial Gauge (Matching UI Specification) */}
      <div className="mausam-subcard p-4 flex flex-col items-center justify-center relative mb-3">
        <div className="relative w-48 h-28 flex items-center justify-center">
          <svg viewBox="0 0 190 100" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="aqiRainbow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00E676" />
                <stop offset="35%" stopColor="#FFD600" />
                <stop offset="70%" stopColor="#FF6D00" />
                <stop offset="100%" stopColor="#FF3D00" />
              </linearGradient>
              <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Track */}
            <path
              d="M 25 85 A 70 70 0 0 1 165 85"
              fill="none"
              stroke="#1F2B48"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />

            {/* Rainbow Arc */}
            <path
              d="M 25 85 A 70 70 0 0 1 165 85"
              fill="none"
              stroke="url(#aqiRainbow)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              filter="url(#gaugeGlow)"
            />

            {/* Needle Pivot & Arm */}
            <g transform={`rotate(${needleAngle - 90}, ${cx}, ${cy})`}>
              <line 
                x1={cx} 
                y1={cy} 
                x2={cx} 
                y2={cy - 52} 
                stroke="#FFFFFF" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
              />
              <circle cx={cx} cy={cy} r="4.5" fill="#FFFFFF" />
            </g>

            {/* Scale Min / Max markers */}
            <text x="22" y="96" fill="#64748B" fontSize="9" fontWeight="600">0</text>
            <text x="156" y="96" fill="#64748B" fontSize="9" fontWeight="600">300+</text>
          </svg>

          {/* Central AQI Readout */}
          <div className="absolute bottom-1 flex flex-col items-center">
            <span className="text-xl font-black text-white tracking-tight leading-none">AQI</span>
            <span 
              className="text-xs font-bold mt-0.5 tracking-wide uppercase"
              style={{ color: statusColor }}
            >
              {statusLabel}
            </span>
          </div>
        </div>

        {/* Mini pagination indicator dots */}
        <div className="flex items-center gap-1 mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
          <span className="w-1 h-1 rounded-full bg-slate-600" />
        </div>
      </div>

      {/* 2. Three Modular Pollutant Metrics (PM2.5, PM10, Ozone) */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {/* PM2.5 */}
        <div className="mausam-subcard p-2.5 flex flex-col items-center text-center">
          <Activity className="w-4 h-4 text-accent-cyan mb-1" />
          <span className="text-[10px] text-slate-400 font-medium">PM2.5</span>
          <span className="text-base font-extrabold text-white mt-0.5">{pm25}</span>
          <span className="text-[8px] text-slate-500">µg/m³</span>
        </div>

        {/* PM10 */}
        <div className="mausam-subcard p-2.5 flex flex-col items-center text-center">
          <Wind className="w-4 h-4 text-accent-yellow mb-1" />
          <span className="text-[10px] text-slate-400 font-medium">PM10</span>
          <span className="text-base font-extrabold text-white mt-0.5">{pm10}</span>
          <span className="text-[8px] text-slate-500">µg/m³</span>
        </div>

        {/* Ozone */}
        <div className="mausam-subcard p-2.5 flex flex-col items-center text-center">
          <Gauge className="w-4 h-4 text-accent-green mb-1" />
          <span className="text-[10px] text-slate-400 font-medium">Ozone</span>
          <span className="text-base font-extrabold text-white mt-0.5">{ozone}</span>
          <span className="text-[8px] text-slate-500">ppb</span>
        </div>
      </div>

      {/* 3. 24H Historical AQI Smooth Curved Wave Graph */}
      <div className="mausam-subcard p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-300">24H Historical AQI</span>
          <span className="text-[9px] font-semibold text-accent-green px-1.5 py-0.5 rounded bg-accent-green/10 border border-accent-green/20">
            Realtime
          </span>
        </div>

        <div className="relative h-20 w-full">
          <svg viewBox="0 0 280 80" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="aqiHistoryGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF6D00" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#00E676" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#00E676" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="aqiStrokeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00E676" />
                <stop offset="60%" stopColor="#FF6D00" />
                <stop offset="100%" stopColor="#00E5FF" />
              </linearGradient>
            </defs>

            {/* Subtle Horizontal Grid lines */}
            <line x1="25" y1="15" x2="275" y2="15" stroke="#1F2B48" strokeDasharray="3 3" strokeWidth="0.75" />
            <line x1="25" y1="40" x2="275" y2="40" stroke="#1F2B48" strokeDasharray="3 3" strokeWidth="0.75" />
            <line x1="25" y1="65" x2="275" y2="65" stroke="#1F2B48" strokeDasharray="3 3" strokeWidth="0.75" />

            {/* Y Axis Numbers */}
            <text x="5" y="18" fill="#475569" fontSize="7" fontWeight="bold">200</text>
            <text x="5" y="43" fill="#475569" fontSize="7" fontWeight="bold">100</text>
            <text x="12" y="68" fill="#475569" fontSize="7" fontWeight="bold">0</text>

            {/* Smooth Curved Area Under Curve */}
            <path
              d="M 25 65 Q 60 62, 90 55 T 150 48 T 190 22 T 225 45 T 275 60 L 275 75 L 25 75 Z"
              fill="url(#aqiHistoryGradient)"
            />

            {/* Smooth Glowing Path Line */}
            <path
              d="M 25 65 Q 60 62, 90 55 T 150 48 T 190 22 T 225 45 T 275 60"
              fill="none"
              stroke="url(#aqiStrokeGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Peak Tag Marker */}
            <g transform="translate(190, 22)">
              <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" stroke="#FF6D00" strokeWidth="2" />
              <rect x="-14" y="-18" width="28" height="12" rx="4" fill="#FF6D00" />
              <text x="0" y="-9.5" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle">
                AQI
              </text>
            </g>
          </svg>

          {/* Time markers */}
          <div className="flex justify-between px-6 text-[8px] text-slate-500 font-medium mt-1">
            <span>4 hrs</span>
            <span>8 hrs</span>
            <span>12 hrs</span>
            <span>16 hrs</span>
            <span>20 hrs</span>
            <span>24 hrs</span>
          </div>
        </div>
      </div>

      {/* Drill-down prompt */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-accent-green transition">
        <span>Tap to inspect health advisory & trends</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </div>
    </div>
  );
}
