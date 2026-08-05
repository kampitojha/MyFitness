import { readJSON, writeJSON } from '@/lib/storage';
import { createId } from '@/utils/id';

export interface PresetMicros {
  fiber?: number;
  sugar?: number;
  sodium?: number;
  saturatedFat?: number;
  cholesterol?: number;
}

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
  micronutrients?: PresetMicros;
}

export const PRESET_FOODS: PresetFood[] = [
  // Indian Staples
  { id: 'f-1', name: 'Roti / Chapati', category: 'Indian Staples', servingSize: '1 piece (40g)', defaultGramWeight: 40, macros: { calories: 70, protein: 2.5, carbs: 15, fat: 0.4 }, micronutrients: { fiber: 2.1, sugar: 0.2, sodium: 120, saturatedFat: 0.1, cholesterol: 0 } },
  { id: 'f-2', name: 'Cooked White Rice', category: 'Indian Staples', servingSize: '1 bowl (150g)', defaultGramWeight: 150, macros: { calories: 195, protein: 4.1, carbs: 42, fat: 0.5 }, micronutrients: { fiber: 0.6, sugar: 0.1, sodium: 2, saturatedFat: 0.1, cholesterol: 0 } },
  { id: 'f-3', name: 'Dal Tadka (Yellow Lentils)', category: 'Indian Staples', servingSize: '1 bowl (200g)', defaultGramWeight: 200, macros: { calories: 180, protein: 9.5, carbs: 24, fat: 5.5 }, micronutrients: { fiber: 4.5, sugar: 2, sodium: 350, saturatedFat: 1.0, cholesterol: 0 } },
  { id: 'f-4', name: 'Paneer Butter Masala', category: 'Indian Curries', servingSize: '1 bowl (200g)', defaultGramWeight: 200, macros: { calories: 320, protein: 14, carbs: 12, fat: 24 }, micronutrients: { fiber: 1.2, sugar: 4, sodium: 700, saturatedFat: 12, cholesterol: 45 } },
  { id: 'f-5', name: 'Chicken Curry', category: 'Indian Curries', servingSize: '1 bowl (200g)', defaultGramWeight: 200, macros: { calories: 260, protein: 26, carbs: 6, fat: 14 }, micronutrients: { fiber: 0.8, sugar: 2, sodium: 500, saturatedFat: 4, cholesterol: 90 } },
  { id: 'f-6', name: 'Plain Dosa', category: 'South Indian', servingSize: '1 piece (80g)', defaultGramWeight: 80, macros: { calories: 168, protein: 3.9, carbs: 29, fat: 3.7 }, micronutrients: { fiber: 1.5, sugar: 0.5, sodium: 380, saturatedFat: 0.8, cholesterol: 0 } },
  { id: 'f-7', name: 'Idli', category: 'South Indian', servingSize: '2 pieces (100g)', defaultGramWeight: 100, macros: { calories: 116, protein: 4.2, carbs: 24, fat: 0.4 }, micronutrients: { fiber: 1.8, sugar: 0.4, sodium: 380, saturatedFat: 0.1, cholesterol: 0 } },
  { id: 'f-8', name: 'Chole (Chickpea Curry)', category: 'Indian Curries', servingSize: '1 bowl (200g)', defaultGramWeight: 200, macros: { calories: 240, protein: 11, carbs: 32, fat: 7 }, micronutrients: { fiber: 6.5, sugar: 4, sodium: 450, saturatedFat: 1.2, cholesterol: 0 } },
  { id: 'f-9', name: 'Chicken Biryani', category: 'Rice Dishes', servingSize: '1 plate (350g)', defaultGramWeight: 350, macros: { calories: 480, protein: 28, carbs: 54, fat: 16 }, micronutrients: { fiber: 2.2, sugar: 2, sodium: 800, saturatedFat: 5, cholesterol: 75 } },
  { id: 'f-10', name: 'Aloo Paratha', category: 'Indian Staples', servingSize: '1 paratha (120g)', defaultGramWeight: 120, macros: { calories: 290, protein: 6.5, carbs: 44, fat: 10 }, micronutrients: { fiber: 3.5, sugar: 1.5, sodium: 420, saturatedFat: 3.5, cholesterol: 8 } },

  // Proteins & Fitness
  { id: 'f-11', name: 'Grilled Chicken Breast', category: 'Proteins', servingSize: '100g', defaultGramWeight: 100, macros: { calories: 165, protein: 31, carbs: 0, fat: 3.6 }, micronutrients: { fiber: 0, sugar: 0, sodium: 75, saturatedFat: 1.0, cholesterol: 85 } },
  { id: 'f-12', name: 'Boiled Egg', category: 'Proteins', servingSize: '1 whole egg (50g)', defaultGramWeight: 50, macros: { calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3 }, micronutrients: { fiber: 0, sugar: 0.6, sodium: 62, saturatedFat: 1.6, cholesterol: 186 } },
  { id: 'f-13', name: 'Egg Whites (Scrambled)', category: 'Proteins', servingSize: '3 eggs (100g)', defaultGramWeight: 100, macros: { calories: 52, protein: 11, carbs: 0.7, fat: 0.2 }, micronutrients: { fiber: 0, sugar: 0.7, sodium: 166, saturatedFat: 0, cholesterol: 0 } },
  { id: 'f-14', name: 'Whey Protein Scoop', category: 'Supplements', servingSize: '1 scoop (33g)', defaultGramWeight: 33, macros: { calories: 120, protein: 24, carbs: 2, fat: 1.5 }, micronutrients: { fiber: 0.5, sugar: 1.5, sodium: 130, saturatedFat: 0.5, cholesterol: 20 } },
  { id: 'f-15', name: 'Raw Paneer (Cottage Cheese)', category: 'Proteins', servingSize: '100g', defaultGramWeight: 100, macros: { calories: 265, protein: 18, carbs: 1.2, fat: 20 }, micronutrients: { fiber: 0, sugar: 1.2, sodium: 20, saturatedFat: 13, cholesterol: 40 } },
  { id: 'f-16', name: 'Tofu (Firm)', category: 'Proteins', servingSize: '100g', defaultGramWeight: 100, macros: { calories: 83, protein: 10, carbs: 1.9, fat: 5.3 }, micronutrients: { fiber: 0.9, sugar: 0.7, sodium: 12, saturatedFat: 0.8, cholesterol: 0 } },

  // Healthy Carbs & Snacks
  { id: 'f-17', name: 'Oats in Milk', category: 'Breakfast', servingSize: '1 bowl (250g)', defaultGramWeight: 250, macros: { calories: 260, protein: 11, carbs: 42, fat: 5 }, micronutrients: { fiber: 4.2, sugar: 9, sodium: 130, saturatedFat: 2.5, cholesterol: 15 } },
  { id: 'f-18', name: 'Whole Wheat Bread', category: 'Breakfast', servingSize: '2 slices (60g)', defaultGramWeight: 60, macros: { calories: 150, protein: 6, carbs: 26, fat: 2 }, micronutrients: { fiber: 3.0, sugar: 2, sodium: 240, saturatedFat: 0.4, cholesterol: 0 } },
  { id: 'f-19', name: 'Peanut Butter', category: 'Healthy Fats', servingSize: '1 tbsp (16g)', defaultGramWeight: 16, macros: { calories: 95, protein: 4, carbs: 3, fat: 8 }, micronutrients: { fiber: 1.0, sugar: 1.5, sodium: 68, saturatedFat: 1.6, cholesterol: 0 } },
  { id: 'f-20', name: 'Almonds (Raw)', category: 'Nuts & Seeds', servingSize: '10 pieces (12g)', defaultGramWeight: 12, macros: { calories: 70, protein: 2.5, carbs: 2.5, fat: 6 }, micronutrients: { fiber: 1.5, sugar: 0.5, sodium: 0, saturatedFat: 0.5, cholesterol: 0 } },
  { id: 'f-21', name: 'Apple', category: 'Fruits', servingSize: '1 medium (180g)', defaultGramWeight: 180, macros: { calories: 95, protein: 0.5, carbs: 25, fat: 0.3 }, micronutrients: { fiber: 4.4, sugar: 19, sodium: 1, saturatedFat: 0, cholesterol: 0 } },
  { id: 'f-22', name: 'Banana', category: 'Fruits', servingSize: '1 medium (120g)', defaultGramWeight: 120, macros: { calories: 105, protein: 1.3, carbs: 27, fat: 0.3 }, micronutrients: { fiber: 3.1, sugar: 14, sodium: 1, saturatedFat: 0.1, cholesterol: 0 } },
  { id: 'f-23', name: 'Cow Milk (Full Cream)', category: 'Dairy', servingSize: '1 glass (250ml)', defaultGramWeight: 250, macros: { calories: 150, protein: 8, carbs: 12, fat: 8 }, micronutrients: { fiber: 0, sugar: 12, sodium: 110, saturatedFat: 4.5, cholesterol: 25 } },
  { id: 'f-24', name: 'Greek Yogurt (Plain)', category: 'Dairy', servingSize: '1 cup (170g)', defaultGramWeight: 170, macros: { calories: 100, protein: 17, carbs: 6, fat: 0.7 }, micronutrients: { fiber: 0, sugar: 6, sodium: 65, saturatedFat: 0.5, cholesterol: 10 } },
  { id: 'f-25', name: 'Sprouted Moong Salad', category: 'Salads', servingSize: '1 bowl (150g)', defaultGramWeight: 150, macros: { calories: 135, protein: 9.8, carbs: 22, fat: 0.8 }, micronutrients: { fiber: 5.2, sugar: 4, sodium: 10, saturatedFat: 0.1, cholesterol: 0 } },
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

  async getById(id: string): Promise<PresetFood | undefined> {
    const custom = (await readJSON<PresetFood[]>('custom_foods')) ?? [];
    return [...PRESET_FOODS, ...custom].find((f) => f.id === id);
  },

  calculateMacrosForQuantity(food: PresetFood, quantityRatio: number): PresetFood['macros'] {
    return {
      calories: Math.round(food.macros.calories * quantityRatio),
      protein: Math.round((food.macros.protein * quantityRatio) * 10) / 10,
      carbs: Math.round((food.macros.carbs * quantityRatio) * 10) / 10,
      fat: Math.round((food.macros.fat * quantityRatio) * 10) / 10,
    };
  },

  calculateMicrosForQuantity(food: PresetFood, quantityRatio: number): PresetMicros {
    const src = food.micronutrients ?? {};
    const scale = (v?: number) => (v == null ? undefined : Math.round(v * quantityRatio * 10) / 10);
    return {
      fiber: scale(src.fiber),
      sugar: scale(src.sugar),
      sodium: scale(src.sodium),
      saturatedFat: scale(src.saturatedFat),
      cholesterol: scale(src.cholesterol),
    };
  },
};
