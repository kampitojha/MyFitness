import { useCallback, useMemo, useState } from 'react';
import { View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import {
  User, Mail, Cake, Ruler, Weight as WeightIcon,
  Target, TrendingDown, Minus, TrendingUp,
  Check, RefreshCw,
} from 'lucide-react-native';

import { Screen } from '@/components/ui/screen';
import { Header } from '@/components/ui/header';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Divider } from '@/components/ui/divider';
import { SelectableOption } from '@/features/onboarding/components/selectable-option';

import { useProfile, useUpsertProfile } from '@/hooks/use-profile';
import { useTheme } from '@/hooks/use-theme';
import { formatNumber } from '@/utils/number';
import {
  ACTIVITY_LEVELS, defaultDailyGoals,
  type ActivityLevel, type Gender, type GoalType,
} from '@/types/user';

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const GOAL_OPTIONS: { value: GoalType; label: string; description: string; icon: React.ReactNode }[] = [
  { value: 'lose', label: 'Lose weight', description: 'Create a healthy calorie deficit', icon: <TrendingDown size={18} color="#0E7A4A" /> },
  { value: 'maintain', label: 'Maintain weight', description: 'Keep your current weight steady', icon: <Minus size={18} color="#0EA5E9" /> },
  { value: 'gain', label: 'Build muscle', description: 'Gain mass with a calorie surplus', icon: <TrendingUp size={18} color="#8B5CF6" /> },
];

function SectionTitle({ label }: { label: string }) {
  return (
    <Text variant="title3" className="mb-3 mt-5 text-ink dark:text-neutral-50">
      {label}
    </Text>
  );
}

export default function EditProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { data: profile } = useProfile();
  const upsert = useUpsertProfile();

  // Personal
  const [name, setName] = useState(profile?.name ?? '');
  const [email, setEmail] = useState(profile?.email ?? '');
  const [gender, setGender] = useState<Gender>(profile?.gender ?? 'other');
  const [age, setAge] = useState(String(profile?.age ?? 28));

  // Body
  const [heightCm, setHeightCm] = useState(String(profile?.heightCm ?? 172));
  const [weightKg, setWeightKg] = useState(String(profile?.weightKg ?? 70));
  const [targetWeightKg, setTargetWeightKg] = useState(String(profile?.targetWeightKg ?? 65));

  // Fitness
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(profile?.activityLevel ?? 'moderate');
  const [goalType, setGoalType] = useState<GoalType>(profile?.goalType ?? 'maintain');

  // Suggested goals (recalculated live)
  const suggestedGoals = useMemo(() => {
    const activity = ACTIVITY_LEVELS.find((a) => a.value === activityLevel);
    return defaultDailyGoals(activity?.factor ?? 1.55, goalType);
  }, [activityLevel, goalType]);

  const isDirty = useMemo(() => {
    if (!profile) return true;
    return (
      name !== profile.name ||
      email !== (profile.email ?? '') ||
      gender !== profile.gender ||
      age !== String(profile.age) ||
      heightCm !== String(profile.heightCm) ||
      weightKg !== String(profile.weightKg) ||
      targetWeightKg !== String(profile.targetWeightKg) ||
      activityLevel !== profile.activityLevel ||
      goalType !== profile.goalType
    );
  }, [profile, name, email, gender, age, heightCm, weightKg, targetWeightKg, activityLevel, goalType]);

  const goalsChanged = useMemo(() => {
    if (!profile) return false;
    return activityLevel !== profile.activityLevel || goalType !== profile.goalType;
  }, [profile, activityLevel, goalType]);

  const isValid = useMemo(() => {
    return (
      name.trim().length > 0 &&
      Number(age) >= 13 && Number(age) <= 100 &&
      Number(heightCm) > 0 &&
      Number(weightKg) > 0 &&
      Number(targetWeightKg) > 0
    );
  }, [name, age, heightCm, weightKg, targetWeightKg]);

  const handleSave = useCallback(async (recalcGoals: boolean) => {
    const patch = {
      name: name.trim(),
      email: email.trim() || undefined,
      gender,
      age: Number(age),
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      targetWeightKg: Number(targetWeightKg),
      activityLevel,
      goalType,
      ...(recalcGoals ? { dailyGoals: suggestedGoals } : {}),
    };
    await upsert.mutateAsync(patch);
    router.back();
  }, [name, email, gender, age, heightCm, weightKg, targetWeightKg, activityLevel, goalType, suggestedGoals, upsert, router]);

  const onPressSave = useCallback(() => {
    if (!isValid) return;
    if (goalsChanged) {
      Alert.alert(
        'Recalculate Daily Goals?',
        `Your activity level or goal changed. Do you want to update your daily calorie & macro targets to ${suggestedGoals.calories} kcal?`,
        [
          { text: 'Keep existing', onPress: () => handleSave(false) },
          { text: 'Yes, recalculate', style: 'default', onPress: () => handleSave(true) },
        ],
      );
    } else {
      handleSave(false);
    }
  }, [isValid, goalsChanged, suggestedGoals, handleSave]);

  return (
    <Screen edges={['top']} contentContainerStyle={{ paddingBottom: 120 }}>
      <Header
        title="Edit Profile"
        onBack={() => router.back()}
        right={
          <Button
            label="Save"
            size="sm"
            variant="primary"
            onPress={onPressSave}
            disabled={!isDirty || !isValid}
            loading={upsert.isPending}
            icon={<Check size={16} color="#FFFFFF" />}
          />
        }
      />

      {/* ── Personal Info ── */}
      <SectionTitle label="Personal info" />
      <Card className="gap-4 p-4">
        <Input
          label="Full name"
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          autoCapitalize="words"
          leftIcon={<User size={18} color={colors.textMuted} />}
        />
        <Input
          label="Email (optional)"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon={<Mail size={18} color={colors.textMuted} />}
        />
        <Input
          label="Age"
          value={age}
          onChangeText={setAge}
          placeholder="e.g. 28"
          keyboardType="number-pad"
          leftIcon={<Cake size={18} color={colors.textMuted} />}
        />
      </Card>

      {/* ── Gender ── */}
      <SectionTitle label="Gender" />
      <View className="flex-row gap-2">
        {GENDER_OPTIONS.map((g) => (
          <Chip
            key={g.value}
            label={g.label}
            selected={gender === g.value}
            onPress={() => setGender(g.value)}
          />
        ))}
      </View>

      {/* ── Body ── */}
      <SectionTitle label="Body measurements" />
      <Card className="gap-4 p-4">
        <Input
          label="Height (cm)"
          value={heightCm}
          onChangeText={setHeightCm}
          placeholder="e.g. 172"
          keyboardType="decimal-pad"
          leftIcon={<Ruler size={18} color={colors.textMuted} />}
        />
        <Input
          label="Current weight (kg)"
          value={weightKg}
          onChangeText={setWeightKg}
          placeholder="e.g. 70"
          keyboardType="decimal-pad"
          leftIcon={<WeightIcon size={18} color={colors.textMuted} />}
        />
        <Input
          label="Target weight (kg)"
          value={targetWeightKg}
          onChangeText={setTargetWeightKg}
          placeholder="e.g. 65"
          keyboardType="decimal-pad"
          leftIcon={<Target size={18} color={colors.textMuted} />}
        />
      </Card>

      {/* ── Fitness Goal ── */}
      <SectionTitle label="Fitness goal" />
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

      {/* ── Activity Level ── */}
      <SectionTitle label="Activity level" />
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

      {/* ── Suggested Goals Preview ── */}
      {goalsChanged && (
        <>
          <Divider className="mt-6" />
          <View className="mt-4 rounded-2xl bg-primary-soft p-4 dark:bg-emerald-950">
            <View className="mb-3 flex-row items-center gap-2">
              <RefreshCw size={16} color="#0E7A4A" />
              <Text variant="subhead" weight="semibold" className="text-primary-softText dark:text-emerald-300">
                Updated daily plan (suggested)
              </Text>
            </View>
            <View className="flex-row justify-between">
              {([
                { label: 'Calories', value: `${formatNumber(suggestedGoals.calories)} kcal` },
                { label: 'Protein', value: `${formatNumber(suggestedGoals.protein)}g` },
                { label: 'Carbs', value: `${formatNumber(suggestedGoals.carbs)}g` },
                { label: 'Fat', value: `${formatNumber(suggestedGoals.fat)}g` },
              ] as const).map((item) => (
                <View key={item.label} className="items-center">
                  <Text variant="subhead" weight="bold" className="text-primary-softText dark:text-emerald-200">
                    {item.value}
                  </Text>
                  <Text variant="caption2" className="text-primary-softText/70 dark:text-emerald-400">
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
            <Text variant="caption" color="muted" className="mt-3 text-center dark:text-emerald-400/70">
              Tap Save → choose whether to apply these goals
            </Text>
          </View>
        </>
      )}

      {/* ── Save Button ── */}
      <Button
        label="Save changes"
        onPress={onPressSave}
        size="lg"
        fullWidth
        className="mt-6"
        disabled={!isDirty || !isValid}
        loading={upsert.isPending}
        icon={<Check size={18} color="#FFFFFF" />}
      />
    </Screen>
  );
}
