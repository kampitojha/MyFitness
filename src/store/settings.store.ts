import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/constants';

export type AppThemePreference = 'system' | 'light' | 'dark';
export type GoalDisplayUnit = 'kg' | 'lbs';
export type WaterUnit = 'ml' | 'cups';

interface SettingsState {
  theme: AppThemePreference;
  weightUnit: GoalDisplayUnit;
  waterUnit: WaterUnit;
  hapticsEnabled: boolean;
  notificationsEnabled: boolean;
  showMacroSettings: boolean;
  setTheme: (theme: AppThemePreference) => void;
  setWeightUnit: (unit: GoalDisplayUnit) => void;
  setWaterUnit: (unit: WaterUnit) => void;
  setHapticsEnabled: (v: boolean) => void;
  setNotificationsEnabled: (v: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      weightUnit: 'kg',
      waterUnit: 'ml',
      hapticsEnabled: true,
      notificationsEnabled: true,
      showMacroSettings: false,
      setTheme: (theme) => set({ theme }),
      setWeightUnit: (weightUnit) => set({ weightUnit }),
      setWaterUnit: (waterUnit) => set({ waterUnit }),
      setHapticsEnabled: (hapticsEnabled) => set({ hapticsEnabled }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
    }),
    { name: STORAGE_KEYS.settings },
  ),
);