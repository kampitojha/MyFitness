/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0E7A4A',
          50: '#ECFBF3',
          100: '#D3F6E2',
          200: '#A6EBC5',
          300: '#6FDCA4',
          400: '#38C882',
          500: '#12A964',
          600: '#0E7A4A',
          700: '#0C623C',
          800: '#0A4E31',
          900: '#083F28',
          950: '#042519',
        },
        accent: {
          DEFAULT: '#DCFCE7',
        },
        background: {
          DEFAULT: '#F6F7F8',
          dark: '#0B0D0E',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#14181A',
        },
        ink: {
          DEFAULT: '#101311',
          secondary: '#5E6570',
          muted: '#8A9099',
        },
        success: '#16A34A',
        warning: '#F59E0B',
        danger: '#DC2626',
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