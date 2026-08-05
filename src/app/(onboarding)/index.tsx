import { useMemo, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TrendingDown, Minus, TrendingUp, Ruler, Weight as WeightIcon, Sparkles, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react-native';

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

const STEP_LABELS = [
  '1. Name',
  '2. Goal',
  '3. Details',
  '4. Body',
  '5. Activity',
  '6. Summary',
];

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
      case 4: return true;
      case 5: return true;
      default: return true;
    }
  }, [step, name, age, heightCm, weightKg, targetWeightKg]);

  const finishAndGoHome = async () => {
    try {
      await complete.mutateAsync({
        name: name.trim() || 'User',
        gender,
        age: Number(age) || 28,
        heightCm: Number(heightCm) || 172,
        weightKg: Number(weightKg) || 70,
        targetWeightKg: Number(targetWeightKg) || 65,
        activityLevel,
        goalType,
        dailyGoals: goals,
        onboardingCompleted: true,
      });
    } catch (err) {
      console.warn('Failed to complete onboarding profile, navigating anyway:', err);
    } finally {
      router.replace('/(tabs)');
    }
  };

  const handleNext = async () => {
    if (step < STEPS - 1) {
      setStep(step + 1);
      return;
    }
    await finishAndGoHome();
  };

  const title = useMemo(() => {
    switch (step) {
      case 0: return 'Let’s get to know you';
      case 1: return 'What’s your primary goal?';
      case 2: return 'Basic demographics';
      case 3: return 'Your body measurements';
      case 4: return 'Your daily activity level';
      case 5: return 'Your customized daily plan';
      default: return '';
    }
  }, [step]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-background dark:bg-background-dark"
      style={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 }}
    >
      <View className="px-5 pb-3">
        <View className="flex-row items-center gap-3 mb-2">
          {step > 0 ? (
            <PressableScale
              onPress={() => setStep(step - 1)}
              className="h-9 w-9 items-center justify-center rounded-full bg-surface shadow-sm dark:bg-neutral-900 border border-border/60"
            >
              <ArrowLeft size={18} color={colors.text} />
            </PressableScale>
          ) : (
            <View className="h-9 w-9" />
          )}

          <View className="flex-1">
            <Stepper step={step} total={STEPS} onStepPress={(targetStep) => setStep(targetStep)} />
          </View>

          <PressableScale
            onPress={finishAndGoHome}
            className="px-3 py-1.5 rounded-full bg-primary-600 dark:bg-emerald-500 shadow-sm"
          >
            <Text variant="caption2" weight="bold" className="text-white">
              Home 🏠
            </Text>
          </PressableScale>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 4, gap: 6 }}
          className="mt-1"
        >
          {STEP_LABELS.map((label, idx) => {
            const isCurrent = idx === step;
            const isPast = idx < step;
            return (
              <PressableScale
                key={idx}
                onPress={() => setStep(idx)}
                className={`flex-row items-center gap-1 px-3 py-1.5 rounded-full border ${
                  isCurrent
                    ? 'border-primary-600 bg-primary-600 dark:border-emerald-400 dark:bg-emerald-500'
                    : isPast
                    ? 'border-primary-500/30 bg-primary-500/10 dark:bg-emerald-950/40'
                    : 'border-border/60 bg-surface dark:bg-neutral-900'
                }`}
              >
                {isPast ? <CheckCircle2 size={12} color={colors.primary} /> : null}
                <Text
                  variant="caption2"
                  weight={isCurrent ? 'bold' : 'medium'}
                  className={
                    isCurrent
                      ? 'text-white'
                      : isPast
                      ? 'text-primary-600 dark:text-emerald-400'
                      : 'text-text-muted dark:text-neutral-400'
                  }
                >
                  {label}
                </Text>
              </PressableScale>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
      >
        <View key={step} className="pt-2">
          <View className="mb-4">
            <Text variant="title1" className="text-ink dark:text-neutral-50 font-bold">
              {title}
            </Text>
            <Text variant="bodySmall" color="secondary" className="mt-1">
              Step {step + 1} of {STEPS} — Complete your profile setup
            </Text>
          </View>

          {step === 0 && (
            <View className="gap-4">
              <Input
                label="What should we call you?"
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                autoFocus={!initialName}
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={handleNext}
              />
              <Text variant="caption" color="muted">
                Your name helps customize your daily health stats and fitness reports.
              </Text>
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
                  onPress={() => {
                    setGoalType(opt.value);
                  }}
                />
              ))}
            </View>
          )}

          {step === 2 && (
            <View className="gap-4">
              <Text variant="subhead" weight="medium" className="text-ink dark:text-neutral-200">
                Gender
              </Text>
              <View className="flex-row gap-2">
                {GENDER_OPTIONS.map((g) => (
                  <View key={g.value} className="flex-1">
                    <SelectableOption
                      label={g.label}
                      selected={gender === g.value}
                      onPress={() => setGender(g.value)}
                    />
                  </View>
                ))}
              </View>
              <Input
                label="Your age (years)"
                keyboardType="number-pad"
                value={age}
                onChangeText={setAge}
                placeholder="e.g. 28"
                returnKeyType="next"
                onSubmitEditing={handleNext}
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
                onSubmitEditing={handleNext}
              />
            </View>
          )}

          {step === 4 && (
            <View className="gap-3">
              {ACTIVITY_LEVELS.map((a) => (
                <SelectableOption
                  key={a.value}
                  label={a.label}
                  description={`Multiplier factor: ${a.factor}x BMR`}
                  selected={activityLevel === a.value}
                  onPress={() => setActivityLevel(a.value)}
                />
              ))}
            </View>
          )}

          {step === 5 && (
            <View className="gap-4">
              <View className="rounded-3xl bg-primary-soft p-5 dark:bg-emerald-950/80 border border-primary-500/20">
                <View className="flex-row items-center gap-2">
                  <Sparkles size={20} color={colors.primary} />
                  <Text variant="subhead" weight="bold" className="text-primary-softText dark:text-emerald-200">
                    Your calculated targets
                  </Text>
                </View>
                <View className="mt-4 flex-row justify-between">
                  <PlanStat label="Calories" value={`${goals.calories} kcal`} />
                  <PlanStat label="Protein" value={`${goals.protein} g`} />
                  <PlanStat label="Carbs" value={`${goals.carbs} g`} />
                  <PlanStat label="Fat" value={`${goals.fat} g`} />
                </View>
              </View>

              <View className="rounded-2xl bg-surface p-4 border border-border/60 dark:bg-neutral-900 gap-2">
                <Text variant="caption" color="secondary">
                  🎯 <Text weight="bold">Goal:</Text> {goalType === 'lose' ? 'Weight Loss' : goalType === 'gain' ? 'Muscle Gain' : 'Weight Maintenance'}
                </Text>
                <Text variant="caption" color="secondary">
                  🏋️ <Text weight="bold">Activity:</Text> {activityLevel} ({activity?.factor}x)
                </Text>
                <Text variant="caption" color="secondary">
                  ⚖️ <Text weight="bold">Weight Range:</Text> {weightKg} kg → Target {targetWeightKg} kg
                </Text>
              </View>

              <Text variant="caption" color="muted" className="text-center">
                You can adjust these goals anytime under Profile → Daily Goals.
              </Text>
            </View>
          )}

          <View className="mt-8 gap-3">
            <Button
              label={step === STEPS - 1 ? '🎉 Go to Home Dashboard' : `Continue to Step ${step + 2}`}
              onPress={finishAndGoHome}
              loading={complete.isPending}
              fullWidth
              size="lg"
              icon={step < STEPS - 1 ? <ArrowRight size={18} color="#FFFFFF" /> : <CheckCircle2 size={18} color="#FFFFFF" />}
            />

            {step > 0 ? (
              <Button
                label={`‹ Back to Step ${step}`}
                onPress={() => setStep(step - 1)}
                variant="ghost"
                fullWidth
              />
            ) : null}
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