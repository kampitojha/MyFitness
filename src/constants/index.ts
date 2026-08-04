export const STORAGE_KEYS = {
  profile: 'nutrascan/profile',
  meals: 'nutrascan/meals',
  water: 'nutrascan/water',
  weight: 'nutrascan/weight',
  favorites: 'nutrascan/favorites',
  achievements: 'nutrascan/achievements',
  onboarded: 'nutrascan/onboarded',
  auth: 'nutrascan/auth',
  settings: 'nutrascan/settings',
} as const;

export const QUERY_KEYS = {
  profile: ['profile'] as const,
  meals: ['meals'] as const,
  water: ['water'] as const,
  weight: ['weight'] as const,
  favorites: ['favorites'] as const,
  history: (date: string) => ['history', date] as const,
  scan: ['scan'] as const,
};

export const APP_NAME = 'NutraScan';
export const API_TIMEOUT_MS = 15000;
export const MAX_SCAN_IMAGE_BYTES = 5 * 1024 * 1024;