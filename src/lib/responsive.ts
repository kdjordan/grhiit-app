import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 13/14 - most common)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

/**
 * Scale a value based on screen width
 * Use for: horizontal spacing, font sizes, icon sizes
 */
export const scale = (size: number): number => {
  const ratio = SCREEN_WIDTH / BASE_WIDTH;
  return Math.round(size * ratio);
};

/**
 * Scale a value based on screen height
 * Use for: vertical spacing, component heights
 */
export const verticalScale = (size: number): number => {
  const ratio = SCREEN_HEIGHT / BASE_HEIGHT;
  return Math.round(size * ratio);
};

/**
 * Moderate scale - less aggressive scaling for fonts
 * factor: 0.5 = scale half as much (default)
 * Use for: font sizes that shouldn't vary too much
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  const ratio = SCREEN_WIDTH / BASE_WIDTH;
  return Math.round(size + (size * (ratio - 1) * factor));
};

/**
 * Get responsive value based on screen width breakpoints
 */
export const responsive = <T>(small: T, medium: T, large: T): T => {
  if (SCREEN_WIDTH < 375) return small;      // iPhone SE, mini
  if (SCREEN_WIDTH < 414) return medium;     // iPhone 13/14/15
  return large;                               // iPhone Pro Max, Plus
};

/**
 * Screen size info
 */
export const screen = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmall: SCREEN_WIDTH < 375,
  isMedium: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
  isLarge: SCREEN_WIDTH >= 414,
};

/**
 * Common scaled values for consistency
 */
export const sizing = {
  // Timer
  timerSize: responsive(240, 280, 320),
  timerFontSize: responsive(100, 120, 140),
  timerStroke: responsive(6, 8, 10),

  // Typography
  headerLarge: moderateScale(28),
  headerMedium: moderateScale(24),
  headerSmall: moderateScale(20),
  bodyLarge: moderateScale(16),
  bodyMedium: moderateScale(14),
  bodySmall: moderateScale(12),
  caption: moderateScale(10),

  // Spacing
  paddingHorizontal: scale(20),
  paddingVertical: verticalScale(16),
  gap: scale(16),

  // Components
  buttonHeight: verticalScale(56),
  cardPadding: scale(16),
  borderRadius: scale(16),
};
