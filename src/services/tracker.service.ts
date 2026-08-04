import { STORAGE_KEYS } from '@/constants';
import { readJSON, writeJSON } from '@/lib/storage';
import type { WaterEntry, WeightEntry } from '@/types/progress';
import { createId } from '@/utils/id';
import { toISODate } from '@/utils/date';

export interface TrackerRepository {
  totalWaterForDate(date: string): Promise<number>;
  addWater(amountMl: number, date?: string): Promise<WaterEntry[]>;
  weightForDate(date: string): Promise<WeightEntry | null>;
  upsertWeight(weightKg: number, date?: string): Promise<WeightEntry[]>;
  weightSeries(days: number): Promise<WeightEntry[]>;
  waterSeries(days: number): Promise<{ date: string; amountMl: number }[]>;
}

const WATER_STEP_ML = 250;

export const trackerService: TrackerRepository = {
  async totalWaterForDate(date) {
    const entries = (await readJSON<WaterEntry[]>(STORAGE_KEYS.water)) ?? [];
    return entries.filter((e) => e.date === date).reduce((sum, e) => sum + e.amountMl, 0);
  },

  async addWater(amountMl, date = toISODate()) {
    const entries = (await readJSON<WaterEntry[]>(STORAGE_KEYS.water)) ?? [];
    entries.push({ id: createId('water'), date, amountMl });
    await writeJSON(STORAGE_KEYS.water, entries);
    return entries;
  },

  async weightForDate(date) {
    const entries = (await readJSON<WeightEntry[]>(STORAGE_KEYS.weight)) ?? [];
    return entries.find((e) => e.date === date) ?? null;
  },

  async upsertWeight(weightKg, date = toISODate()) {
    const entries = (await readJSON<WeightEntry[]>(STORAGE_KEYS.weight)) ?? [];
    const idx = entries.findIndex((e) => e.date === date);
    const entry: WeightEntry = { id: createId('weight'), date, weightKg };
    if (idx >= 0) entries[idx] = entry;
    else entries.push(entry);
    entries.sort((a, b) => a.date.localeCompare(b.date));
    await writeJSON(STORAGE_KEYS.weight, entries);
    return entries;
  },

  async weightSeries(days) {
    const entries = (await readJSON<WeightEntry[]>(STORAGE_KEYS.weight)) ?? [];
    const today = toISODate();
    const start = new Date();
    start.setDate(start.getDate() - (days - 1));
    const startISO = toISODate(start);
    return entries.filter((e) => e.date >= startISO && e.date <= today);
  },

  async waterSeries(days) {
    const entries = (await readJSON<WaterEntry[]>(STORAGE_KEYS.water)) ?? [];
    const today = toISODate();
    const start = new Date();
    start.setDate(start.getDate() - (days - 1));
    const startISO = toISODate(start);
    const grouped = new Map<string, number>();
    for (const e of entries) {
      if (e.date >= startISO && e.date <= today) {
        grouped.set(e.date, (grouped.get(e.date) ?? 0) + e.amountMl);
      }
    }
    return Array.from(grouped, ([date, amountMl]) => ({ date, amountMl }));
  },
};

export { WATER_STEP_ML };