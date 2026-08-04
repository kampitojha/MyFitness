import { Platform } from 'react-native';

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xl2: 24,
  xl3: 32,
  full: 9999,
} as const;

export type RadiusToken = keyof typeof radii;

/**
 * Subtle elevation for cards. Avoids heavy shadows for a cleaner, more
 * modern surface treatment.
 */
export const shadows = {
  none: {},
  sm: Platform.select({
    ios: {
      shadowColor: '#0B0D0F',
      shadowOpacity: 0.05,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    },
    android: { elevation: 1 },
    default: { elevation: 1 },
  }) ?? {},
  md: Platform.select({
    ios: {
      shadowColor: '#0B0D0F',
      shadowOpacity: 0.08,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 6 },
    },
    android: { elevation: 3 },
    default: { elevation: 3 },
  }) ?? {},
  lg: Platform.select({
    ios: {
      shadowColor: '#0B0D0F',
      shadowOpacity: 0.12,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
    },
    android: { elevation: 6 },
    default: { elevation: 6 },
  }) ?? {},
} as const;

export type ShadowToken = keyof typeof shadows;