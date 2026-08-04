import { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Flame } from 'lucide-react-native';

import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Avatar } from '@/components/avatar';
import { Button } from '@/components/ui/button';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { CaloriesCard } from '@/features/home/components/calories-card';
import { WaterCard } from '@/features/home/components/water-card';
import { InsightCard } from '@/features/home/components/insight-card';
import { MealsSection } from '@/features/home/components/meals-section';

import { useProfile } from '@/hooks/use-profile';
import { useDailyTotals, useMealsForDate } from '@/hooks/use-meals';
import { useWaterTotal, useAddWater } from '@/hooks/use-tracker';

import { toISODate, formatLong } from '@/utils/date';
import { formatNumber } from '@/utils/number';
import { WATER_STEP_ML } from '@/constants/macros';

function greeting(date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const router = useRouter();
  const today = toISODate();

  const { data: profile } = useProfile();
  const { data: totals } = useDailyTotals(today);
  const { data: meals, isLoading: mealsLoading } = useMealsForDate(today);
  const waterTotal = useWaterTotal(today);
  const addWater = useAddWater();

  const [waterOpen, setWaterOpen] = useState(false);

  const macros = useMemo(
    () => totals ?? { calories: 0, protein: 0, carbs: 0, fat: 0 },
    [totals],
  );

  const goals = useMemo(
    () => profile?.dailyGoals ?? { calories: 2000, protein: 125, carbs: 225, fat: 67, waterMl: 2500 },
    [profile],
  );

  const handleAddWater = useCallback(() => setWaterOpen(true), []);

  const insight = useMemo(() => {
    if (!profile) {
      return { title: 'Welcome to NutraScan', message: 'Complete your profile to unlock personalized daily goals.' };
    }
    const proteinPct = goals.protein > 0 ? macros.protein / goals.protein : 0;
    if (proteinPct >= 0.9) {
      return { title: 'Protein goal hit', message: `You’ve reached your protein target of ${formatNumber(goals.protein)}g. Nice work!` };
    }
    if (macros.calories === 0) {
      return { title: 'Ready when you are', message: 'Scan your first meal and NutraScan will estimate its nutrition for you.' };
    }
    return { title: 'On a roll', message: `You’ve logged ${meals?.length ?? 0} meals so far today. Keep building the habit.` };
  }, [profile, goals, macros, meals]);

  const scanNow = useCallback(() => router.push('/scan'), [router]);

  return (
    <Screen edges={['top']} contentContainerStyle={{ paddingBottom: 130 }}>
      {/* Header */}
      <View className="mb-5 mt-2 flex-row items-center justify-between">
        <View className="gap-0.5">
          <Text variant="footnote" color="muted">
            {formatLong(today)}
          </Text>
          <Text variant="title2" className="text-ink dark:text-neutral-50">
            {greeting()}
          </Text>
        </View>
        <Avatar name={profile?.name} size={46} />
      </View>

      {!profile?.onboardingCompleted ? (
        <View className="mb-4">
          <Button
            label="Complete your profile"
            onPress={() => router.push('/(onboarding)')}
            variant="soft"
            icon={<Flame size={18} color="#0E7A4A" />}
          />
        </View>
      ) : null}

      <View className="gap-4">
        <CaloriesCard consumed={macros} goals={goals} />

        <WaterCard
          consumedMl={waterTotal.data ?? 0}
          targetMl={goals.waterMl}
          stepMl={WATER_STEP_ML}
          onAdd={handleAddWater}
        />

        <InsightCard title={insight.title} message={insight.message} />

        <MealsSection
          meals={meals ?? []}
          loading={mealsLoading}
          emptyActionLabel="Scan a meal"
          emptyActionOnPress={scanNow}
        />
      </View>

      <BottomSheet visible={waterOpen} onClose={() => setWaterOpen(false)} title="Log water">
        <View className="flex-row flex-wrap gap-3">
          {[1, 2, 3, 4].map((n) => (
            <Button
              key={n}
              label={`${n * WATER_STEP_ML} ml`}
              variant="soft"
              onPress={() => {
                addWater.mutate({ amountMl: n * WATER_STEP_ML, date: today });
                setWaterOpen(false);
              }}
            />
          ))}
        </View>
      </BottomSheet>
    </Screen>
  );
}