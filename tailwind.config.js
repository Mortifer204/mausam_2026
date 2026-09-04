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
          dark: "#0B1220",
          canvas: "#0B1220",
          card: "rgba(26, 36, 54, 0.78)",
          cardHover: "rgba(33, 46, 69, 0.88)",
          subcard: "rgba(255, 255, 255, 0.05)",
          subcardHover: "rgba(255, 255, 255, 0.08)",
          border: "rgba(255, 255, 255, 0.08)",
          borderLight: "rgba(255, 255, 255, 0.12)",
          glow: "rgba(6, 182, 212, 0.2)",
        },
        // Design system accents
        accent: {
          cyan: "#06B6D4",    // Primary cyan
          teal: "#2DD4BF",    // Primary teal
          yellow: "#FACC15",  // Secondary warning/solar
          coral: "#F87171",   // Secondary coral/risk
          green: "#22C55E",   // Success / good status
          amber: "#F59E0B",   // Warning status
          red: "#EF4444",     // Danger status
        }
      },
      borderRadius: {
        'xl': '0.875rem',    // 14px
        '2xl': '1rem',       // 16px (nested pills)
        '3xl': '1.5rem',     // 24px (standard cards)
        '4xl': '2rem',       // 32px
      },
      boxShadow: {
        'glass': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
        'glass-hover': '0 16px 36px -8px rgba(0, 0, 0, 0.6)',
        'glow-cyan': '0 0 24px rgba(6, 182, 212, 0.3)',
        'glow-teal': '0 0 24px rgba(45, 212, 191, 0.3)',
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
