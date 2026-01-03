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
        // GRHIIT brand colors
        "grhiit-white": "#FAFAFA",
        "grhiit-black": "#0A0A0A",
        "grhiit-black-warm": "#141210",
        "grhiit-red": "#EF4444",
        "grhiit-red-dark": "#DC2626",
        // Semantic aliases
        background: "#0A0A0A",
        surface: "#141210",
        border: "#262626",
        primary: "#FAFAFA",
        secondary: "#A3A3A3",
        accent: "#EF4444",
        "accent-dark": "#DC2626",
        success: "#22C55E",
        warning: "#F59E0B",
      },
      fontFamily: {
        sans: ['System'],
        mono: ['SpaceMono'],
      },
    },
  },
  plugins: [],
};
