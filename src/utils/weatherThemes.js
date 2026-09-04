// Atmospheric theme engine for Mausam
// Generates dynamic background gradients, particles, and IMD alert badges

export const WEATHER_THEMES = {
  clear: {
    name: "Clear / Sunny",
    gradient: "from-[#1A3F75] via-[#14325C] to-[#0D1F38]",
    bgGradient: "linear-gradient(180deg, #1A3F75 0%, #14325C 50%, #0D1F38 100%)",
    accentGlow: "rgba(56, 189, 248, 0.25)",
    skyTone: "text-amber-300",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  },
  sunny: {
    name: "Bright Sun",
    gradient: "from-[#1F4785] via-[#173868] to-[#102444]",
    bgGradient: "linear-gradient(180deg, #1F4785 0%, #173868 50%, #102444 100%)",
    accentGlow: "rgba(251, 191, 36, 0.25)",
    skyTone: "text-amber-400",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  },
  pleasant: {
    name: "Pleasant & Breezy",
    gradient: "from-[#162E48] via-[#10243B] to-[#0A1828]",
    bgGradient: "linear-gradient(180deg, #162E48 0%, #10243B 50%, #0A1828 100%)",
    accentGlow: "rgba(52, 211, 153, 0.25)",
    skyTone: "text-emerald-300",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  },
  overcast: {
    name: "Overcast & Cloudy",
    gradient: "from-[#1C2E4F] via-[#16253E] to-[#0D1A30]",
    bgGradient: "linear-gradient(180deg, #1C2E4F 0%, #16253E 50%, #0D1A30 100%)",
    accentGlow: "rgba(148, 163, 184, 0.25)",
    skyTone: "text-slate-300",
    badge: "bg-slate-500/20 text-slate-300 border-slate-500/40",
  },
  rain: {
    name: "Monsoon Rain",
    gradient: "from-[#142642] via-[#0F1E35] to-[#0A1729]",
    bgGradient: "linear-gradient(180deg, #142642 0%, #0F1E35 50%, #0A1729 100%)",
    accentGlow: "rgba(6, 182, 212, 0.25)",
    skyTone: "text-cyan-300",
    badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
  },
  thunder: {
    name: "Squall & Thunderstorm",
    gradient: "from-[#15132B] via-[#0F1324] to-[#080D1A]",
    bgGradient: "linear-gradient(180deg, #15132B 0%, #0F1324 50%, #080D1A 100%)",
    accentGlow: "rgba(249, 115, 22, 0.3)",
    skyTone: "text-orange-400",
    badge: "bg-orange-500/20 text-orange-400 border-orange-500/40",
  },
  night: {
    name: "Clear Night",
    gradient: "from-[#10192E] via-[#0B1222] to-[#070C18]",
    bgGradient: "linear-gradient(180deg, #10192E 0%, #0B1222 50%, #070C18 100%)",
    accentGlow: "rgba(129, 140, 248, 0.2)",
    skyTone: "text-indigo-300",
    badge: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
  }
};

export const IMD_ALERT_STYLES = {
  green: {
    label: "NORMAL / ALL CLEAR",
    tagline: "No warning. Normal atmospheric conditions.",
    badgeBg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    dotColor: "bg-emerald-400",
    border: "border-emerald-500/30",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.15)]",
  },
  yellow: {
    label: "WATCH / BE AWARE",
    tagline: "Weather conditions may become hazardous. Stay updated.",
    badgeBg: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    dotColor: "bg-amber-400 animate-pulse",
    border: "border-amber-500/30",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]",
  },
  orange: {
    label: "ALERT / BE PREPARED",
    tagline: "High likelihood of severe weather disruptions. Prepare precautions.",
    badgeBg: "bg-orange-500/20 text-orange-300 border-orange-500/40",
    dotColor: "bg-orange-500 animate-ping",
    border: "border-orange-500/40",
    glow: "shadow-[0_0_25px_rgba(249,115,22,0.25)]",
  },
  red: {
    label: "WARNING / TAKE ACTION",
    tagline: "Extreme meteorological hazard imminent. Follow civil disaster protocols.",
    badgeBg: "bg-rose-500/25 text-rose-300 border-rose-500/50",
    dotColor: "bg-rose-500 animate-ping",
    border: "border-rose-500/50",
    glow: "shadow-[0_0_35px_rgba(239,68,68,0.35)]",
  }
};

export function getThemeForCondition(conditionCode = "clear") {
  if (!conditionCode) return WEATHER_THEMES.clear;
  const c = conditionCode.toLowerCase();
  if (c.includes('thunder') || c.includes('squall')) return WEATHER_THEMES.thunder;
  if (c.includes('rain') || c.includes('drizzle') || c.includes('monsoon')) return WEATHER_THEMES.rain;
  if (c.includes('sun')) return WEATHER_THEMES.sunny;
  if (c.includes('overcast') || c.includes('cloud')) return WEATHER_THEMES.overcast;
  if (c.includes('night')) return WEATHER_THEMES.night;
  if (c.includes('pleasant')) return WEATHER_THEMES.pleasant;
  return WEATHER_THEMES[conditionCode] || WEATHER_THEMES.clear;
}
