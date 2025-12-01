/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "#0B0F14",
        foreground: "#F3F4F6",
        primary: {
          DEFAULT: "#6A5ACD",
          foreground: "#FFFFFF",
          glow: "#8B7DD8",
        },
        secondary: {
          DEFAULT: "#1E293B",
          foreground: "#F3F4F6",
        },
        accent: {
          DEFAULT: "#9D4EDD",
          foreground: "#FFFFFF",
        },
        glass: {
          DEFAULT: "rgba(255, 255, 255, 0.05)",
          border: "rgba(255, 255, 255, 0.1)",
        },
        dark: {
          100: "#1A1F2E",
          200: "#151A26",
          300: "#0F1419",
          400: "#0B0F14",
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-dark': 'linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%)',
        'gradient-purple': 'linear-gradient(135deg, rgba(106, 90, 205, 0.2) 0%, rgba(157, 78, 221, 0.2) 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(106, 90, 205, 0.3)',
        'glow-lg': '0 0 40px rgba(106, 90, 205, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'inner-glow': 'inset 0 0 20px rgba(106, 90, 205, 0.2)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-up': 'fadeUp 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(106, 90, 205, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(106, 90, 205, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
