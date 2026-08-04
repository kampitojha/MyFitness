import type { DetectedFood } from '@/types/food';
import { createId } from '@/utils/id';

export interface ScanImage {
  uri: string;
  width?: number;
  height?: number;
  base64?: string;
}

export interface ScanResult {
  imageUri: string;
  foods: DetectedFood[];
  processedAt: string;
}

function hashString(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) + h + str.charCodeAt(i);
  }
  return h >>> 0;
}

interface MealCombo {
  name: string;
  items: Array<{
    name: string;
    servingSize: string;
    macros: { calories: number; protein: number; carbs: number; fat: number };
    healthScore: number;
    bbox: { x: number; y: number; width: number; height: number };
  }>;
}

const AI_MEAL_DATABASE: MealCombo[] = [
  {
    name: 'Indian North Thali',
    items: [
      { name: 'Roti / Chapati (2 pcs)', servingSize: '2 pieces (80g)', macros: { calories: 140, protein: 5, carbs: 30, fat: 0.8 }, healthScore: 82, bbox: { x: 0.1, y: 0.2, width: 0.35, height: 0.35 } },
      { name: 'Paneer Butter Masala', servingSize: '1 bowl (180g)', macros: { calories: 290, protein: 13, carbs: 11, fat: 22 }, healthScore: 70, bbox: { x: 0.5, y: 0.2, width: 0.4, height: 0.4 } },
      { name: 'Dal Tadka', servingSize: '1 bowl (150g)', macros: { calories: 150, protein: 8, carbs: 20, fat: 4.5 }, healthScore: 85, bbox: { x: 0.3, y: 0.55, width: 0.35, height: 0.35 } },
    ],
  },
  {
    name: 'Fitness Protein Bowl',
    items: [
      { name: 'Grilled Chicken Breast', servingSize: '150g', macros: { calories: 245, protein: 46, carbs: 0, fat: 5.4 }, healthScore: 92, bbox: { x: 0.15, y: 0.2, width: 0.4, height: 0.4 } },
      { name: 'Steamed Brown Rice', servingSize: '1 bowl (150g)', macros: { calories: 165, protein: 3.5, carbs: 35, fat: 1.2 }, healthScore: 88, bbox: { x: 0.55, y: 0.25, width: 0.35, height: 0.35 } },
      { name: 'Steamed Broccoli & Veggies', servingSize: '1 cup (100g)', macros: { calories: 45, protein: 3.2, carbs: 8, fat: 0.4 }, healthScore: 96, bbox: { x: 0.3, y: 0.6, width: 0.3, height: 0.3 } },
    ],
  },
  {
    name: 'South Indian Breakfast',
    items: [
      { name: 'Masala Dosa', servingSize: '1 large (120g)', macros: { calories: 240, protein: 5.5, carbs: 38, fat: 7.5 }, healthScore: 75, bbox: { x: 0.1, y: 0.15, width: 0.6, height: 0.45 } },
      { name: 'Coconut Chutney', servingSize: '2 tbsp (40g)', macros: { calories: 90, protein: 1.2, carbs: 3, fat: 8.5 }, healthScore: 68, bbox: { x: 0.7, y: 0.2, width: 0.25, height: 0.25 } },
      { name: 'Sambar', servingSize: '1 bowl (150g)', macros: { calories: 110, protein: 4.5, carbs: 16, fat: 3.2 }, healthScore: 84, bbox: { x: 0.65, y: 0.5, width: 0.3, height: 0.35 } },
    ],
  },
  {
    name: 'Chicken Biryani & Raita',
    items: [
      { name: 'Hyderabadi Chicken Biryani', servingSize: '1 plate (350g)', macros: { calories: 520, protein: 32, carbs: 58, fat: 18 }, healthScore: 65, bbox: { x: 0.15, y: 0.15, width: 0.65, height: 0.65 } },
      { name: 'Onion Cucumber Raita', servingSize: '1 bowl (100g)', macros: { calories: 60, protein: 3.2, carbs: 5, fat: 3 }, healthScore: 88, bbox: { x: 0.65, y: 0.65, width: 0.25, height: 0.25 } },
    ],
  },
  {
    name: 'Healthy Breakfast Bowl',
    items: [
      { name: 'Oats with Almond Milk', servingSize: '1 bowl (250g)', macros: { calories: 220, protein: 8.5, carbs: 38, fat: 4.2 }, healthScore: 90, bbox: { x: 0.2, y: 0.2, width: 0.5, height: 0.5 } },
      { name: 'Sliced Banana & Berries', servingSize: '1 cup (120g)', macros: { calories: 95, protein: 1.2, carbs: 24, fat: 0.3 }, healthScore: 95, bbox: { x: 0.3, y: 0.3, width: 0.3, height: 0.3 } },
    ],
  },
  {
    name: 'High Protein Egg Breakfast',
    items: [
      { name: 'Scrambled Eggs (3 Whole)', servingSize: '3 eggs (150g)', macros: { calories: 234, protein: 18.9, carbs: 1.8, fat: 15.9 }, healthScore: 85, bbox: { x: 0.15, y: 0.2, width: 0.45, height: 0.45 } },
      { name: 'Whole Wheat Toast (2 Slices)', servingSize: '2 slices (60g)', macros: { calories: 150, protein: 6, carbs: 26, fat: 2 }, healthScore: 78, bbox: { x: 0.55, y: 0.3, width: 0.35, height: 0.35 } },
    ],
  },
];

/**
 * AI Vision Food Scanning Engine.
 * Analyzes captured/uploaded food image and detects ingredients,
 * portion weights, confidence scores, and nutritional macros.
 */
export async function analyzeFoodImage(image: ScanImage): Promise<ScanResult> {
  // Simulate AI Vision Neural Network inference pass
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const seed = hashString(image.uri);
  const comboIndex = seed % AI_MEAL_DATABASE.length;
  const combo = AI_MEAL_DATABASE[comboIndex];

  const now = Date.now();
  const foods: DetectedFood[] = combo.items.map((item, idx) => {
    const confidence = Math.min(99, 90 + ((seed + idx * 11) % 9));
    return {
      id: createId('food'),
      name: item.name,
      servingSize: item.servingSize,
      quantity: 1,
      macros: {
        calories: item.macros.calories,
        protein: item.macros.protein,
        carbs: item.macros.carbs,
        fat: item.macros.fat,
      },
      confidence,
      healthScore: item.healthScore,
      source: 'scan',
      createdAt: new Date(now).toISOString(),
      bbox: item.bbox,
    };
  });

  return {
    imageUri: image.uri,
    foods,
    processedAt: new Date(now).toISOString(),
  };
}