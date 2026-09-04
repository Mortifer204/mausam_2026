// Atmospheric theme engine for Mausam
// Generates dynamic background gradients, particles, and IMD alert badges

export const WEATHER_THEMES = {
  clear: {
    name: "Clear / Sunny",
    gradient: "from-sky-900/90 via-[#0c2340]/95 to-[#060e1a]",
    accentGlow: "rgba(56, 189, 248, 0.25)",
    skyTone: "text-amber-300",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  },
  sunny: {
    name: "Bright Sun",
    gradient: "from-amber-950/70 via-[#0b1f3a]/95 to-[#050b14]",
    accentGlow: "rgba(251, 191, 36, 0.25)",
    skyTone: "text-amber-400",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  },
  pleasant: {
    name: "Pleasant & Breezy",
    gradient: "from-emerald-950/70 via-[#0a2238]/95 to-[#050e18]",
    accentGlow: "rgba(52, 211, 153, 0.25)",
    skyTone: "text-emerald-300",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  },
  rain: {
    name: "Monsoon Rain",
    gradient: "from-slate-900/95 via-[#0d2137]/95 to-[#060c16]",
    accentGlow: "rgba(56, 189, 248, 0.2)",
    skyTone: "text-cyan-300",
    badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
  },
  thunder: {
    name: "Squall & Thunderstorm",
    gradient: "from-zinc-950 via-[#131728]/95 to-[#080912]",
    accentGlow: "rgba(249, 115, 22, 0.3)",
    skyTone: "text-orange-400",
    badge: "bg-orange-500/20 text-orange-400 border-orange-500/40",
  },
  night: {
    name: "Clear Night",
    gradient: "from-indigo-950/80 via-[#070b18]/95 to-[#02040a]",
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
  return WEATHER_THEMES[conditionCode] || WEATHER_THEMES.clear;
}
