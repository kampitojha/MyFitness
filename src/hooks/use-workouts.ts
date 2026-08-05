import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { workoutService } from '@/services/workout.service';

export function useWorkoutsForDate(date: string) {
  return useQuery({
    queryKey: ['workouts', date],
    queryFn: () => workoutService.byDate(date),
  });
}

export function useWorkoutBurnForDate(date: string) {
  return useQuery({
    queryKey: ['workout_burn', date],
    queryFn: () => workoutService.totalBurnForDate(date),
  });
}

export function useSaveWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      type,
      name,
      durationMinutes,
      date,
    }: {
      type: string;
      name: string;
      durationMinutes: number;
      date: string;
    }) => workoutService.save(type, name, durationMinutes, date),
    onSuccess: (_, { date }) => {
      queryClient.invalidateQueries({ queryKey: ['workouts', date] });
      queryClient.invalidateQueries({ queryKey: ['workout_burn', date] });
    },
  });
}

export function useDeleteWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => workoutService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      queryClient.invalidateQueries({ queryKey: ['workout_burn'] });
    },
  });
}
