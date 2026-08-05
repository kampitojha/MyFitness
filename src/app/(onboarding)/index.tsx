import { useMemo, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TrendingDown, Minus, TrendingUp, Ruler, Weight as WeightIcon, Sparkles, ArrowRight } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Stepper } from '@/features/onboarding/components/stepper';
import { SelectableOption } from '@/features/onboarding/components/selectable-option';
import { useCompleteOnboarding, useProfile } from '@/hooks/use-profile';
import { useAuthStore } from '@/store/auth.store';
import type { ActivityLevel, Gender, GoalType } from '@/types/user';
import { ACTIVITY_LEVELS, defaultDailyGoals } from '@/types/user';
import { useTheme } from '@/hooks/use-theme';

const STEPS = 6;

const GOAL_OPTIONS: { value: GoalType; label: string; description: string; icon: React.ReactNode }[] = [
  { value: 'lose', label: 'Lose weight', description: 'Create a healthy calorie deficit', icon: <TrendingDown size={20} color="#0E7A4A" /> },
  { value: 'maintain', label: 'Maintain weight', description: 'Keep your current weight steady', icon: <Minus size={20} color="#0EA5E9" /> },
  { value: 'gain', label: 'Build muscle', description: 'Gain mass with a surplus', icon: <TrendingUp size={20} color="#8B5CF6" /> },
];

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const complete = useCompleteOnboarding();
  const { colors } = useTheme();
  const { data: profile } = useProfile();
  const authUser = useAuthStore((s) => s.user);

  const initialName = authUser?.name || profile?.name || '';

  const [step, setStep] = useState(0);
  const [name, setName] = useState(initialName);
  const [goalType, setGoalType] = useState<GoalType>('lose');
  const [gender, setGender] = useState<Gender>('other');
  const [age, setAge] = useState('28');
  const [heightCm, setHeightCm] = useState('172');
  const [weightKg, setWeightKg] = useState('70');
  const [targetWeightKg, setTargetWeightKg] = useState('65');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');

  const activity = ACTIVITY_LEVELS.find((a) => a.value === activityLevel);
  const goals = useMemo(
    () => defaultDailyGoals(activity?.factor ?? 1.55, goalType, {
      gender,
      age: Number(age) || 28,
      heightCm: Number(heightCm) || 172,
      weightKg: Number(weightKg) || 70,
    }),
    [activity, goalType, gender, age, heightCm, weightKg],
  );
  const canContinue = useMemo(() => {
    const num = (v: string) => Number(v) > 0;
    switch (step) {
      case 0: return name.trim().length > 0;
      case 1: return true;
      case 2: return num(age) && Number(age) >= 13 && Number(age) <= 100;
      case 3: return num(heightCm) && num(weightKg) && num(targetWeightKg);
      case 4: return true; // activity level
      case 5: return true; // plan summary / finish
      default: return true;
    }
  }, [step, name, age, heightCm, weightKg, targetWeightKg]);

  const handleNext = async () => {
    if (!canContinue) return;
    if (step < STEPS - 1) {
      setStep(step + 1);
      return;
    }
    await complete.mutateAsync({
      name,
      gender,
      age: Number(age),
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      targetWeightKg: Number(targetWeightKg),
      activityLevel,
      goalType,
      dailyGoals: goals,
      onboardingCompleted: true,
    });
    router.replace('/(tabs)');
  };

  const title = useMemo(() => {
    switch (step) {
      case 0: return 'Let’s get to know you';
      case 1: return 'What’s your goal?';
      case 2: return 'About you';
      case 3: return 'Your body';
      case 4: return 'Your activity level';
      case 5: return 'Your daily plan is ready';
      default: return '';
    }
  }, [step]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-background dark:bg-background-dark"
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }}
    >
      <View className="px-6 pb-4 flex-row items-center gap-3">
        {step > 0 ? (
          <PressableScale onPress={() => setStep(step - 1)} className="h-8 w-8 items-center justify-center rounded-full bg-surface dark:bg-neutral-900">
            <Text variant="headline" className="text-ink dark:text-neutral-50">‹</Text>
          </PressableScale>
        ) : <View className="w-8" />}
        <View className="flex-1">
          <Stepper step={step} total={STEPS} />
        </View>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
      >
        <View key={step} className="pt-2">
          <Text variant="title1" className="mb-1 text-ink dark:text-neutral-50 font-bold">
            {title}
          </Text>
          <Text variant="bodySmall" color="secondary" className="mb-6">
            Step {step + 1} of {STEPS}
          </Text>

          {step === 0 && (
            <View className="gap-4">
              <Input
                label="What should we call you?"
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                autoFocus={!initialName}
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => { if (canContinue) handleNext(); }}
              />
            </View>
          )}

          {step === 1 && (
            <View className="gap-3">
              {GOAL_OPTIONS.map((opt) => (
                <SelectableOption
                  key={opt.value}
                  label={opt.label}
                  description={opt.description}
                  icon={opt.icon}
                  selected={goalType === opt.value}
                  onPress={() => setGoalType(opt.value)}
                />
              ))}
            </View>
          )}

          {step === 2 && (
            <View className="gap-4">
              <View className="flex-row gap-2">
                {GENDER_OPTIONS.map((g) => (
                  <SelectableOption
                    key={g.value}
                    label={g.label}
                    selected={gender === g.value}
                    onPress={() => setGender(g.value)}
                  />
                ))}
              </View>
              <Input
                label="Your age"
                keyboardType="number-pad"
                value={age}
                onChangeText={setAge}
                placeholder="e.g. 28"
                returnKeyType="next"
                onSubmitEditing={() => { if (canContinue) handleNext(); }}
              />
            </View>
          )}

          {step === 3 && (
            <View className="gap-4">
              <Input
                label="Height (cm)"
                leftIcon={<Ruler size={18} color={colors.textMuted} />}
                keyboardType="decimal-pad"
                value={heightCm}
                onChangeText={setHeightCm}
                placeholder="e.g. 172"
              />
              <Input
                label="Current weight (kg)"
                leftIcon={<WeightIcon size={18} color={colors.textMuted} />}
                keyboardType="decimal-pad"
                value={weightKg}
                onChangeText={setWeightKg}
                placeholder="e.g. 70"
              />
              <Input
                label="Target weight (kg)"
                leftIcon={<WeightIcon size={18} color={colors.textMuted} />}
                keyboardType="decimal-pad"
                value={targetWeightKg}
                onChangeText={setTargetWeightKg}
                placeholder="e.g. 65"
                returnKeyType="done"
                onSubmitEditing={() => { if (canContinue) handleNext(); }}
              />
            </View>
          )}

          {step === 4 && (
            <View className="gap-3">
              {ACTIVITY_LEVELS.map((a) => (
                <SelectableOption
                  key={a.value}
                  label={a.label}
                  selected={activityLevel === a.value}
                  onPress={() => setActivityLevel(a.value)}
                />
              ))}
            </View>
          )}

          {step === 5 && (
            <View className="gap-4">
              <View className="rounded-3xl bg-primary-soft p-5 dark:bg-emerald-900">
                <View className="flex-row items-center gap-2">
                  <Sparkles size={18} color={colors.primary} />
                  <Text variant="subhead" weight="semibold" className="text-primary-softText dark:text-emerald-200">
                    Your personalized daily goals
                  </Text>
                </View>
                <View className="mt-4 flex-row justify-between">
                  <PlanStat label="Calories" value={`${goals.calories} kcal`} />
                  <PlanStat label="Protein" value={`${goals.protein} g`} />
                  <PlanStat label="Carbs" value={`${goals.carbs} g`} />
                  <PlanStat label="Fat" value={`${goals.fat} g`} />
                </View>
              </View>
              <Text variant="caption" color="muted" className="text-center">
                Based on your {activityLevel} activity level and goal to {goalType === 'lose' ? 'lose weight' : goalType === 'gain' ? 'build muscle' : 'maintain weight'}.
                You can always change these in Settings.
              </Text>
            </View>
          )}

          {/* Action Button Right Below Form */}
          <View className="mt-8">
            <Button
              label={step === STEPS - 1 ? 'Finish setup' : 'Continue'}
              onPress={handleNext}
              disabled={!canContinue}
              loading={step === STEPS - 1 && complete.isPending}
              fullWidth
              size="lg"
              icon={step < STEPS - 1 ? <ArrowRight size={18} color="#FFFFFF" /> : undefined}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function PlanStat({ label, value }: { label: string; value: string }) {
  return (
    <View className="items-center">
      <Text variant="headline" weight="bold" className="text-primary-softText dark:text-emerald-200">
        {value}
      </Text>
      <Text variant="caption2" className="text-primary-softText/70 dark:text-emerald-200/70">
        {label}
      </Text>
    </View>
  );
}