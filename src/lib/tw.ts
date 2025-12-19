import { create } from "twrnc";

// Create tw with custom colors
const tw = create({
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A",
        surface: "#141414",
        border: "#262626",
        primary: "#FFFFFF",
        secondary: "#A3A3A3",
        accent: "#EF4444",
        success: "#22C55E",
        warning: "#F59E0B",
      },
    },
  },
});

export default tw;
