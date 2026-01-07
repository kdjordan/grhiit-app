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
        "grhiit-black-pure": "#000000",
        "grhiit-black-warm": "#141210",
        "grhiit-red": "#EF4444",
        "grhiit-red-dark": "#DC2626",
        "grhiit-red-deep": "#991B1B",
        // Semantic aliases
        background: "#0A0A0A",
        "background-pure": "#000000",
        surface: "#141414",
        "surface-dark": "#141210",
        border: "#262626",
        primary: "#FAFAFA",
        secondary: "#A3A3A3",
        muted: "#6B7280",
        accent: "#EF4444",
        "accent-dark": "#DC2626",
        "accent-deep": "#991B1B",
        success: "#22C55E",
        warning: "#F59E0B",
        "warning-bg": "rgba(245, 158, 11, 0.2)",
      },
      fontFamily: {
        sans: ['System'],
        mono: ['SpaceMono'],
      },
    },
  },
  plugins: [],
};
