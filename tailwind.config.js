/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // GRHIIT brand colors - dark intensity aesthetic
        background: '#0A0A0A',
        surface: '#141414',
        border: '#262626',
        primary: '#FFFFFF',
        secondary: '#A3A3A3',
        accent: '#EF4444', // Red for intensity cues
        success: '#22C55E',
        warning: '#F59E0B',
      },
      fontFamily: {
        sans: ['System'],
        mono: ['SpaceMono'],
      },
    },
  },
  plugins: [],
};
