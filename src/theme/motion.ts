/**
 * Central timing + easing tokens so every animation in the app feels
 * cohesive and intentional.
 */
import { Easing } from 'react-native-reanimated';

export const durations = {
  instant: 90,
  fast: 150,
  normal: 250,
  medium: 350,
  slow: 500,
} as const;

export const easings = {
  // iOS-style springy-but-tame default
  standard: Easing.bezier(0.22, 1, 0.36, 1),
  // entrance/exit used for modals and sheets
  emphasized: Easing.bezier(0.2, 0.8, 0.2, 1),
  ease: Easing.ease,
  inOut: Easing.inOut(Easing.cubic),
} as const;

export const springs = {
  gentle: { damping: 20, stiffness: 220, mass: 0.9 },
  snappy: { damping: 26, stiffness: 320, mass: 0.8 },
  bouncy: { damping: 15, stiffness: 180, mass: 0.8 },
} as const;