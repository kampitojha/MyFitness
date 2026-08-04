import { STORAGE_KEYS } from '@/constants';
import { readJSON, writeJSON } from '@/lib/storage';
import { createId } from '@/utils/id';

export interface WorkoutLog {
  id: string;
  type: string;
  name: string;
  durationMinutes: number;
  caloriesBurned: number;
  date: string; // YYYY-MM-DD
  createdAt: string;
}

export const WORKOUT_TYPES = [
  { id: 'w-1', name: 'Weightlifting / Gym', calPerMin: 6.5 },
  { id: 'w-2', name: 'Running / Jogging', calPerMin: 10.0 },
  { id: 'w-3', name: 'Cycling', calPerMin: 8.0 },
  { id: 'w-4', name: 'HIIT / Cardio', calPerMin: 9.5 },
  { id: 'w-5', name: 'Brisk Walking', calPerMin: 4.5 },
  { id: 'w-6', name: 'Yoga / Stretching', calPerMin: 3.5 },
];

export const workoutService = {
  async list(): Promise<WorkoutLog[]> {
    return (await readJSON<WorkoutLog[]>('workout_logs')) ?? [];
  },

  async byDate(date: string): Promise<WorkoutLog[]> {
    const logs = await workoutService.list();
    return logs.filter((l) => l.date === date);
  },

  async totalBurnForDate(date: string): Promise<number> {
    const logs = await workoutService.byDate(date);
    return logs.reduce((sum, l) => sum + l.caloriesBurned, 0);
  },

  async save(type: string, name: string, durationMinutes: number, date: string): Promise<WorkoutLog> {
    const found = WORKOUT_TYPES.find((w) => w.name === name || w.id === type);
    const calPerMin = found?.calPerMin ?? 6.0;
    const caloriesBurned = Math.round(durationMinutes * calPerMin);

    const logs = await workoutService.list();
    const newLog: WorkoutLog = {
      id: createId('workout'),
      type,
      name,
      durationMinutes,
      caloriesBurned,
      date,
      createdAt: new Date().toISOString(),
    };

    await writeJSON('workout_logs', [newLog, ...logs]);
    return newLog;
  },

  async delete(id: string): Promise<void> {
    const logs = await workoutService.list();
    await writeJSON(
      'workout_logs',
      logs.filter((l) => l.id !== id)
    );
  },
};
