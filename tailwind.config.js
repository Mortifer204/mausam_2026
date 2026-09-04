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
          dark: "#0a0f1d",
          card: "rgba(18, 25, 44, 0.72)",
          cardHover: "rgba(28, 38, 66, 0.85)",
          border: "rgba(255, 255, 255, 0.12)",
          glow: "rgba(56, 189, 248, 0.15)",
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
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
