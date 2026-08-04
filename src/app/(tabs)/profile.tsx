import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Target, Ruler, Weight as WeightIcon, Cake, Zap, Bell,
  ShieldCheck, CircleHelp, MessageSquareText, LogOut, Scale, Sparkles, Settings,
} from 'lucide-react-native';

import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Avatar } from '@/components/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { SettingsRow } from '@/features/profile/components/settings-row';

import { useProfile, useUpsertProfile } from '@/hooks/use-profile';
import { useWeightForDate, useUpsertWeight } from '@/hooks/use-tracker';
import { useSettingsStore, type AppThemePreference } from '@/store/settings.store';
import { userService } from '@/services/user.service';
import { formatNumber } from '@/utils/number';

const THEME_OPTIONS: { value: AppThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { data: profile } = useProfile();
  const upsert = useUpsertProfile();

  const today = new Date().toISOString().slice(0, 10);
  const { data: todayWeight } = useWeightForDate(today);
  const upsertWeight = useUpsertWeight();

  const theme = useSettingsStore((s) => s.theme);
  const haptics = useSettingsStore((s) => s.hapticsEnabled);
  const notifications = useSettingsStore((s) => s.notificationsEnabled);
  const { setTheme, setHapticsEnabled, setNotificationsEnabled } = useSettingsStore();

  const [weightOpen, setWeightOpen] = useState(false);
  const [goalsOpen, setGoalsOpen] = useState(false);
  const [weightInput, setWeightInput] = useState(profile?.weightKg?.toString() ?? '');

  const goals = profile?.dailyGoals;

  const logWeight = () => {
    const value = Number(weightInput);
    if (value > 0) upsertWeight.mutate({ weightKg: value, date: today });
    setWeightOpen(false);
  };

  const signOut = async () => {
    await userService.setOnboarded(false);
    router.replace('/(onboarding)');
  };

  return (
    <Screen edges={['top']} contentContainerStyle={{ paddingBottom: 130 }}>
      <View className="mb-5 mt-2">
        <Text variant="title1" className="text-ink dark:text-neutral-50">
          Profile
        </Text>
      </View>

      <View className="mb-5 flex-row items-center gap-4 rounded-[24px] bg-surface p-5 shadow-sm dark:bg-neutral-900">
        <Avatar name={profile?.name} uri={profile?.photoUri} size={64} />
        <View className="flex-1 gap-0.5">
          <Text variant="title3" weight="bold">
            {profile?.name || 'Welcome'}
          </Text>
          <Text variant="caption" color="secondary">
            {profile?.email ?? 'Logged in as guest'}
          </Text>
          <Text variant="caption" color="muted" className="mt-0.5 capitalize">
            Goal: {profile?.goalType ?? '—'} · {formatNumber(profile?.age ?? 0)}y
          </Text>
        </View>
      </View>

      <View className="mb-5 flex-row gap-3">
        <StatBlock label="Current" value={`${formatNumber(profile?.weightKg ?? 0, 1)} kg`} icon={<Scale size={16} color="#0E7A4A" />} />
        <StatBlock label="Target" value={`${formatNumber(profile?.targetWeightKg ?? 0, 1)} kg`} icon={<Target size={16} color="#0E7A4A" />} />
        <StatBlock label="Height" value={`${formatNumber(profile?.heightCm ?? 0)} cm`} icon={<Ruler size={16} color="#0E7A4A" />} />
      </View>

      <Text variant="title3" className="mb-3 text-ink dark:text-neutral-50">
        Body & goals
      </Text>
      <View className="mb-5">
        <SettingsRow
          label="Log today’s weight"
          icon={<WeightIcon size={18} color="#0E7A4A" />}
          value={todayWeight ? `${formatNumber(todayWeight.weightKg, 1)} kg` : undefined}
          onPress={() => { setWeightInput(profile?.weightKg?.toString() ?? ''); setWeightOpen(true); }}
        />
        <SettingsRow
          label="Daily goals"
          icon={<Target size={18} color="#0E7A4A" />}
          value={goals ? `${formatNumber(goals.calories)} kcal` : undefined}
          onPress={() => setGoalsOpen(true)}
        />
        <SettingsRow
          label="Body details"
          icon={<Cake size={18} color="#0E7A4A" />}
          onPress={() => router.push('/(onboarding)')}
        />
      </View>

      <Text variant="title3" className="mb-3 text-ink dark:text-neutral-50">
        Preferences
      </Text>
      <View className="mb-5 rounded-2xl bg-surface p-4 shadow-sm dark:bg-neutral-900">
        <View className="mb-3 flex-row items-center gap-3">
          <View className="h-9 w-9 items-center justify-center rounded-xl bg-surface-alt dark:bg-neutral-800">
            <Settings size={18} color="#0E7A4A" />
          </View>
          <Text variant="body" weight="medium">
            Appearance
          </Text>
        </View>
        <SegmentedControl options={THEME_OPTIONS} value={theme} onChange={setTheme} className="w-full" />
      </View>

      <SettingsRow
        label="Haptics"
        icon={<Zap size={18} color="#0E7A4A" />}
        switchValue={haptics}
        onSwitchChange={setHapticsEnabled}
      />
      <SettingsRow
        label="Notifications"
        icon={<Bell size={18} color="#0E7A4A" />}
        switchValue={notifications}
        onSwitchChange={setNotificationsEnabled}
      />
      <SettingsRow
        label="Privacy"
        icon={<ShieldCheck size={18} color="#0E7A4A" />}
      />

      <Text variant="title3" className="mb-3 mt-5 text-ink dark:text-neutral-50">
        Support
      </Text>
      <SettingsRow
        label="Help & FAQ"
        icon={<CircleHelp size={18} color="#0E7A4A" />}
      />
      <SettingsRow
        label="Send feedback"
        icon={<MessageSquareText size={18} color="#0E7A4A" />}
      />
      <SettingsRow
        label="Upgrade to Premium"
        icon={<Sparkles size={18} color="#8B5CF6" />}
        value="Soon"
      />

      <Button
        label="Sign out"
        variant="ghost"
        onPress={signOut}
        className="mt-6"
        icon={<LogOut size={18} color="#DC2626" />}
      />

      <BottomSheet visible={weightOpen} onClose={() => setWeightOpen(false)} title="Log weight">
        <Input
          label="Weight (kg)"
          keyboardType="decimal-pad"
          value={weightInput}
          onChangeText={setWeightInput}
          placeholder="e.g. 70.5"
          autoFocus
        />
        <Button label="Save weight" onPress={logWeight} className="mt-4" fullWidth disabled={!(Number(weightInput) > 0)} loading={upsertWeight.isPending} />
      </BottomSheet>

      <BottomSheet visible={goalsOpen} onClose={() => setGoalsOpen(false)} title="Daily goals">
        <GoalsView goals={goals} onSave={(patch) => { upsert.mutate({ dailyGoals: { ...(goals ?? { calories: 2000, protein: 125, carbs: 225, fat: 67, waterMl: 2500 }), ...patch } }); setGoalsOpen(false); }} />
      </BottomSheet>
    </Screen>
  );
}

function StatBlock({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <View className="flex-1 items-center rounded-[20px] bg-surface py-4 shadow-sm dark:bg-neutral-900">
      {icon}
      <Text variant="subhead" weight="bold" className="mt-1.5 text-ink dark:text-neutral-50">
        {value}
      </Text>
      <Text variant="caption2" color="muted">
        {label}
      </Text>
    </View>
  );
}

function GoalsView({ goals, onSave }: { goals?: { calories: number; protein: number; carbs: number; fat: number; waterMl: number }; onSave: (patch: Record<string, number>) => void }) {
  const [calories, setCalories] = useState(goals?.calories?.toString() ?? '2000');
  const [protein, setProtein] = useState(goals?.protein?.toString() ?? '125');
  const [carbs, setCarbs] = useState(goals?.carbs?.toString() ?? '225');
  const [fat, setFat] = useState(goals?.fat?.toString() ?? '67');

  return (
    <View className="gap-3">
      <Input label="Calories (kcal)" keyboardType="number-pad" value={calories} onChangeText={setCalories} />
      <View className="flex-row gap-3">
        <View className="flex-1"><Input label="Protein (g)" keyboardType="number-pad" value={protein} onChangeText={setProtein} /></View>
        <View className="flex-1"><Input label="Carbs (g)" keyboardType="number-pad" value={carbs} onChangeText={setCarbs} /></View>
      </View>
      <Input label="Fat (g)" keyboardType="number-pad" value={fat} onChangeText={setFat} />
      <Button
        label="Save goals"
        onPress={() => {
          const n = (s: string) => Math.max(0, Number(s) || 0);
          onSave({ calories: n(calories), protein: n(protein), carbs: n(carbs), fat: n(fat) });
        }}
        fullWidth
        className="mt-2"
      />
    </View>
  );
}