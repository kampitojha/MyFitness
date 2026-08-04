import { useMemo, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TrendingDown, Minus, TrendingUp, Ruler, Weight as WeightIcon, Sparkles } from 'lucide-react-native';
import { MotiView } from 'moti';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Stepper } from '@/features/onboarding/components/stepper';
import { SelectableOption } from '@/features/onboarding/components/selectable-option';
import { useCompleteOnboarding } from '@/hooks/use-profile';
import type { ActivityLevel, Gender, GoalType } from '@/types/user';
import { ACTIVITY_LEVELS, defaultDailyGoals } from '@/types/user';
import { useTheme } from '@/hooks/use-theme';

const STEPS = 5;

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

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [goalType, setGoalType] = useState<GoalType>('lose');
  const [gender, setGender] = useState<Gender>('other');
  const [age, setAge] = useState('28');
  const [heightCm, setHeightCm] = useState('172');
  const [weightKg, setWeightKg] = useState('70');
  const [targetWeightKg, setTargetWeightKg] = useState('65');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');

  const activity = ACTIVITY_LEVELS.find((a) => a.value === activityLevel);
  const goals = useMemo(
    () => defaultDailyGoals(activity?.factor ?? 1.55, goalType),
    [activity, goalType],
  );
  const canContinue = useMemo(() => {
    const num = (v: string) => Number(v) > 0;
    switch (step) {
      case 0: return name.trim().length > 0;
      case 1: return true;
      case 2: return num(age) && Number(age) >= 13 && Number(age) <= 100;
      case 3: return num(heightCm) && num(weightKg) && num(targetWeightKg);
      case 4: return true;
      default: return true;
    }
  }, [step, name, age, heightCm, weightKg, targetWeightKg]);

  const handleNext = async () => {
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
      default: return '';
    }
  }, [step]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-background dark:bg-background-dark"
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 12 }}
    >
      <View className="px-6 pb-5">
        <Stepper step={step} total={STEPS} />
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-6"
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        <MotiView
          key={step}
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 280 }}
        >
          <Text variant="title1" className="mb-2 text-ink dark:text-neutral-50">
            {title}
          </Text>
          <Text variant="bodySmall" color="secondary" className="mb-6">
            Step {step + 1} of {STEPS}
          </Text>

          {step === 0 && (
            <View className="gap-3">
              <Input
                label="What should we call you?"
                value={name}
                onChangeText={setName}
                placeholder="Your first name"
                autoFocus
                autoCapitalize="words"
              />
              <View className="mt-2 flex-row justify-center gap-1">
                <Text variant="bodySmall" color="secondary">
                  Already have an account?
                </Text>
                <Text
                  variant="bodySmall"
                  weight="semibold"
                  color="primary"
                  onPress={() => router.push('/(auth)/login')}
                >
                  Log in
                </Text>
              </View>
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
            <View className="gap-3">
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
              />
            </View>
          )}

          {step === 3 && (
            <View className="gap-3">
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

          {step === STEPS - 1 && (
            <View className="gap-3">
              <View className="rounded-[24px] bg-primary-soft p-5 dark:bg-emerald-900">
                <View className="flex-row items-center gap-2">
                  <Sparkles size={18} color={colors.primary} />
                  <Text variant="subhead" weight="semibold" className="text-primary-softText dark:text-emerald-200">
                    Your daily plan
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
                You can adjust these anytime in Settings.
              </Text>
            </View>
          )}
        </MotiView>
      </ScrollView>

      <View className="px-6">
        <Button
          label={step === STEPS - 1 ? 'Finish' : 'Continue'}
          onPress={handleNext}
          disabled={!canContinue}
          loading={step === STEPS - 1 && complete.isPending}
          fullWidth
          size="lg"
        />
      </View>
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