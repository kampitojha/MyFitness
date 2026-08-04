import { Platform } from 'react-native';

/**
 * Typography scale. Line numbers match the letter-tight, breathable
 * editorial feel of the app.
 */
export const fontSizes = {
  caption2: 11,
  caption: 12,
  footnote: 13,
  bodySmall: 14,
  body: 15,
  subhead: 17,
  title3: 20,
  title2: 24,
  title1: 28,
  largeTitle: 34,
  display: 40,
} as const;

export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  heavy: '800' as const,
};

export const fontFamilies = {
  display: Platform.select({ ios: 'System', default: 'sans-serif' }) ?? 'System',
  body: Platform.select({ ios: 'System', default: 'sans-serif' }) ?? 'System',
};

export const lineHeights = {
  tight: 1.05,
  snug: 1.2,
  normal: 1.35,
  relaxed: 1.5,
  loose: 1.7,
} as const;