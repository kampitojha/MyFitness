import { useMemo } from 'react';
import { useMeals } from './use-meals';
import { useWaterSeries } from './use-tracker';
import type { Achievement } from '@/types/progress';
import { toISODate } from '@/utils/date';

/**
 * Computes a set of achievements from real logged data so the progress
 * screen always reflects the user's actual consistency.
 */
export function useAchievements(): {
  achievements: Achievement[];
  currentStreak: number;
  longestStreak: number;
} {
  const { data: meals } = useMeals();
  const { data: water } = useWaterSeries(365);

  return useMemo(() => {
    const today = toISODate();
    const dates = (meals ?? []).map((m) => m.createdAt.slice(0, 10));
    const unique = Array.from(new Set(dates)).sort();
    const set = new Set(unique);

    let streak = 0;
    let cursor = today;
    while (set.has(cursor) && streak < 400) {
      streak++;
      const d = new Date(cursor + 'T00:00:00');
      d.setDate(d.getDate() - 1);
      cursor = toISODate(d);
    }
    const currentStreak = streak;

    let longest = 0;
    let run = 0;
    let prev: string | null = null;
    for (const day of unique) {
      const diff = prev ? (new Date(day).getTime() - new Date(prev).getTime()) / 86400000 : 1;
      run = diff === 1 ? run + 1 : 1;
      if (run > longest) longest = run;
      prev = day;
    }

    const totalMeals = meals?.length ?? 0;
    const waterDays = water?.length ?? 0;

    const achievements: Achievement[] = [
      {
        id: 'first-meal',
        title: 'First meal logged',
        description: 'Log your very first meal',
        icon: 'meal',
        progress: totalMeals > 0 ? 1 : 0,
        unlockedAt: totalMeals > 0 ? today : undefined,
        metric: 'meals',
      },
      {
        id: 'streak-3',
        title: '3 day streak',
        description: 'Log meals three days in a row',
        icon: 'streak',
        progress: Math.min(1, currentStreak / 3),
        unlockedAt: currentStreak >= 3 ? today : undefined,
        metric: 'streak',
      },
      {
        id: 'streak-7',
        title: 'Full week',
        description: 'Hit a 7 day streak',
        icon: 'streak',
        progress: Math.min(1, currentStreak / 7),
        unlockedAt: currentStreak >= 7 ? today : undefined,
        metric: 'streak',
      },
      {
        id: 'water-3',
        title: 'Hydration habit',
        description: 'Log water on 3 different days',
        icon: 'water',
        progress: Math.min(1, waterDays / 3),
        unlockedAt: waterDays >= 3 ? today : undefined,
        metric: 'water',
      },
      {
        id: 'meals-10',
        title: 'Getting serious',
        description: 'Log 10 meals',
        icon: 'meals',
        progress: Math.min(1, totalMeals / 10),
        unlockedAt: totalMeals >= 10 ? today : undefined,
        metric: 'meals',
      },
      {
        id: 'meals-50',
        title: 'Half century',
        description: 'Log 50 meals',
        icon: 'meals',
        progress: Math.min(1, totalMeals / 50),
        unlockedAt: totalMeals >= 50 ? today : undefined,
        metric: 'meals',
      },
    ];

    return { achievements, currentStreak, longestStreak: longest };
  }, [meals, water]);
}