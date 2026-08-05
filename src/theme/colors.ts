export const palette = {
  skyBlue: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9',
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C4A6E',
    950: '#082F49',
  },
  neutral: {
    0: '#FFFFFF',
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    850: '#0F172A',
    900: '#0B132B',
    950: '#030712',
  },
  status: {
    success: '#0EA5E9',
    successSoft: '#E0F2FE',
    warning: '#F59E0B',
    warningSoft: '#FEF3C7',
    danger: '#EF4444',
    dangerSoft: '#FEE2E2',
    info: '#0EA5E9',
    infoSoft: '#E0F2FE',
  },
} as const;

export type SemanticColor = 'background' | 'surface' | 'surfaceAlt' | 'text' | 'textSecondary' | 'textMuted' | 'border' | 'primary' | 'primarySoft' | 'onPrimary' | 'accent' | 'overlay';

export interface ColorScheme {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  primary: string;
  primaryPressed: string;
  primarySoft: string;
  primarySoftText: string;
  onPrimary: string;
  accent: string;
  overlay: string;
}

export const lightColors: ColorScheme = {
  background: palette.neutral[0],
  surface: palette.neutral[0],
  surfaceAlt: palette.skyBlue[50],
  text: palette.neutral[900],
  textSecondary: palette.neutral[600],
  textMuted: palette.neutral[400],
  border: palette.neutral[200],
  primary: palette.skyBlue[600],
  primaryPressed: palette.skyBlue[700],
  primarySoft: palette.skyBlue[50],
  primarySoftText: palette.skyBlue[700],
  onPrimary: palette.neutral[0],
  accent: palette.skyBlue[500],
  overlay: 'rgba(11, 19, 43, 0.55)',
};

export const darkColors: ColorScheme = {
  background: palette.neutral[950],
  surface: palette.neutral[900],
  surfaceAlt: palette.neutral[850],
  text: palette.neutral[50],
  textSecondary: palette.neutral[400],
  textMuted: palette.neutral[500],
  border: palette.neutral[800],
  primary: palette.skyBlue[400],
  primaryPressed: palette.skyBlue[300],
  primarySoft: palette.skyBlue[950],
  primarySoftText: palette.skyBlue[300],
  onPrimary: palette.neutral[950],
  accent: palette.skyBlue[400],
  overlay: 'rgba(0, 0, 0, 0.65)',
};

export const statusColors = {
  success: palette.status.success,
  successSoft: palette.status.successSoft,
  warning: palette.status.warning,
  warningSoft: palette.status.warningSoft,
  danger: palette.status.danger,
  dangerSoft: palette.status.dangerSoft,
  info: palette.status.info,
  infoSoft: palette.status.infoSoft,
} as const;
