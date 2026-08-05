import type { FoodItem, DetectedFood } from './food';
import type { Macros } from './nutrition';

export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
export type MealType = (typeof MEAL_TYPES)[number];

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

export const MEAL_TYPE_ICONS: Record<MealType, string> = {
  breakfast: 'sunrise',
  lunch: 'sun',
  dinner: 'moon',
  snack: 'apple',
};

export interface Meal {
  id: string;
  name: string;
  type: MealType;
  items: FoodItem[];
  macros: Macros;
  imageUri?: string;
  createdAt: string;
}

export interface MealDraft {
  name?: string;
  type: MealType;
  items: FoodItem[] | DetectedFood[];
  imageUri?: string;
}

export function sumMacros(items: { macros: Macros }[]): Macros {
  return items.reduce<Macros>(
    (acc, item) => ({
      calories: acc.calories + item.macros.calories,
      protein: acc.protein + item.macros.protein,
      carbs: acc.carbs + item.macros.carbs,
      fat: acc.fat + item.macros.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

/** Sum item macros after scaling each by its quantity. Use when storing a meal
 *  so that per-serving macros (e.g. from scan) are logged at the right amount. */
export function sumScaledMacros(items: { macros: Macros; quantity?: number }[]): Macros {
  return items.reduce<Macros>(
    (acc, item) => {
      const scaled = scaleMacros(item.macros, item.quantity ?? 1);
      return {
        calories: acc.calories + scaled.calories,
        protein: acc.protein + scaled.protein,
        carbs: acc.carbs + scaled.carbs,
        fat: acc.fat + scaled.fat,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

export function scaleMacros(macros: Macros, quantity: number): Macros {
  return {
    calories: Math.round(macros.calories * quantity),
    protein: Math.round(macros.protein * quantity * 10) / 10,
    carbs: Math.round(macros.carbs * quantity * 10) / 10,
    fat: Math.round(macros.fat * quantity * 10) / 10,
  };
}