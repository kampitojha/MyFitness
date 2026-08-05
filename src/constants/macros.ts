import type { MacroKey } from '@/types/nutrition';

/**
 * Consistent per-macro accent colors used across the app.
 */
export const MACRO_COLORS: Record<MacroKey, string> = {
  calories: '#0284C7',
  protein: '#0EA5E9',
  carbs: '#F59E0B',
  fat: '#8B5CF6',
};

export const MACRO_ORDER: MacroKey[] = ['calories', 'protein', 'carbs', 'fat'];

export const WATER_TARGET_ML = 2500;
export const WATER_STEP_ML = 250;