import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants';
import { trackerService } from '@/services/tracker.service';
import { toISODate } from '@/utils/date';

export function useWaterTotal(date: string = toISODate()) {
  return useQuery({
    queryKey: ['water', date],
    queryFn: () => trackerService.totalWaterForDate(date),
  });
}

export function useAddWater() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ amountMl, date }: { amountMl: number; date?: string }) =>
      trackerService.addWater(amountMl, date),
    onSuccess: (_data, { date = toISODate() }) => {
      queryClient.invalidateQueries({ queryKey: ['water', date] });
    },
  });
}

export function useWeightForDate(date: string = toISODate()) {
  return useQuery({
    queryKey: ['weight', date],
    queryFn: () => trackerService.weightForDate(date),
  });
}

export function useUpsertWeight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ weightKg, date }: { weightKg: number; date?: string }) =>
      trackerService.upsertWeight(weightKg, date),
    onSuccess: (_data, { date = toISODate() }) => {
      queryClient.invalidateQueries({ queryKey: ['weight', date] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.weight });
    },
  });
}

export function useWeightSeries(days: number) {
  return useQuery({
    queryKey: [...QUERY_KEYS.weight, days],
    queryFn: () => trackerService.weightSeries(days),
  });
}

export function useWaterSeries(days: number) {
  return useQuery({
    queryKey: ['water-series', days],
    queryFn: () => trackerService.waterSeries(days),
  });
}