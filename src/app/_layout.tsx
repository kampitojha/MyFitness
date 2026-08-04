import '@/global.css';

import { useCallback, useEffect } from 'react';
import { View, useColorScheme, Appearance, Platform } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

import { queryClient } from '@/lib/query-client';
import { useSettingsStore } from '@/store/settings.store';

SplashScreen.preventAutoHideAsync();

function useResolvedColorScheme() {
  const theme = useSettingsStore((s) => s.theme);
  const system = useColorScheme();
  if (theme === 'system') return system ?? 'light';
  return theme;
}

function RootNavigator() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="meal/[id]" />
    </Stack>
  );
}

export default function RootLayout() {
  const scheme = useResolvedColorScheme();
  const themePref = useSettingsStore((s) => s.theme);

  useEffect(() => {
    if (Platform.OS !== 'web' && typeof Appearance?.setColorScheme === 'function') {
      if (themePref === 'system') {
        Appearance.setColorScheme('unspecified');
      } else {
        Appearance.setColorScheme(scheme === 'dark' ? 'dark' : 'light');
      }
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
      <SafeAreaProvider style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <View style={{ flex: 1 }} className="bg-background dark:bg-background-dark">
            <RootNavigator />
          </View>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}