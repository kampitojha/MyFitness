import { STORAGE_KEYS } from '@/constants';
import { readJSON, writeJSON } from '@/lib/storage';
import { createId } from '@/utils/id';
import { toISODate } from '@/utils/date';

export interface SleepLog {
  id: string;
  date: string;          // ISO date (YYYY-MM-DD)
  bedtimeHour: number;   // 0-23
  bedtimeMin: number;
  wakeHour: number;
  wakeMin: number;
  durationMinutes: number;
  quality: 1 | 2 | 3 | 4 | 5; // 1=poor, 5=excellent
  notes?: string;
}

export type SleepQuality = 1 | 2 | 3 | 4 | 5;

export const SLEEP_QUALITY_LABELS: Record<SleepQuality, string> = {
  1: '😴 Poor',
  2: '😐 Fair',
  3: '🙂 Good',
  4: '😊 Great',
  5: '🌟 Excellent',
};

export const RECOMMENDED_HOURS = 8;

export const sleepService = {
  async list(): Promise<SleepLog[]> {
    return (await readJSON<SleepLog[]>(STORAGE_KEYS.sleep)) ?? [];
  },

  async logSleep(entry: Omit<SleepLog, 'id'>): Promise<SleepLog> {
    const all = await sleepService.list();
    const log: SleepLog = { id: createId('sleep'), ...entry };
    // Replace existing entry for same date
    const filtered = all.filter((s) => s.date !== entry.date);
    await writeJSON(STORAGE_KEYS.sleep, [log, ...filtered]);
    return log;
  },

  async forDate(date: string): Promise<SleepLog | null> {
    const all = await sleepService.list();
    return all.find((s) => s.date === date) ?? null;
  },

  async last7Days(): Promise<SleepLog[]> {
    const all = await sleepService.list();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    const cutoffISO = toISODate(cutoff);
    return all.filter((s) => s.date >= cutoffISO).slice(0, 7);
  },

  async delete(id: string): Promise<void> {
    const all = await sleepService.list();
    await writeJSON(STORAGE_KEYS.sleep, all.filter((s) => s.id !== id));
  },

  formatDuration(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  },

  calcDuration(bedH: number, bedM: number, wakeH: number, wakeM: number): number {
    let bedMins = bedH * 60 + bedM;
    const wakeMins = wakeH * 60 + wakeM;
    if (wakeMins <= bedMins) bedMins -= 24 * 60; // past midnight
    return wakeMins - bedMins;
  },
};
