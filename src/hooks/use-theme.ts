import { useColorScheme as useRNColorScheme } from 'react-native';
import { darkColors, lightColors } from '@/theme';
import type { ColorScheme } from '@/theme';
import { useSettingsStore } from '@/store/settings.store';

export type ThemeMode = 'light' | 'dark';

export function useTheme(): { colors: ColorScheme; mode: ThemeMode; isDark: boolean } {
  const themePref = useSettingsStore((s) => s.theme);
  const systemScheme = useRNColorScheme();

  const isDark =
    themePref === 'dark' || (themePref === 'system' && systemScheme === 'dark');

  return {
    colors: isDark ? darkColors : lightColors,
    mode: isDark ? 'dark' : 'light',
    isDark,
  };
}