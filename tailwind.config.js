/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#22C55E', // Vibrant Neon Green
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          950: '#052E16',
          soft: '#DCFCE7',
          softText: '#166534',
        },
        accent: {
          DEFAULT: '#C0FF00', // Apple Fitness style neon yellow-green
        },
        background: {
          DEFAULT: '#F2F2F7', // iOS light grey
          dark: '#000000', // Pure black for OLED
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#1C1C1E', // iOS dark elevated surface
          alt: '#E5E5EA',
        },
        ink: {
          DEFAULT: '#000000',
          secondary: '#3A3A3C',
          muted: '#8E8E93',
        },
        border: '#E2E5E9',
        success: '#16A34A',
        warning: '#F59E0B',
        danger: {
          DEFAULT: '#DC2626',
          soft: '#FEE2E2',
        },
        info: '#0EA5E9',
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