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
        "grhiit-red": "#E8110F",
        "grhiit-red-dark": "#B80D0B",
        // Semantic aliases
        background: "#0A0A0A",
        surface: "#141210",
        border: "#262626",
        primary: "#FAFAFA",
        secondary: "#A3A3A3",
        accent: "#E8110F",
        "accent-dark": "#B80D0B",
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
