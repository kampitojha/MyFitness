import { STORAGE_KEYS } from '@/constants';
import { readJSON, writeJSON } from '@/lib/storage';
import type { Meal, MealDraft } from '@/types/meals';
import { sumMacros } from '@/types/meals';
import { createId } from '@/utils/id';
import { toISODate } from '@/utils/date';
import type { Macros } from '@/types/nutrition';

export interface MealRepository {
  list(): Promise<Meal[]>;
  save(draft: MealDraft, at?: string): Promise<Meal>;
  delete(id: string): Promise<void>;
  byDate(date: string): Promise<Meal[]>;
  latest(limit: number): Promise<Meal[]>;
  getById(id: string): Promise<Meal | null>;
  totalsForDate(date: string): Promise<Macros>;
}

export const mealService: MealRepository = {
  async list() {
    return (await readJSON<Meal[]>(STORAGE_KEYS.meals)) ?? [];
  },

  async save(draft, at = toISODate()) {
    const meals = (await mealService.list()) ?? [];
    const id = createId('meal');
    // Use local ISO date for createdAt so date-based filtering (slice 0,10) works
    // correctly regardless of user timezone (avoids UTC-vs-local mismatch)
    const now = new Date();
    const localDate = toISODate(now);
    const ISO = now.toISOString();
    const createdAt = at === toISODate() ? localDate : at;
    const meal: Meal = {
      id,
      name: draft.name ?? draft.items[0]?.name ?? 'Meal',
      type: draft.type,
      items: draft.items.map((item, i) => ({
        id: item.id ?? `${id}_item_${i}`,
        name: item.name,
        brand: item.brand,
        servingSize: item.servingSize,
        quantity: item.quantity ?? 1,
        macros: item.macros,
        confidence: item.confidence,
        imageUri: item.imageUri,
        healthScore: item.healthScore,
        aiNotes: item.aiNotes,
        source: item.source ?? 'scan',
        isFavorite: item.isFavorite,
        createdAt: item.createdAt ?? ISO,
      })),
      macros: sumMacros(draft.items),
      imageUri: draft.imageUri ?? draft.items[0]?.imageUri,
      createdAt,
    };
    meals.unshift(meal);
    await writeJSON(STORAGE_KEYS.meals, meals);
    return meal;
  },

  async delete(id) {
    const meals = (await mealService.list()) ?? [];
    await writeJSON(STORAGE_KEYS.meals, meals.filter((m) => m.id !== id));
  },

  async byDate(date) {
    const meals = (await mealService.list()) ?? [];
    return meals.filter((m) => m.createdAt.slice(0, 10) === date);
  },

  async latest(limit = 10) {
    const meals = (await mealService.list()) ?? [];
    return meals.slice(0, limit);
  },

  async getById(id: string) {
    const meals = await mealService.list();
    return meals.find((m) => m.id === id) ?? null;
  },

  async totalsForDate(date) {
    const meals = await mealService.byDate(date);
    const initial: Macros = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    return meals.reduce((acc, meal) => ({
      calories: acc.calories + meal.macros.calories,
      protein: acc.protein + meal.macros.protein,
      carbs: acc.carbs + meal.macros.carbs,
      fat: acc.fat + meal.macros.fat,
    }), initial);
  },
};