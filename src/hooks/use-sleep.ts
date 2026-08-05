import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sleepService } from '@/services/sleep.service';
import type { SleepLog } from '@/services/sleep.service';
import { toISODate } from '@/utils/date';

const KEYS = {
  list: ['sleep'] as const,
  today: (date: string) => ['sleep', date] as const,
  week: ['sleep', 'week'] as const,
};

export function useSleepLogs() {
  return useQuery({
    queryKey: KEYS.list,
    queryFn: () => sleepService.list(),
  });
}

export function useSleepToday() {
  const today = toISODate();
  return useQuery({
    queryKey: KEYS.today(today),
    queryFn: () => sleepService.forDate(today),
  });
}

export function useSleepWeek() {
  return useQuery({
    queryKey: KEYS.week,
    queryFn: () => sleepService.last7Days(),
  });
}

export function useLogSleep() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (entry: Omit<SleepLog, 'id'>) => sleepService.logSleep(entry),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.list });
      qc.invalidateQueries({ queryKey: KEYS.week });
      const today = toISODate();
      qc.invalidateQueries({ queryKey: KEYS.today(today) });
    },
  });
}

export function useDeleteSleep() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sleepService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.list });
      qc.invalidateQueries({ queryKey: KEYS.week });
    },
  });
}
