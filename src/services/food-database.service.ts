import { STORAGE_KEYS } from '@/constants';
import { readJSON, writeJSON } from '@/lib/storage';
import type { FoodItem } from '@/types/food';
import type { MealType } from '@/types/meals';
import { createId } from '@/utils/id';

export interface PresetFood {
  id: string;
  name: string;
  category: string;
  servingSize: string;
  defaultGramWeight: number;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  micronutrients?: {
    fiber?: number;
    sugar?: number;
    sodium?: number;
  };
}

export const PRESET_FOODS: PresetFood[] = [
  // Indian Staples
  { id: 'f-1', name: 'Roti / Chapati', category: 'Indian Staples', servingSize: '1 piece (40g)', defaultGramWeight: 40, macros: { calories: 70, protein: 2.5, carbs: 15, fat: 0.4 }, micronutrients: { fiber: 2.1 } },
  { id: 'f-2', name: 'Cooked White Rice', category: 'Indian Staples', servingSize: '1 bowl (150g)', defaultGramWeight: 150, macros: { calories: 195, protein: 4.1, carbs: 42, fat: 0.5 }, micronutrients: { fiber: 0.6 } },
  { id: 'f-3', name: 'Dal Tadka (Yellow Lentils)', category: 'Indian Staples', servingSize: '1 bowl (200g)', defaultGramWeight: 200, macros: { calories: 180, protein: 9.5, carbs: 24, fat: 5.5 }, micronutrients: { fiber: 4.5 } },
  { id: 'f-4', name: 'Paneer Butter Masala', category: 'Indian Curries', servingSize: '1 bowl (200g)', defaultGramWeight: 200, macros: { calories: 320, protein: 14, carbs: 12, fat: 24 }, micronutrients: { fiber: 1.2 } },
  { id: 'f-5', name: 'Chicken Curry', category: 'Indian Curries', servingSize: '1 bowl (200g)', defaultGramWeight: 200, macros: { calories: 260, protein: 26, carbs: 6, fat: 14 }, micronutrients: { fiber: 0.8 } },
  { id: 'f-6', name: 'Plain Dosa', category: 'South Indian', servingSize: '1 piece (80g)', defaultGramWeight: 80, macros: { calories: 168, protein: 3.9, carbs: 29, fat: 3.7 }, micronutrients: { fiber: 1.5 } },
  { id: 'f-7', name: 'Idli', category: 'South Indian', servingSize: '2 pieces (100g)', defaultGramWeight: 100, macros: { calories: 116, protein: 4.2, carbs: 24, fat: 0.4 }, micronutrients: { fiber: 1.8 } },
  { id: 'f-8', name: 'Chole (Chickpea Curry)', category: 'Indian Curries', servingSize: '1 bowl (200g)', defaultGramWeight: 200, macros: { calories: 240, protein: 11, carbs: 32, fat: 7 }, micronutrients: { fiber: 6.5 } },
  { id: 'f-9', name: 'Chicken Biryani', category: 'Rice Dishes', servingSize: '1 plate (350g)', defaultGramWeight: 350, macros: { calories: 480, protein: 28, carbs: 54, fat: 16 }, micronutrients: { fiber: 2.2 } },
  { id: 'f-10', name: 'Aloo Paratha', category: 'Indian Staples', servingSize: '1 paratha (120g)', defaultGramWeight: 120, macros: { calories: 290, protein: 6.5, carbs: 44, fat: 10 }, micronutrients: { fiber: 3.5 } },

  // Proteins & Fitness
  { id: 'f-11', name: 'Grilled Chicken Breast', category: 'Proteins', servingSize: '100g', defaultGramWeight: 100, macros: { calories: 165, protein: 31, carbs: 0, fat: 3.6 }, micronutrients: { fiber: 0 } },
  { id: 'f-12', name: 'Boiled Egg', category: 'Proteins', servingSize: '1 whole egg (50g)', defaultGramWeight: 50, macros: { calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3 }, micronutrients: { fiber: 0 } },
  { id: 'f-13', name: 'Egg Whites (Scrambled)', category: 'Proteins', servingSize: '3 eggs (100g)', defaultGramWeight: 100, macros: { calories: 52, protein: 11, carbs: 0.7, fat: 0.2 }, micronutrients: { fiber: 0 } },
  { id: 'f-14', name: 'Whey Protein Scoop', category: 'Supplements', servingSize: '1 scoop (33g)', defaultGramWeight: 33, macros: { calories: 120, protein: 24, carbs: 2, fat: 1.5 }, micronutrients: { fiber: 0.5 } },
  { id: 'f-15', name: 'Raw Paneer (Cottage Cheese)', category: 'Proteins', servingSize: '100g', defaultGramWeight: 100, macros: { calories: 265, protein: 18, carbs: 1.2, fat: 20 }, micronutrients: { fiber: 0 } },
  { id: 'f-16', name: 'Tofu (Firm)', category: 'Proteins', servingSize: '100g', defaultGramWeight: 100, macros: { calories: 83, protein: 10, carbs: 1.9, fat: 5.3 }, micronutrients: { fiber: 0.9 } },

  // Healthy Carbs & Snacks
  { id: 'f-17', name: 'Oats in Milk', category: 'Breakfast', servingSize: '1 bowl (250g)', defaultGramWeight: 250, macros: { calories: 260, protein: 11, carbs: 42, fat: 5 }, micronutrients: { fiber: 4.2 } },
  { id: 'f-18', name: 'Whole Wheat Bread', category: 'Breakfast', servingSize: '2 slices (60g)', defaultGramWeight: 60, macros: { calories: 150, protein: 6, carbs: 26, fat: 2 }, micronutrients: { fiber: 3.0 } },
  { id: 'f-19', name: 'Peanut Butter', category: 'Healthy Fats', servingSize: '1 tbsp (16g)', defaultGramWeight: 16, macros: { calories: 95, protein: 4, carbs: 3, fat: 8 }, micronutrients: { fiber: 1.0 } },
  { id: 'f-20', name: 'Almonds (Raw)', category: 'Nuts & Seeds', servingSize: '10 pieces (12g)', defaultGramWeight: 12, macros: { calories: 70, protein: 2.5, carbs: 2.5, fat: 6 }, micronutrients: { fiber: 1.5 } },
  { id: 'f-21', name: 'Apple', category: 'Fruits', servingSize: '1 medium (180g)', defaultGramWeight: 180, macros: { calories: 95, protein: 0.5, carbs: 25, fat: 0.3 }, micronutrients: { fiber: 4.4 } },
  { id: 'f-22', name: 'Banana', category: 'Fruits', servingSize: '1 medium (120g)', defaultGramWeight: 120, macros: { calories: 105, protein: 1.3, carbs: 27, fat: 0.3 }, micronutrients: { fiber: 3.1 } },
  { id: 'f-23', name: 'Cow Milk (Full Cream)', category: 'Dairy', servingSize: '1 glass (250ml)', defaultGramWeight: 250, macros: { calories: 150, protein: 8, carbs: 12, fat: 8 }, micronutrients: { fiber: 0 } },
  { id: 'f-24', name: 'Greek Yogurt (Plain)', category: 'Dairy', servingSize: '1 cup (170g)', defaultGramWeight: 170, macros: { calories: 100, protein: 17, carbs: 6, fat: 0.7 }, micronutrients: { fiber: 0 } },
  { id: 'f-25', name: 'Sprouted Moong Salad', category: 'Salads', servingSize: '1 bowl (150g)', defaultGramWeight: 150, macros: { calories: 135, protein: 9.8, carbs: 22, fat: 0.8 }, micronutrients: { fiber: 5.2 } },
];

export const foodDatabaseService = {
  async search(query: string): Promise<PresetFood[]> {
    const q = query.trim().toLowerCase();
    const custom = (await readJSON<PresetFood[]>('custom_foods')) ?? [];
    const all = [...PRESET_FOODS, ...custom];

    if (!q) return all.slice(0, 15);
    return all.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
    );
  },

  async addCustomFood(food: Omit<PresetFood, 'id'>): Promise<PresetFood> {
    const existing = (await readJSON<PresetFood[]>('custom_foods')) ?? [];
    const newFood: PresetFood = {
      ...food,
      id: createId('food'),
    };
    await writeJSON('custom_foods', [newFood, ...existing]);
    return newFood;
  },

  calculateMacrosForQuantity(food: PresetFood, quantityRatio: number): PresetFood['macros'] {
    return {
      calories: Math.round(food.macros.calories * quantityRatio),
      protein: Math.round((food.macros.protein * quantityRatio) * 10) / 10,
      carbs: Math.round((food.macros.carbs * quantityRatio) * 10) / 10,
      fat: Math.round((food.macros.fat * quantityRatio) * 10) / 10,
    };
  },
};
