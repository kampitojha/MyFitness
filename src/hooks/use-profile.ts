import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants';
import { userService } from '@/services/user.service';
import type { UserProfile } from '@/types/user';

export function useProfile() {
  return useQuery({
    queryKey: QUERY_KEYS.profile,
    queryFn: () => userService.get(),
  });
}

export function useUpsertProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<UserProfile>) => userService.upsert(patch),
    onSuccess: (profile) => {
      queryClient.setQueryData(QUERY_KEYS.profile, profile);
    },
  });
}

export function useHasCompletedOnboarding() {
  return useQuery({
    queryKey: ['onboarding'],
    queryFn: () => userService.hasCompletedOnboarding(),
  });
}

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();
  const upsert = useUpsertProfile();
  return useMutation({
    mutationFn: async (profile: Partial<UserProfile>) => {
      await userService.setOnboarded(true);
      return upsert.mutateAsync({ ...profile, onboardingCompleted: true });
    },
    onSuccess: () => {
      queryClient.setQueryData(['onboarding'], true);
    },
  });
}