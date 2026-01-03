import { create } from "twrnc";

// Create tw with custom colors
const tw = create({
  theme: {
    extend: {
      colors: {
        // Brand colors
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
    },
  },
});

export default tw;
