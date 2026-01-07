/**
 * GRHIIT Color Constants
 *
 * Single source of truth for colors. These values mirror tailwind.config.js.
 * Use these for JS contexts (SVG props, dynamic styles) where TW classes don't work.
 *
 * For JSX with className/tw, prefer TW classes: bg-grhiit-red, text-primary, etc.
 */

// Brand colors
export const GRHIIT_WHITE = "#FAFAFA";
export const GRHIIT_BLACK = "#0A0A0A";
export const GRHIIT_BLACK_PURE = "#000000";
export const GRHIIT_BLACK_WARM = "#141210";
export const GRHIIT_RED = "#EF4444";
export const GRHIIT_RED_DARK = "#DC2626";
export const GRHIIT_RED_DEEP = "#991B1B";

// Semantic colors
export const BACKGROUND = "#0A0A0A";
export const BACKGROUND_PURE = "#000000";
export const SURFACE = "#141414";
export const SURFACE_DARK = "#141210";
export const BORDER = "#262626";
export const PRIMARY = "#FAFAFA";
export const SECONDARY = "#A3A3A3";
export const MUTED = "#6B7280";
export const ACCENT = "#EF4444";
export const ACCENT_DARK = "#DC2626";
export const ACCENT_DEEP = "#991B1B";
export const SUCCESS = "#22C55E";
export const WARNING = "#F59E0B";

// Timer phase colors (ring/stroke)
export const TIMER_COLORS = {
  work: GRHIIT_RED,
  rest: PRIMARY,
  countdown: PRIMARY,
} as const;

// Timer background colors
export const TIMER_BG_COLORS = {
  work: ACCENT_DEEP,
  rest: GRHIIT_BLACK,
  transition: GRHIIT_BLACK,
  countdown: SURFACE,
} as const;

// Grouped export for convenience
export const colors = {
  // Brand
  grhiitWhite: GRHIIT_WHITE,
  grhiitBlack: GRHIIT_BLACK,
  grhiitBlackPure: GRHIIT_BLACK_PURE,
  grhiitBlackWarm: GRHIIT_BLACK_WARM,
  grhiitRed: GRHIIT_RED,
  grhiitRedDark: GRHIIT_RED_DARK,
  grhiitRedDeep: GRHIIT_RED_DEEP,
  // Semantic
  background: BACKGROUND,
  backgroundPure: BACKGROUND_PURE,
  surface: SURFACE,
  surfaceDark: SURFACE_DARK,
  border: BORDER,
  primary: PRIMARY,
  secondary: SECONDARY,
  muted: MUTED,
  accent: ACCENT,
  accentDark: ACCENT_DARK,
  accentDeep: ACCENT_DEEP,
  success: SUCCESS,
  warning: WARNING,
} as const;
