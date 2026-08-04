import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supplementService } from '@/services/supplement.service';
import { toISODate } from '@/utils/date';

const KEYS = {
  list: ['supplements'] as const,
};

export function useSupplements() {
  return useQuery({
    queryKey: KEYS.list,
    queryFn: () => supplementService.list(),
  });
}

export function useAddSupplement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ name, dose, timesPerDay }: { name: string; dose: string; timesPerDay?: number }) =>
      supplementService.add(name, dose, timesPerDay),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.list }),
  });
}

export function useToggleSupplement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, taken }: { id: string; taken: boolean }) => {
      if (taken) await supplementService.markUntaken(id);
      else await supplementService.markTaken(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.list }),
  });
}

export function useRemoveSupplement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => supplementService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.list }),
  });
}

export function useSupplementsToday() {
  const { data: supplements = [] } = useSupplements();
  const today = toISODate();
  const taken = supplements.filter((s) => s.takenDates.includes(today)).length;
  return { supplements, taken, total: supplements.length };
}
