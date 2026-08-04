import type { Macros } from './nutrition';

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  servingSize: string;
  /** Multiplier applied to per-serving macros. */
  quantity: number;
  macros: Macros;
  confidence?: number;
  imageUri?: string;
  healthScore?: number;
  aiNotes?: string;
  source: 'scan' | 'manual' | 'favorite' | 'custom';
  isFavorite?: boolean;
  createdAt: string;
}

export interface DetectedFood extends FoodItem {
  confidence: number;
  bbox?: { x: number; y: number; width: number; height: number };
}

export interface FoodSearchResult {
  id: string;
  name: string;
  brand?: string;
  servingSize: string;
  macros: Macros;
  source: FoodItem['source'];
  isFavorite?: boolean;
}