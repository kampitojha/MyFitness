export type Gender = 'male' | 'female' | 'other';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
export type GoalType = 'lose' | 'maintain' | 'gain';

export interface DailyGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  waterMl: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  photoUri?: string;
  gender: Gender;
  age: number;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  activityLevel: ActivityLevel;
  goalType: GoalType;
  dailyGoals: DailyGoals;
  onboardingCompleted: boolean;
  createdAt: string;
}

export const ACTIVITY_LEVELS: { value: ActivityLevel; label: string; factor: number }[] = [
  { value: 'sedentary', label: 'Sedentary', factor: 1.2 },
  { value: 'light', label: 'Lightly active', factor: 1.375 },
  { value: 'moderate', label: 'Moderately active', factor: 1.55 },
  { value: 'active', label: 'Very active', factor: 1.725 },
  { value: 'veryActive', label: 'Extremely active', factor: 1.9 },
];

export function defaultDailyGoals(activityFactor: number, goalType: GoalType): DailyGoals {
  const bmr = 10 * 70 + 6.25 * 175 - 5 * 28 + 5;
  let tdee = bmr * activityFactor;
  if (goalType === 'lose') tdee -= 500;
  if (goalType === 'gain') tdee += 250;

  const protein = Math.round(tdee * 0.25 / 4);
  const carbs = Math.round(tdee * 0.45 / 4);
  const fat = Math.round(tdee * 0.3 / 9);

  return {
    calories: Math.round(tdee),
    protein,
    carbs,
    fat,
    waterMl: 2500,
  };
}