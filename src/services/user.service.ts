import { STORAGE_KEYS } from '@/constants';
import { readJSON, writeJSON } from '@/lib/storage';
import type { UserProfile } from '@/types/user';
import { createId } from '@/utils/id';

export interface UserRepository {
  get(): Promise<UserProfile | null>;
  upsert(profile: Partial<UserProfile> & { email?: string }): Promise<UserProfile>;
  hasCompletedOnboarding(): Promise<boolean>;
  setOnboarded(onboarded: boolean): Promise<void>;
}

export const userService: UserRepository = {
  async get() {
    return (await readJSON<UserProfile>(STORAGE_KEYS.profile)) ?? null;
  },

  async upsert(patch) {
    const existing = (await userService.get()) ?? null;
    const profile: UserProfile = {
      id: existing?.id ?? createId('user'),
      name: patch.name ?? existing?.name ?? '',
      email: patch.email ?? existing?.email,
      photoUri: patch.photoUri ?? existing?.photoUri,
      gender: patch.gender ?? existing?.gender ?? 'other',
      age: patch.age ?? existing?.age ?? 28,
      heightCm: patch.heightCm ?? existing?.heightCm ?? 175,
      weightKg: patch.weightKg ?? existing?.weightKg ?? 70,
      targetWeightKg: patch.targetWeightKg ?? existing?.targetWeightKg ?? 70,
      activityLevel: patch.activityLevel ?? existing?.activityLevel ?? 'moderate',
      goalType: patch.goalType ?? existing?.goalType ?? 'maintain',
      dailyGoals: patch.dailyGoals ?? existing?.dailyGoals ?? {
        calories: 2000,
        protein: 125,
        carbs: 225,
        fat: 67,
        waterMl: 2500,
      },
      onboardingCompleted: patch.onboardingCompleted ?? existing?.onboardingCompleted ?? false,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    };
    await writeJSON(STORAGE_KEYS.profile, profile);
    return profile;
  },

  async hasCompletedOnboarding() {
    const skills = await readJSON<{ onboarded: boolean }>(STORAGE_KEYS.onboarded);
    return skills?.onboarded ?? false;
  },

  async setOnboarded(onboarded) {
    await writeJSON(STORAGE_KEYS.onboarded, { onboarded });
  },
};