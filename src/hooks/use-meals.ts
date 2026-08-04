import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants';
import { mealService } from '@/services/meal.service';
import type { Meal, MealDraft } from '@/types/meals';
import type { Macros } from '@/types/nutrition';

export function useMeals() {
  return useQuery({
    queryKey: QUERY_KEYS.meals,
    queryFn: () => mealService.list(),
  });
}

export function useMeal(id: string) {
  return useQuery({
    queryKey: ['meal', id],
    queryFn: () => mealService.getById(id),
    enabled: Boolean(id),
  });
}

export function useMealsForDate(date: string) {
  return useQuery({
    queryKey: QUERY_KEYS.history(date),
    queryFn: () => mealService.byDate(date),
  });
}

export function useDailyTotals(date: string) {
  return useQuery({
    queryKey: ['totals', date],
    queryFn: () => mealService.totalsForDate(date),
  });
}

export function useSaveMeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ draft, date }: { draft: MealDraft; date?: string }) =>
      mealService.save(draft, date),
    onSuccess: (meal) => {
      const date = meal.createdAt.slice(0, 10);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.meals });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.history(date) });
      queryClient.invalidateQueries({ queryKey: ['totals', date] });
    },
  });
}

export function useDeleteMeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mealService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.meals });
      queryClient.invalidateQueries({ queryKey: ['history'] });
      queryClient.invalidateQueries({ queryKey: ['totals'] });
    },
  });
}

export function useTodayMacros(): { macros: Macros; isLoading: boolean } {
  const today = new Date().toISOString().slice(0, 10);
  const { data, isLoading } = useDailyTotals(today);
  return {
    macros: data ?? { calories: 0, protein: 0, carbs: 0, fat: 0 },
    isLoading,
  };
}

export function useAllMealsSummary() {
  const { data: meals } = useMeals();
  const grouped = (meals ?? []).reduce<Record<string, Meal[]>>((acc, meal) => {
    const key = meal.createdAt.slice(0, 10);
    (acc[key] ??= []).push(meal);
    return acc;
  }, {});
  return grouped;
}