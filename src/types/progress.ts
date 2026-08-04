import type { Macros } from './nutrition';

export interface WeightEntry {
  id: string;
  date: string;
  weightKg: number;
}

export interface WaterEntry {
  id: string;
  date: string;
  amountMl: number;
}

export interface DailyLog {
  date: string;
  macros: Macros;
  meals: Record<string, unknown>[];
  waterMl: number;
  weightKg?: number;
}

export interface StreakInfo {
  current: number;
  longest: number;
  bestWeek: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number; // 0..1
  metric: 'calories' | 'protein' | 'streak' | 'meals' | 'water' | 'weight';
}

export type TimeRange = 'day' | 'week' | 'month' | 'year';