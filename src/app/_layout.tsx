import '@/global.css';

import { useCallback, useEffect } from 'react';
import { View, useColorScheme, Appearance } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

import { queryClient } from '@/lib/query-client';
import { useSettingsStore } from '@/store/settings.store';
import { useHasCompletedOnboarding } from '@/hooks/use-profile';
import { Spinner } from '@/components/ui/spinner';

SplashScreen.preventAutoHideAsync();

function useResolvedColorScheme() {
  const theme = useSettingsStore((s) => s.theme);
  const system = useColorScheme();
  if (theme === 'system') return system ?? 'light';
  return theme;
}

function RootNavigator() {
  const { data: onboarded, isLoading } = useHasCompletedOnboarding();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <Spinner size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Protected guard={!onboarded}>
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={!!onboarded}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="meal/[id]" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const scheme = useResolvedColorScheme();
  const themePref = useSettingsStore((s) => s.theme);

  useEffect(() => {
    if (themePref === 'system') {
      Appearance.setColorScheme('unspecified');
    } else {
      Appearance.setColorScheme(scheme === 'dark' ? 'dark' : 'light');
    }
  }, [themePref, scheme]);

  const hideSplash = useCallback(() => {
    SplashScreen.hideAsync().catch(() => undefined);
  }, []);

  useEffect(() => {
    const t = setTimeout(hideSplash, 400);
    return () => clearTimeout(t);
  }, [hideSplash]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
            <View className="flex-1 bg-background dark:bg-background-dark">
              <RootNavigator />
            </View>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}