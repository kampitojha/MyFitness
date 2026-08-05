import { useMemo } from 'react';
import { useAllMealsSummary } from './use-meals';
import { useWaterSeries, useWeightSeries } from './use-tracker';
import type { TimeRange } from '@/types/progress';
import { lastNDays, toISODate, formatMonth, monthKey, startOfWeek } from '@/utils/date';

export interface TrendDatum {
  date: string;
  label: string;
  calories: number;
  protein: number;
  waterMl: number;
  weightKg?: number;
  weightLabel?: string;
}

const RANGE_DAYS: Record<TimeRange, number> = {
  day: 1,
  week: 7,
  month: 30,
  year: 365,
};

/**
 * Derives per-period nutrition/water/weight trends from all logged data.
 * Aggregates to weeks for the 1-month view and months for the 1-year view.
 */
export function useTrends(range: TimeRange): TrendDatum[] {
  const grouped = useAllMealsSummary();
  const days = RANGE_DAYS[range];
  const waterQuery = useWaterSeries(365);
  const weightQuery = useWeightSeries(365);

  return useMemo(() => {
    const today = toISODate();
    const waterMap = new Map((waterQuery.data ?? []).map((e) => [e.date, e.amountMl]));
    const weightMap = new Map((weightQuery.data ?? [])?.map((e) => [e.date, e.weightKg]));

    const daily = lastNDays(days, today).map((date): { date: string; calories: number; protein: number; waterMl: number; weightKg?: number } => {
      const meals = grouped[date] ?? [];
      const calories = meals.reduce((s, m) => s + m.macros.calories, 0);
      const protein = meals.reduce((s, m) => s + m.macros.protein, 0);
      return { date, calories, protein, waterMl: waterMap.get(date) ?? 0, weightKg: weightMap.get(date) };
    });

    if (range === 'week' || range === 'day') {
      return daily.map((d) => ({
        date: d.date,
        label: formatMonth(d.date),
        calories: d.calories,
        protein: d.protein,
        waterMl: d.waterMl,
        weightKg: d.weightKg,
        weightLabel: d.weightKg !== undefined ? formatMonth(d.date) : undefined,
      }));
    }

    if (range === 'month') {
      // Aggregates a 30-day month view into weekly buckets (~5 bars) so the
      // chart stays readable instead of collapsing to a single bar.
      const weekBuckets = new Map<string, TrendDatum & { _protein: number }>();
      for (const d of daily) {
        const sOW = startOfWeek(d.date);
        const prev = weekBuckets.get(sOW);
        if (prev) {
          prev._protein += d.protein;
          prev.calories += d.calories;
          prev.waterMl += d.waterMl;
          if (d.weightKg !== undefined) prev.weightKg = d.weightKg;
        } else {
          weekBuckets.set(sOW, {
            date: sOW,
            label: formatMonth(sOW),
            calories: d.calories,
            _protein: d.protein,
            protein: 0,
            waterMl: d.waterMl,
            weightKg: d.weightKg,
            weightLabel: d.weightKg !== undefined ? formatMonth(sOW) : undefined,
          });
        }
      }
      const weekList = [...weekBuckets.values()];
      weekList.forEach((b) => {
        b.protein = b._protein;
        delete (b as Partial<TrendDatum & { _protein: number }>)._protein;
      });
      return weekList;
    }

    // Yearly aggregation into calendar months
    const buckets = new Map<string, TrendDatum & { _protein: number }>();
    for (const d of daily) {
      const key = monthKey(d.date);
      const prev = buckets.get(key);
      if (prev) {
        prev._protein += d.protein;
        prev.calories += d.calories;
        prev.waterMl += d.waterMl;
        if (d.weightKg !== undefined) prev.weightKg = d.weightKg;
      } else {
        buckets.set(key, {
          date: key,
          label: formatMonth(`${key}-01`),
          calories: d.calories,
          _protein: d.protein,
          protein: 0,
          waterMl: d.waterMl,
          weightKg: d.weightKg,
          weightLabel: formatMonth(`${key}-01`),
        });
      }
    }
    const list = [...buckets.values()];
    list.forEach((b) => {
      b.protein = b._protein;
      delete (b as Partial<TrendDatum & { _protein: number }>)._protein;
    });
    return list;
  }, [range, days, grouped, waterQuery.data, weightQuery.data]);
}