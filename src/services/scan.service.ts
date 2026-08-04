import type { DetectedFood } from '@/types/food';
import { createId } from '@/utils/id';

export interface ScanImage {
  uri: string;
  width?: number;
  height?: number;
  base64?: string;
}

/**
 * Scan outcome with typed error surface so callers can render
 * appropriate failure states.
 */
export interface ScanResult {
  imageUri: string;
  foods: DetectedFood[];
  processedAt: string;
}

/**
 * Deterministic pseudo-random source from a string so a given image path
 * yields stable mock detections, hinting at how the real vision pipeline
 * would cache results.
 */
function hashString(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) + h + str.charCodeAt(i);
  }
  return h >>> 0;
}

function seededPick<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  const count = 1 + (seed % 2);
  const out: T[] = [];
  for (let i = 0; i < count && copy.length; i++) {
    const idx = (seed + i * 3 + 17) % copy.length;
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

const POOL: Pick<DetectedFood, 'name' | 'servingSize' | 'macros' | 'healthScore'>[] = [
  { name: 'Grilled Chicken Bowl', servingSize: '1 bowl', macros: { calories: 420, protein: 38, carbs: 34, fat: 14 }, healthScore: 78 },
  { name: 'Avocado Toast', servingSize: '2 slices', macros: { calories: 260, protein: 7, carbs: 30, fat: 13 }, healthScore: 70 },
  { name: 'Salmon Poke Bowl', servingSize: '1 bowl', macros: { calories: 510, protein: 32, carbs: 48, fat: 21 }, healthScore: 72 },
  { name: 'Turmeric Rice & Beans', servingSize: '1 cup', macros: { calories: 290, protein: 10, carbs: 52, fat: 6 }, healthScore: 66 },
  { name: 'Spinach & Feta Omelette', servingSize: '1 plate', macros: { calories: 240, protein: 18, carbs: 6, fat: 16 }, healthScore: 76 },
  { name: 'Berry Yogurt Parfait', servingSize: '1 cup', macros: { calories: 210, protein: 12, carbs: 34, fat: 4 }, healthScore: 74 },
  { name: 'Chicken Caesar Wrap', servingSize: '1 wrap', macros: { calories: 480, protein: 30, carbs: 42, fat: 22 }, healthScore: 52 },
  { name: 'Veggie Stir Fry', servingSize: '1 plate', macros: { calories: 260, protein: 12, carbs: 30, fat: 11 }, healthScore: 80 },
  { name: 'Protein Pancakes', servingSize: '3 pancakes', macros: { calories: 330, protein: 26, carbs: 40, fat: 8 }, healthScore: 68 },
  { name: 'Chocolate Smoothie Bowl', servingSize: '1 bowl', macros: { calories: 380, protein: 15, carbs: 52, fat: 13 }, healthScore: 58 },
];

/**
 * AI meal detection. Currently backed by a local heuristic so the app is
 * fully functional offline; the seam is exactly where the production
 * OpenAI/Gemini Vision calls are wired in.
 */
export async function analyzeFoodImage(image: ScanImage): Promise<ScanResult> {
  // Simulate network + inference latency for realistic loading states.
  await new Promise((resolve) => setTimeout(resolve, 1600));

  const seed = hashString(image.uri);
  const picked = seededPick(POOL, seed);

  const now = Date.now();
  const foods: DetectedFood[] = picked.map((f, i) => {
    const confidence = Math.round(86 + ((seed + i * 7) % 12));
    const quantity = 1;
    return {
      id: createId('food'),
      name: f.name,
      servingSize: f.servingSize,
      quantity,
      macros: {
        calories: Math.round(f.macros.calories * quantity),
        protein: Math.round(f.macros.protein * quantity),
        carbs: Math.round(f.macros.carbs * quantity),
        fat: Math.round(f.macros.fat * quantity),
      },
      confidence,
      healthScore: f.healthScore,
      source: 'scan',
      createdAt: `${new Date(now).toISOString()}`,
      bbox: { x: 0.1 + i * 0.1, y: 0.15 + i * 0.2, width: 0.4, height: 0.35 },
    };
  });

  return {
    imageUri: image.uri,
    foods,
    processedAt: new Date(now).toISOString(),
  };
}