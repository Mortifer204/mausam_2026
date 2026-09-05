import React from 'react';

/**
 * Weather3DIcon - High-fidelity 3D-styled SVG weather illustration
 * Matches the volumetric, glassy 3D aesthetic shown in the redesign specification
 */
export function Weather3DIcon({ conditionCode = '', condition = '', className = 'w-14 h-14' }) {
  const code = (conditionCode || '').toLowerCase();
  const text = (condition || '').toLowerCase();

  // Determine icon type
  const isThunder = code.includes('thunder') || text.includes('thunder') || text.includes('squall') || text.includes('storm');
  const isRain = !isThunder && (code.includes('rain') || text.includes('rain') || text.includes('drizzle') || text.includes('shower'));
  const isSnow = code.includes('snow') || text.includes('snow') || text.includes('ice');
  const isFog = code.includes('fog') || code.includes('mist') || text.includes('fog') || text.includes('mist') || text.includes('haze');
  const isSunny = !isThunder && !isRain && (code === 'sunny' || (code === 'clear' && !text.includes('cloud')) || text.includes('sunny'));
  const isCloudyOnly = code === 'overcast' || text.includes('overcast');

  const idPrefix = `w3d-${Math.random().toString(36).substring(2, 7)}`;

  // 1. Thunderstorm (Dark stormy cloud + glowing 3D lightning + raindrops)
  if (isThunder) {
    return (
      <svg className={`${className} filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`${idPrefix}-storm-cloud`} x1="20" y1="15" x2="80" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="45%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
          <linearGradient id={`${idPrefix}-bolt`} x1="45" y1="45" x2="55" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id={`${idPrefix}-drop`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#67E8F9" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <filter id={`${idPrefix}-bolt-glow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <line x1="26" y1="68" x2="20" y2="82" stroke={`url(#${idPrefix}-drop)`} strokeWidth="3.5" strokeLinecap="round" />
        <line x1="68" y1="68" x2="62" y2="82" stroke={`url(#${idPrefix}-drop)`} strokeWidth="3.5" strokeLinecap="round" />

        <g>
          <path d="M32 58 A 16 16 0 0 1 54 36 A 20 20 0 0 1 82 50 A 14 14 0 0 1 76 64 Z" fill="#0F172A" opacity="0.5" />
          <path 
            d="M30 64 C23 64 18 59 18 52 C18 46 22 41 28 40 C29 30 38 22 49 22 C59 22 67 29 70 38 C75 38 80 43 80 49 C80 56 75 64 68 64 Z" 
            fill={`url(#${idPrefix}-storm-cloud)`} 
          />
          <path 
            d="M28 40 C32 30 40 24 49 24 C57 24 64 30 67 38" 
            stroke="rgba(255,255,255,0.4)" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            fill="none" 
          />
        </g>

        <polygon 
          points="50,44 38,62 47,62 41,84 62,59 52,59" 
          fill={`url(#${idPrefix}-bolt)`} 
          filter={`url(#${idPrefix}-bolt-glow)`} 
        />
        <polygon points="49,47 41,60 47,60 43,76 56,59 50,59" fill="#FFFBEB" opacity="0.6" />
      </svg>
    );
  }

  // 2. Rain / Drizzle (Matches card 2 from reference image)
  if (isRain) {
    return (
      <svg className={`${className} filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`${idPrefix}-rain-cloud`} x1="25" y1="16" x2="75" y2="68" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="55%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
          <linearGradient id={`${idPrefix}-rain-pill`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7DD3FC" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <filter id={`${idPrefix}-cloud-shadow`} x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0F172A" floodOpacity="0.45" />
          </filter>
        </defs>

        <g filter={`url(#${idPrefix}-cloud-shadow)`}>
          <path 
            d="M32 62 C23 62 17 56 17 48 C17 41 22 35 29 34 C31 23 41 16 52 16 C63 16 72 23 75 33 C81 34 86 39 86 46 C86 54 80 62 72 62 Z" 
            fill={`url(#${idPrefix}-rain-cloud)`} 
          />
          <path 
            d="M32 34 C36 24 43 18 52 18 C61 18 69 24 72 33" 
            stroke="rgba(255,255,255,0.9)" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            fill="none" 
          />
          <path 
            d="M20 45 C20 39 24 35 29 35" 
            stroke="rgba(255,255,255,0.7)" 
            strokeWidth="2" 
            strokeLinecap="round" 
            fill="none" 
          />
        </g>

        {/* 3 Glossy Diagonal Raindrops matching reference */}
        <g transform="translate(4, 3)">
          <rect x="25" y="68" width="5.5" height="15" rx="2.75" transform="rotate(24 25 68)" fill={`url(#${idPrefix}-rain-pill)`} />
          <rect x="42" y="68" width="5.5" height="15" rx="2.75" transform="rotate(24 42 68)" fill={`url(#${idPrefix}-rain-pill)`} />
          <rect x="59" y="68" width="5.5" height="15" rx="2.75" transform="rotate(24 59 68)" fill={`url(#${idPrefix}-rain-pill)`} />
        </g>
      </svg>
    );
  }

  // 3. Bright Sun
  if (isSunny) {
    return (
      <svg className={`${className} filter drop-shadow-[0_8px_18px_rgba(245,158,11,0.35)]`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id={`${idPrefix}-sun-sphere`} cx="38%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="35%" stopColor="#FDE047" />
            <stop offset="70%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </radialGradient>
          <linearGradient id={`${idPrefix}-sun-ray`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        <g opacity="0.85" stroke={`url(#${idPrefix}-sun-ray)`} strokeWidth="4" strokeLinecap="round">
          <line x1="50" y1="12" x2="50" y2="20" />
          <line x1="50" y1="80" x2="50" y2="88" />
          <line x1="12" y1="50" x2="20" y2="50" />
          <line x1="80" y1="50" x2="88" y2="50" />
          <line x1="23" y1="23" x2="29" y2="29" />
          <line x1="71" y1="71" x2="77" y2="77" />
          <line x1="23" y1="77" x2="29" y2="71" />
          <line x1="71" y1="29" x2="77" y2="23" />
        </g>

        <circle cx="50" cy="50" r="26" fill={`url(#${idPrefix}-sun-sphere)`} />
        <ellipse cx="42" cy="40" rx="9" ry="5" transform="rotate(-30 42 40)" fill="rgba(255,255,255,0.7)" />
      </svg>
    );
  }

  // 4. Overcast / Cloudy
  if (isCloudyOnly) {
    return (
      <svg className={`${className} filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)]`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`${idPrefix}-c1`} x1="20" y1="20" x2="70" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
          <linearGradient id={`${idPrefix}-c2`} x1="35" y1="30" x2="85" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>
        </defs>
        <path d="M42 48 C36 48 31 43 31 38 C31 32 35 28 40 27 C42 19 50 14 59 14 C67 14 74 19 76 27 C81 28 85 32 85 38 C85 44 80 48 74 48 Z" fill={`url(#${idPrefix}-c2)`} opacity="0.8" />
        <path d="M28 66 C19 66 13 60 13 52 C13 45 18 39 25 38 C27 27 37 20 48 20 C59 20 68 27 71 37 C77 38 82 43 82 50 C82 58 76 66 68 66 Z" fill={`url(#${idPrefix}-c1)`} />
        <path d="M27 38 C31 28 38 22 48 22 C57 22 65 28 68 37" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  // 5. Default / Sun Behind Cloud with soft wave (Matches card 1 from reference image)
  return (
    <svg className={`${className} filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`${idPrefix}-sun-bg`} cx="38%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="40%" stopColor="#FDE047" />
          <stop offset="75%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </radialGradient>
        <linearGradient id={`${idPrefix}-main-cloud`} x1="25" y1="20" x2="75" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#F1F5F9" />
          <stop offset="85%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
        <linearGradient id={`${idPrefix}-wave`} x1="20" y1="74" x2="70" y2="74" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.8)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
        </linearGradient>
      </defs>

      {/* 3D Sun Peeking from Top-Left */}
      <g>
        <circle cx="34" cy="34" r="18" fill={`url(#${idPrefix}-sun-bg)`} />
        <ellipse cx="29" cy="28" rx="6" ry="3.5" transform="rotate(-30 29 28)" fill="rgba(255,255,255,0.8)" />
      </g>

      {/* 3D Fluffy Cloud Body */}
      <g>
        <path 
          d="M29 65 C20 65 14 59 14 51 C14 44 19 38 26 37 C28 26 39 18 51 18 C63 18 72 26 75 37 C82 38 87 44 87 51 C87 60 81 65 72 65 Z" 
          fill="#0F172A" 
          opacity="0.3" 
          transform="translate(0, 3)" 
        />
        <path 
          d="M29 64 C20 64 14 58 14 50 C14 43 19 37 26 36 C28 25 39 18 51 18 C63 18 72 25 75 36 C82 37 87 43 87 50 C87 59 81 64 72 64 Z" 
          fill={`url(#${idPrefix}-main-cloud)`} 
        />
        <path 
          d="M31 35 C35 24 43 20 51 20 C60 20 68 25 72 35" 
          stroke="rgba(255,255,255,0.95)" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          fill="none" 
        />
        <path 
          d="M17 48 C17 41 21 37 27 37" 
          stroke="rgba(255,255,255,0.75)" 
          strokeWidth="2" 
          strokeLinecap="round" 
          fill="none" 
        />
      </g>

      {/* Wind / wave line underneath matching reference */}
      <path 
        d="M28 73 Q36 69 44 73 T60 73" 
        stroke={`url(#${idPrefix}-wave)`} 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        fill="none" 
      />
    </svg>
  );
}
