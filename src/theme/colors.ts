export const palette = {
  emerald: {
    50: '#ECFBF3',
    100: '#D3F6E2',
    200: '#A6EBC5',
    300: '#6FDCA4',
    400: '#38C882',
    500: '#12A964',
    600: '#0E7A4A',
    700: '#0C623C',
    800: '#0A4E31',
    900: '#083F28',
    950: '#042519',
  },
  neutral: {
    0: '#FFFFFF',
    50: '#F7F8F9',
    100: '#EFF1F3',
    200: '#E2E5E9',
    300: '#C8CDD4',
    400: '#A3AAB4',
    500: '#7C8591',
    600: '#5E6570',
    700: '#4A5059',
    800: '#2B2F35',
    850: '#1F2227',
    900: '#14171B',
    950: '#0B0D0F',
  },
  status: {
    success: '#16A34A',
    successSoft: '#DCFCE7',
    warning: '#F59E0B',
    warningSoft: '#FEF3C7',
    danger: '#DC2626',
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
  background: palette.neutral[50],
  surface: palette.neutral[0],
  surfaceAlt: palette.neutral[100],
  text: palette.neutral[900],
  textSecondary: palette.neutral[600],
  textMuted: palette.neutral[400],
  border: palette.neutral[200],
  primary: palette.emerald[600],
  primaryPressed: palette.emerald[700],
  primarySoft: palette.emerald[50],
  primarySoftText: palette.emerald[700],
  onPrimary: palette.neutral[0],
  accent: palette.emerald[500],
  overlay: 'rgba(11, 13, 15, 0.55)',
};

export const darkColors: ColorScheme = {
  background: palette.neutral[950],
  surface: palette.neutral[900],
  surfaceAlt: palette.neutral[850],
  text: palette.neutral[50],
  textSecondary: palette.neutral[400],
  textMuted: palette.neutral[500],
  border: palette.neutral[800],
  primary: palette.emerald[400],
  primaryPressed: palette.emerald[300],
  primarySoft: palette.emerald[900],
  primarySoftText: palette.emerald[300],
  onPrimary: palette.emerald[950],
  accent: palette.emerald[400],
  overlay: 'rgba(0, 0, 0, 0.6)',
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
