/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#050505',
          surface: '#0D0D0D',
          card: '#121212',
        },
        primary: {
          DEFAULT: '#8B1E2B',
          hover: '#A92434',
          glow: 'rgba(139, 30, 43, 0.15)',
        },
        secondary: {
          DEFAULT: '#A1A1AA',
          muted: '#71717A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'premium-gradient': 'linear-gradient(135deg, #8B1E2B 0%, #4A0E17 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(139, 30, 43, 0.15)',
        'premium': '0 10px 30px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
