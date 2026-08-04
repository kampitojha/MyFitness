import { useColorScheme } from 'react-native';

import { darkColors, lightColors } from '@/theme';
import type { ColorScheme } from '@/theme';

export type ThemeMode = 'light' | 'dark';

export function useTheme(): { colors: ColorScheme; mode: ThemeMode; isDark: boolean } {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  return {
    colors: isDark ? darkColors : lightColors,
    mode: isDark ? 'dark' : 'light',
    isDark,
  };
}