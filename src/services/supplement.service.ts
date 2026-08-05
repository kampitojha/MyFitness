import { STORAGE_KEYS } from '@/constants';
import { readJSON, writeJSON } from '@/lib/storage';
import { createId } from '@/utils/id';
import { toISODate } from '@/utils/date';

export interface Supplement {
  id: string;
  name: string;
  dose: string;
  timesPerDay: number;
  takenDates: string[]; // ISO dates when taken
  createdAt: string;
}

export const PRESET_SUPPLEMENTS = [
  { name: 'Whey Protein', dose: '1 scoop (30g)' },
  { name: 'Creatine', dose: '5g' },
  { name: 'Vitamin D', dose: '1 capsule' },
  { name: 'Omega-3', dose: '2 softgels' },
  { name: 'Multivitamin', dose: '1 tablet' },
  { name: 'Magnesium', dose: '400mg' },
  { name: 'Zinc', dose: '25mg' },
  { name: 'BCAA', dose: '10g' },
  { name: 'Pre-workout', dose: '1 scoop' },
  { name: 'Melatonin', dose: '3mg' },
];

export const supplementService = {
  async list(): Promise<Supplement[]> {
    return (await readJSON<Supplement[]>(STORAGE_KEYS.supplements)) ?? [];
  },

  async add(name: string, dose: string, timesPerDay = 1): Promise<Supplement> {
    const all = await supplementService.list();
    const sup: Supplement = {
      id: createId('sup'),
      name,
      dose,
      timesPerDay,
      takenDates: [],
      createdAt: new Date().toISOString(),
    };
    await writeJSON(STORAGE_KEYS.supplements, [sup, ...all]);
    return sup;
  },

  async markTaken(id: string): Promise<void> {
    const all = await supplementService.list();
    const today = toISODate();
    const updated = all.map((s) =>
      s.id === id && !s.takenDates.includes(today)
        ? { ...s, takenDates: [...s.takenDates, today] }
        : s,
    );
    await writeJSON(STORAGE_KEYS.supplements, updated);
  },

  async markUntaken(id: string): Promise<void> {
    const all = await supplementService.list();
    const today = toISODate();
    const updated = all.map((s) =>
      s.id === id ? { ...s, takenDates: s.takenDates.filter((d) => d !== today) } : s,
    );
    await writeJSON(STORAGE_KEYS.supplements, updated);
  },

  async remove(id: string): Promise<void> {
    const all = await supplementService.list();
    await writeJSON(STORAGE_KEYS.supplements, all.filter((s) => s.id !== id));
  },

  isTakenToday(sup: Supplement): boolean {
    return sup.takenDates.includes(toISODate());
  },

  streakDays(sup: Supplement): number {
    const today = toISODate();
    let streak = 0;
    let d = today;
    while (sup.takenDates.includes(d)) {
      streak++;
      const prev = new Date(d);
      prev.setDate(prev.getDate() - 1);
      d = prev.toISOString().slice(0, 10);
    }
    return streak;
  },
};
