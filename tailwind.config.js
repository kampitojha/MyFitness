/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0284C7',
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
          950: '#082F49',
          soft: '#F0F9FF',
          softText: '#0369A1',
        },
        accent: {
          DEFAULT: '#BAE6FD',
        },
        background: {
          DEFAULT: '#FFFFFF',
          dark: '#030712',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#0B132B',
          alt: '#F0F9FF',
        },
        ink: {
          DEFAULT: '#0C1120',
          secondary: '#475569',
          muted: '#94A3B8',
        },
        border: '#E2E8F0',
        success: '#0EA5E9',
        warning: '#F59E0B',
        danger: {
          DEFAULT: '#EF4444',
          soft: '#FEE2E2',
        },
        info: '#38BDF8',
      },
      fontFamily: {
        display: ['-apple-system', 'SF Pro Display', 'Inter', 'sans-serif'],
        body: ['-apple-system', 'SF Pro Text', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};