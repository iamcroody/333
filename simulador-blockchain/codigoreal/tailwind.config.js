/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        luxury: ['Cinzel', 'serif'],
        tech: ['Space Mono', 'monospace'],
      },
      colors: {
        gold: {
          100: '#F9F1D8',
          200: '#F0DEAA',
          300: '#E6CB7D',
          400: '#DDB852',
          500: '#D4A528', // Base Gold
          600: '#AA8420',
          700: '#806318',
          800: '#554210',
          900: '#2B2108',
        }
      },
      animation: {
        'shine': 'shine 2s linear infinite',
      },
      keyframes: {
        shine: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        }
      }
    },
  },
  plugins: [],
}