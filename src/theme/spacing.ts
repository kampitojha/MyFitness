/**
 * 8pt spacing system. Every spacing value is a multiple of 4/8.
 */
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xl2: 24,
  xl3: 32,
  xl4: 40,
  xl5: 48,
  xl6: 64,
  xl7: 80,
  xl8: 96,
} as const;

export type SpacingToken = keyof typeof spacing;