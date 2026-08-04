export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Micros {
  fiber: number;
  sugar: number;
  sodium: number;
  cholesterol: number;
  saturatedFat: number;
  transFat: number;
}

export interface NutritionInfo extends Macros {
  micros?: Partial<Micros>;
}

export const EMPTY_MACROS: Macros = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
};

export type MacroKey = keyof Macros;

export const MACRO_LABELS: Record<MacroKey, string> = {
  calories: 'Calories',
  protein: 'Protein',
  carbs: 'Carbs',
  fat: 'Fat',
};

export const MACRO_UNITS: Record<MacroKey, string> = {
  calories: 'kcal',
  protein: 'g',
  carbs: 'g',
  fat: 'g',
};