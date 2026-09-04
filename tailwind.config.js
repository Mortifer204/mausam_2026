/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // IMD Official Warning Color Protocol
        imd: {
          green: "#10B981",    // Normal / No Warning
          yellow: "#F59E0B",   // Watch / Be Aware
          orange: "#F97316",   // Alert / Be Prepared
          red: "#EF4444",      // Warning / Take Action
        },
        mausam: {
          dark: "#0B111E",
          canvas: "#0B111E",
          card: "#131B2E",
          cardHover: "#19243C",
          subcard: "#1A233B",
          subcardHover: "#202C48",
          border: "rgba(255, 255, 255, 0.08)",
          borderActive: "rgba(255, 255, 255, 0.16)",
          glow: "rgba(0, 229, 255, 0.15)",
        },
        // High-contrast vibrant visual data accents extracted from design specification
        accent: {
          green: "#00E676",   // Neon Green (Good AQI, Peak health, Active)
          cyan: "#00E5FF",    // Electric Cyan (Moisture, Tides, Water trails)
          yellow: "#FFD600",  // Bright Neon Yellow (Moderate, Lightning, Daylight)
          orange: "#FF6D00",  // Radiant Coral/Orange (Elevated risk, Concert warning)
          red: "#FF3D00",     // Vivid Red (Severe alert, Hazardous AQI)
        }
      },
      borderRadius: {
        '2xl': '1.25rem',    // 20px
        '3xl': '1.75rem',    // 28px
        '4xl': '2.25rem',    // 36px
      },
      boxShadow: {
        'card': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'card-hover': '0 12px 40px 0 rgba(0, 0, 0, 0.6)',
        'subcard': '0 4px 20px 0 rgba(0, 0, 0, 0.25)',
        'glow-cyan': '0 0 20px rgba(0, 229, 255, 0.25)',
        'glow-green': '0 0 20px rgba(0, 230, 118, 0.25)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'Roboto', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
