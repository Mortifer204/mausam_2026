import React from 'react';
import { HeartPulse, TrendingUp, ExternalLink, Smile, Meh, Frown } from 'lucide-react';
import { usePersonalization } from '../../context/PersonalizationContext';
import { WidgetHeaderActions } from './WidgetHeaderActions';

export function HealthAqiWidget({ weatherData, onSelect, isHero = false }) {
  const { pinnedWidgetIds } = usePersonalization();
  const isPinned = pinnedWidgetIds.includes('health_aqi');

  const health = weatherData?.specialized?.health || {
    aqi: weatherData?.current?.aqi || 27,
    category: weatherData?.current?.aqiStatus || "Good",
    actionGuideline: "Air quality is favorable for outdoor activities."
  };

  const aqi = weatherData?.current?.aqi ?? health.aqi ?? 27;
  const category = weatherData?.current?.aqiStatus || health.category || (aqi <= 50 ? "Good" : aqi <= 100 ? "Satisfactory" : aqi <= 200 ? "Moderate" : "Poor");
  const guideline = health.actionGuideline || "Air quality is favorable for outdoor activities.";

  // Status color logic based on AQI (official tiers)
  const isGood = aqi <= 50;
  const isSatisfactory = aqi > 50 && aqi <= 100;
  const isGoodOrSatisfactory = aqi <= 100;
  const isModerate = aqi > 100 && aqi <= 200;
  const isPoor = aqi > 200 && aqi <= 300;
  const isVeryPoorOrSevere = aqi > 300;
  
  // Dynamic arc bar color & gradient
  const arcColors = isGood
    ? { start: '#34D399', end: '#10B981', glow: 'rgba(16,185,129,0.4)' }
    : isSatisfactory
    ? { start: '#2DD4BF', end: '#059669', glow: 'rgba(5,150,105,0.4)' }
    : isModerate
    ? { start: '#FBBF24', end: '#F59E0B', glow: 'rgba(245,158,11,0.4)' }
    : isPoor
    ? { start: '#FB923C', end: '#EA580C', glow: 'rgba(234,88,12,0.4)' }
    : { start: '#F87171', end: '#E11D48', glow: 'rgba(225,29,72,0.4)' };

  const strokeColor = arcColors.end;

  // Arc Gauge Geometry (Semi-circle from 180° to 360°)
  // Center: (75, 78), Radius: 62. Perimeter of semi-circle = Math.PI * 62 = 194.78
  const arcLength = 194.78;
  const progressRatio = Math.min(1, Math.max(0, aqi / 500));
  const strokeDashoffset = arcLength * (1 - progressRatio);

  return (
    <div 
      onClick={() => onSelect?.('health_aqi')}
      className="mausam-card-interactive p-4 sm:p-5 cursor-pointer relative overflow-hidden group select-none transition-all duration-300"
    >
      {/* 1. Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Beveled glowing square badge matching reference */}
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400/25 to-emerald-700/20 border border-emerald-400/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] flex items-center justify-center text-emerald-300 flex-shrink-0">
            <HeartPulse className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Air Quality & Respiratory
            </h4>
            <span className="text-[10px] text-slate-400">National AQI Index</span>
          </div>
        </div>

        <WidgetHeaderActions widgetId="health_aqi" />
      </div>

      {/* 2. Middle Row: Arc Gauge + Status Card */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 mb-3">
        {/* Left: Horseshoe Arc Gauge (Compact & aligned) */}
        <div className="w-[82px] sm:w-[98px] flex-shrink-0 flex items-center justify-center py-0.5">
          <svg className="w-full h-auto select-none overflow-visible" viewBox="0 0 200 150">
            <defs>
              <linearGradient id="aqiHorseshoeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={arcColors.start} />
                <stop offset="100%" stopColor={arcColors.end} />
              </linearGradient>
            </defs>

            {/* Background Visible Arc Track (224° extended horseshoe curvature) */}
            <path
              d="M 31.4 117.7 A 74 74 0 1 1 168.6 117.7"
              fill="none"
              stroke="rgba(255, 255, 255, 0.16)"
              strokeWidth="11"
              strokeLinecap="round"
            />

            {/* Animated Active Progress Arc */}
            <path
              d="M 31.4 117.7 A 74 74 0 1 1 168.6 117.7"
              fill="none"
              stroke="url(#aqiHorseshoeGrad)"
              strokeWidth="11.5"
              strokeLinecap="round"
              strokeDasharray={289.4}
              strokeDashoffset={289.4 * (1 - Math.min(1, Math.max(0, aqi / 500)))}
              className="transition-all duration-1000 ease-out"
            />

            {/* Centered Large Bold Numeral filling dome, lowered */}
            <text
              x="100"
              y="88"
              textAnchor="middle"
              dominantBaseline="middle"
              fill={strokeColor}
              fontSize="52"
              fontWeight="900"
              letterSpacing="-0.03em"
              className="font-sans"
              style={{ filter: `drop-shadow(0 0 14px ${isGoodOrSatisfactory ? 'rgba(16,185,129,0.45)' : isModerate ? 'rgba(245,158,11,0.45)' : 'rgba(244,63,94,0.45)'})` }}
            >
              {aqi}
            </text>

            {/* AQI text nestled lowered below the number */}
            <text
              x="100"
              y="120"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#F1F5F9"
              fontSize="15"
              fontWeight="800"
              letterSpacing="0.06em"
              className="font-sans"
            >
              AQI
            </text>

            {/* 0 and 500 Min/Max Markers directly aligned beneath terminals */}
            <text
              x="31.4"
              y="138"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#94A3B8"
              fontSize="13"
              fontWeight="600"
              className="font-sans"
            >
              0
            </text>
            <text
              x="168.6"
              y="138"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#94A3B8"
              fontSize="13"
              fontWeight="600"
              className="font-sans"
            >
              500
            </text>
          </svg>
        </div>

        {/* Right: Status Pill Card with Green Smiley & Description (Spacious flex layout with ample right padding) */}
        <div className={`flex-1 min-w-0 rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 relative overflow-hidden flex flex-col justify-center border ${
          isGoodOrSatisfactory 
            ? 'bg-gradient-to-br from-emerald-950/45 via-emerald-900/20 to-teal-950/30 border-emerald-500/25 shadow-[inset_0_1px_1px_rgba(16,185,129,0.15)]'
            : isModerate 
            ? 'bg-gradient-to-br from-amber-950/45 via-amber-900/20 to-yellow-950/30 border-amber-500/25 shadow-[inset_0_1px_1px_rgba(245,158,11,0.15)]'
            : 'bg-gradient-to-br from-rose-950/45 via-rose-900/20 to-orange-950/30 border-rose-500/25 shadow-[inset_0_1px_1px_rgba(244,63,94,0.15)]'
        }`}>
          {/* Dynamic Decorative Vector Illustration based on AQI level */}
          {isGoodOrSatisfactory ? (
            /* Good/Satisfactory: Lush Grass Blades & Leaves */
            <svg className="absolute bottom-0 right-0 w-24 h-20 pointer-events-none opacity-25 text-emerald-400" viewBox="0 0 100 80" fill="currentColor">
              <path d="M70 80 C 60 50, 75 25, 95 15 C 85 35, 90 55, 70 80 Z" />
              <path d="M50 80 C 45 60, 55 42, 70 32 C 60 48, 62 62, 50 80 Z" />
              <path d="M85 80 C 82 62, 90 48, 100 40 C 95 55, 96 68, 85 80 Z" />
              <path d="M30 80 Q 60 72 100 75 L 100 80 Z" opacity="0.6" />
            </svg>
          ) : isModerate ? (
            /* Moderate: Urban City Skyline with gentle haze / building silhouettes */
            <svg className="absolute bottom-0 right-0 w-28 h-20 pointer-events-none opacity-25 text-amber-400" viewBox="0 0 120 80" fill="currentColor">
              {/* Building silhouettes */}
              <rect x="25" y="48" width="16" height="32" rx="1.5" />
              <rect x="44" y="32" width="20" height="48" rx="2" />
              <rect x="67" y="22" width="18" height="58" rx="2" />
              <rect x="88" y="38" width="22" height="42" rx="2" />
              {/* Spire on tallest building */}
              <line x1="76" y1="12" x2="76" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              {/* Tiny building windows */}
              <circle cx="50" cy="40" r="1.5" fill="#000" opacity="0.4" />
              <circle cx="58" cy="40" r="1.5" fill="#000" opacity="0.4" />
              <circle cx="50" cy="50" r="1.5" fill="#000" opacity="0.4" />
              <circle cx="58" cy="50" r="1.5" fill="#000" opacity="0.4" />
              <circle cx="73" cy="30" r="1.5" fill="#000" opacity="0.4" />
              <circle cx="79" cy="30" r="1.5" fill="#000" opacity="0.4" />
              <circle cx="73" cy="40" r="1.5" fill="#000" opacity="0.4" />
              <circle cx="79" cy="40" r="1.5" fill="#000" opacity="0.4" />
              {/* Soft ground line */}
              <path d="M15 80 Q 60 74 120 76 L 120 80 Z" opacity="0.8" />
            </svg>
          ) : (
            /* Poor / Severe / Unhealthy: Industrial Chimneys / Factory Smokestacks with Smog Plumes */
            <svg className="absolute bottom-0 right-0 w-28 h-22 pointer-events-none opacity-25 text-rose-400" viewBox="0 0 120 85" fill="currentColor">
              {/* Industrial plant silhouettes */}
              <rect x="30" y="52" width="28" height="33" rx="1.5" />
              {/* Chimney 1 */}
              <path d="M62 85 L65 38 L75 38 L78 85 Z" />
              {/* Chimney 2 (taller) */}
              <path d="M82 85 L85 26 L96 26 L99 85 Z" />
              {/* Smoke / Smog clouds billowing out */}
              <path d="M66 32 C60 26, 62 18, 70 18 C74 12, 84 14, 86 20 C92 18, 98 22, 95 28 C90 32, 75 34, 66 32 Z" opacity="0.7" />
              <path d="M84 20 C82 12, 90 6, 98 8 C105 4, 114 9, 112 16 C118 18, 116 26, 108 26 Z" opacity="0.5" />
              {/* Ground level */}
              <path d="M20 85 Q 60 81 120 82 L 120 85 Z" opacity="0.8" />
            </svg>
          )}

          <div className="relative z-10 flex items-start gap-2.5 sm:gap-3">
            {/* Green Glowing Smile Icon Badge */}
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
              isGoodOrSatisfactory 
                ? 'bg-emerald-400/20 border border-emerald-400/35 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                : isModerate 
                ? 'bg-amber-400/20 border border-amber-400/35 text-amber-400' 
                : 'bg-rose-400/20 border border-rose-400/35 text-rose-400'
            }`}>
              {isGoodOrSatisfactory ? (
                <Smile className="w-5 h-5 stroke-[2.3]" />
              ) : isModerate ? (
                <Meh className="w-5 h-5 stroke-[2.3]" />
              ) : (
                <Frown className="w-5 h-5 stroke-[2.3]" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-[15px] sm:text-lg font-bold text-white tracking-tight truncate leading-tight">
                {category}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-300 font-medium leading-snug sm:leading-relaxed mt-1 line-clamp-3">
                {aqi <= 50 
                  ? "Air quality is satisfactory and poses little or no risk."
                  : aqi <= 100 
                  ? "Air quality is acceptable and poses little or no risk."
                  : aqi <= 200 
                  ? "Moderate air quality; sensitive people should take care."
                  : "Poor air quality; minimize strenuous outdoor cardio."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Advisory Pill Banner with Landscape Graphic (Sleek layout without shield icon) */}
      <div className="py-2.5 px-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-between relative overflow-hidden mb-3">
        <div className="flex-1 min-w-0 pr-3">
          <p className="text-xs text-slate-200 font-medium leading-relaxed">
            {guideline}
          </p>
        </div>

        {/* Outdoor Landscape Artwork on the Right */}
        <svg className="w-28 h-12 flex-shrink-0 pointer-events-none" viewBox="0 0 120 50" fill="none">
          {/* Glowing Sun with Rays */}
          <circle cx="95" cy="18" r="6" fill="#FACC15" />
          <line x1="95" y1="8" x2="95" y2="11" stroke="#FACC15" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="95" y1="25" x2="95" y2="28" stroke="#FACC15" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="85" y1="18" x2="88" y2="18" stroke="#FACC15" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="102" y1="18" x2="105" y2="18" stroke="#FACC15" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="88" y1="11" x2="90" y2="13" stroke="#FACC15" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="100" y1="23" x2="102" y2="25" stroke="#FACC15" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="88" y1="25" x2="90" y2="23" stroke="#FACC15" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="100" y1="13" x2="102" y2="11" stroke="#FACC15" strokeWidth="1.8" strokeLinecap="round" />

          {/* Stylized Clouds */}
          <path d="M62 18 Q65 14 70 14 Q73 11 78 13 Q82 13 83 18 Z" fill="#334155" opacity="0.6" />
          <path d="M98 38 Q100 35 104 35 Q107 33 111 34 Q114 34 115 38 Z" fill="#334155" opacity="0.4" />

          {/* Rolling Hills */}
          <path d="M25 50 Q65 26 120 40 L120 50 Z" fill="#064e3b" />
          <path d="M40 50 Q75 32 120 36 L120 50 Z" fill="#047857" opacity="0.85" />
          <path d="M60 50 Q90 38 120 42 L120 50 Z" fill="#10B981" opacity="0.35" />

          {/* Trees */}
          <rect x="48" y="34" width="2" height="12" fill="#1e293b" />
          <circle cx="49" cy="32" r="6" fill="#059669" />
          <rect x="63" y="36" width="2" height="10" fill="#1e293b" />
          <circle cx="64" cy="34" r="5" fill="#10B981" />
        </svg>
      </div>

      {/* 4. Footer Link */}
      <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold group-hover:text-emerald-300 transition">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Tap to inspect 24h pollutant curve</span>
        </div>
        <ExternalLink className="w-4 h-4 text-emerald-400" />
      </div>
    </div>
  );
}
