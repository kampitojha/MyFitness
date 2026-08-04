import type { FoodItem, FoodSearchResult } from '@/types/food';
import type { Macros } from '@/types/nutrition';

/**
 * Curated fallback food database. In production this is replaced by the
 * backend search endpoint, but keeping a local reference makes the demo
 * fully self-contained and offline-capable.
 */
type FoodSeed = Omit<FoodItem, 'id' | 'source' | 'createdAt' | 'quantity'> & { category: string; quantity?: number };

const seed: FoodSeed[] = [
  { name: 'Chicken Breast (Grilled)', servingSize: '100g', macros: { calories: 165, protein: 31, carbs: 0, fat: 3.6 }, healthScore: 92, category: 'protein' },
  { name: 'Greek Yogurt (Plain)', servingSize: '170g', macros: { calories: 100, protein: 17, carbs: 6, fat: 0.7 }, healthScore: 88, category: 'protein' },
  { name: 'Salmon Fillet', servingSize: '100g', macros: { calories: 208, protein: 20, carbs: 0, fat: 13 }, healthScore: 90, category: 'protein' },
  { name: 'Eggs (Scrambled)', servingSize: '2 eggs', macros: { calories: 180, protein: 12, carbs: 2, fat: 13 }, healthScore: 74, category: 'protein' },
  { name: 'Brown Rice (Cooked)', servingSize: '1 cup', macros: { calories: 216, protein: 5, carbs: 45, fat: 1.8 }, healthScore: 70, category: 'carbs' },
  { name: 'Whole Wheat Bread', servingSize: '2 slices', macros: { calories: 160, protein: 8, carbs: 28, fat: 2 }, healthScore: 66, category: 'carbs' },
  { name: 'Banana', servingSize: '1 medium', macros: { calories: 105, protein: 1.3, carbs: 27, fat: 0.4 }, healthScore: 80, category: 'carbs' },
  { name: 'Oatmeal', servingSize: '1 cup', macros: { calories: 154, protein: 6, carbs: 27, fat: 3 }, healthScore: 78, category: 'carbs' },
  { name: 'Avocado', servingSize: '1/2 fruit', macros: { calories: 120, protein: 1.5, carbs: 6, fat: 11 }, healthScore: 82, category: 'fat' },
  { name: 'Almonds', servingSize: '28g', macros: { calories: 164, protein: 6, carbs: 6, fat: 14 }, healthScore: 68, category: 'fat' },
  { name: 'Olive Oil', servingSize: '1 tbsp', macros: { calories: 119, protein: 0, carbs: 0, fat: 14 }, healthScore: 60, category: 'fat' },
  { name: 'Mixed Green Salad', servingSize: '2 cups', macros: { calories: 20, protein: 2, carbs: 4, fat: 0.2 }, healthScore: 95, category: 'veg' },
  { name: 'Sweet Potato (Baked)', servingSize: '1 medium', macros: { calories: 103, protein: 2, carbs: 24, fat: 0.2 }, healthScore: 84, category: 'veg' },
  { name: 'Broccoli (Steamed)', servingSize: '1 cup', macros: { calories: 55, protein: 3.7, carbs: 11, fat: 0.6 }, healthScore: 91, category: 'veg' },
  { name: 'Apple', servingSize: '1 medium', macros: { calories: 95, protein: 0.5, carbs: 25, fat: 0.3 }, healthScore: 85, category: 'fruit' },
  { name: 'Blueberries', servingSize: '1 cup', macros: { calories: 84, protein: 1, carbs: 21, fat: 0.5 }, healthScore: 90, category: 'fruit' },
  { name: 'Grilled Cheese Sandwich', servingSize: '1 sandwich', macros: { calories: 400, protein: 16, carbs: 34, fat: 22 }, healthScore: 38, category: 'meal' },
  { name: 'Pizza Margherita', servingSize: '1 slice', macros: { calories: 230, protein: 10, carbs: 28, fat: 9 }, healthScore: 42, category: 'meal' },
  { name: 'Caesar Salad', servingSize: '1 bowl', macros: { calories: 370, protein: 12, carbs: 14, fat: 30 }, healthScore: 45, category: 'meal' },
  { name: 'Burger & Fries', servingSize: '1 order', macros: { calories: 820, protein: 34, carbs: 62, fat: 48 }, healthScore: 25, category: 'meal' },
  { name: 'French Fries', servingSize: 'medium', macros: { calories: 365, protein: 4, carbs: 48, fat: 17 }, healthScore: 30, category: 'meal' },
  { name: 'Chocolate Chip Cookie', servingSize: '1 cookie', macros: { calories: 180, protein: 2, carbs: 25, fat: 9 }, healthScore: 35, category: 'treat' },
  { name: 'Protein Shake', servingSize: '1 scoop', macros: { calories: 120, protein: 24, carbs: 3, fat: 1.5 }, healthScore: 76, category: 'protein' },
  { name: 'Cappuccino', servingSize: '1 cup', macros: { calories: 74, protein: 4, carbs: 8, fat: 2.6 }, healthScore: 58, category: 'drink' },
  { name: 'Orange Juice', servingSize: '1 cup', macros: { calories: 112, protein: 1.7, carbs: 26, fat: 0.5 }, healthScore: 62, category: 'drink' },
];

let counter = 0;

function toSearchResult(seedItem: FoodSeed, index: number): FoodSearchResult {
  return {
    id: `db_${index}_${counter++}`,
    name: seedItem.name,
    brand: seedItem.brand,
    servingSize: seedItem.servingSize,
    macros: seedItem.macros as Macros,
    source: 'custom',
  };
}

export function searchFoods(query: string, limit = 12): FoodSearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return seed.slice(0, limit).map(toSearchResult);
  return seed
    .filter((f) => f.name.toLowerCase().includes(q))
    .slice(0, limit)
    .map(toSearchResult);
}

export function getFoodById(id: string): FoodSearchResult | null {
  const index = Number(id.split('_')[1]);
  const item = seed[index];
  return item ? toSearchResult(item, index) : null;
}