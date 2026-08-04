import { useMemo, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Flame, Beef, Droplets, Weight as WeightIcon, Trophy } from 'lucide-react-native';

import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { MetricCard } from '@/features/progress/components/metric-card';
import { AreaChart } from '@/features/progress/components/area-chart';
import { BarChart } from '@/features/progress/components/bar-chart';
import { StreakCard } from '@/features/progress/components/streak-card';
import { AchievementCard } from '@/features/progress/components/achievement-card';

import { useTrends } from '@/hooks/use-trends';
import { useAchievements } from '@/hooks/use-achievements';
import { useProfile } from '@/hooks/use-profile';

import { MACRO_COLORS } from '@/constants/macros';
import type { TimeRange } from '@/types/progress';
import { formatNumber, percent } from '@/utils/number';

const RANGES: { value: TimeRange; label: string }[] = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

export default function ProgressScreen() {
  const { width } = useWindowDimensions();
  const { data: profile } = useProfile();
  const [range, setRange] = useState<TimeRange>('week');

  const trends = useTrends(range);
  const { achievements, currentStreak, longestStreak } = useAchievements();

  const chartWidth = useMemo(() => Math.min(width - 40 - 40, 360), [width]);
  const hasWeight = useMemo(() => trends.some((t) => t.weightKg !== undefined), [trends]);

  const averages = useMemo(() => {
    if (trends.length === 0) return { calories: 0, protein: 0, waterMl: 0 };
    return {
      calories: Math.round(trends.reduce((s, t) => s + t.calories, 0) / trends.length),
      protein: Math.round(trends.reduce((s, t) => s + t.protein, 0) / trends.length),
      waterMl: Math.round(trends.reduce((s, t) => s + t.waterMl, 0) / trends.length),
    };
  }, [trends]);

  const goalCalories = profile?.dailyGoals.calories ?? 2000;
  const goalProtein = profile?.dailyGoals.protein ?? 125;

  return (
    <Screen edges={['top']} contentContainerStyle={{ paddingBottom: 130 }}>
      <View className="mb-4 mt-2">
        <Text variant="title1" className="text-ink dark:text-neutral-50">
          Progress
        </Text>
        <Text variant="bodySmall" color="secondary">
          Your nutrition, week over week
        </Text>
      </View>

      <SegmentedControl options={RANGES} value={range} onChange={setRange} className="mb-5" />

      <View className="mb-5 flex-row gap-3">
        <MetricCard label="Avg calories" value={averages.calories} unit="kcal" color={MACRO_COLORS.calories} icon={<Flame size={15} color={MACRO_COLORS.calories} />} />
        <MetricCard label="Avg protein" value={averages.protein} unit="g" color={MACRO_COLORS.protein} icon={<Beef size={15} color={MACRO_COLORS.protein} />} />
      </View>

      <View className="mb-4">
        <MetricCard label="Avg water" value={averages.waterMl} unit="ml" color="#0EA5E9" icon={<Droplets size={16} color="#0EA5E9" />} />
      </View>

      <Text variant="title3" className="mb-3 text-ink dark:text-neutral-50">
        Weight trend
      </Text>
      <View className="mb-5 rounded-[22px] bg-surface p-4 shadow-sm dark:bg-neutral-900">
        {hasWeight ? (
          <AreaChart
            data={trends.filter((t) => t.weightKg !== undefined)}
            width={chartWidth}
            height={160}
            valueKey="weightKg"
            color={MACRO_COLORS.calories}
            valueLabel={(v) => `${formatNumber(v, 1)}kg`}
          />
        ) : (
          <View className="h-40 items-center justify-center">
            <WeightIcon size={26} color="#9AA3AF" />
            <Text variant="caption" color="muted" className="mt-2">
              Log your weight to see trends here
            </Text>
          </View>
        )}
      </View>

      <Text variant="title3" className="mb-3 text-ink dark:text-neutral-50">
        Calories trend
      </Text>
      <View className="mb-5 rounded-[22px] bg-surface p-4 shadow-sm dark:bg-neutral-900">
        <BarChart
          data={trends}
          width={chartWidth}
          height={170}
          color={MACRO_COLORS.calories}
          valueKey="calories"
          goal={goalCalories}
        />
      </View>

      <Text variant="title3" className="mb-3 text-ink dark:text-neutral-50">
        Protein trend
      </Text>
      <View className="mb-5 rounded-[22px] bg-surface p-4 shadow-sm dark:bg-neutral-900">
        <BarChart
          data={trends}
          width={chartWidth}
          height={150}
          color={MACRO_COLORS.protein}
          valueKey="protein"
          goal={goalProtein}
        />
      </View>

      <StreakCard current={currentStreak} longest={longestStreak} />

      <View className="mb-3 mt-6 flex-row items-center gap-2">
        <Trophy size={18} color="#0E7A4A" />
        <Text variant="title3" className="text-ink dark:text-neutral-50">
          Achievements
        </Text>
      </View>
      <View className="gap-3">
        {achievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            title={achievement.title}
            description={achievement.description}
            unlockedAt={achievement.unlockedAt}
            progress={achievement.progress}
          />
        ))}
      </View>
      <Text variant="caption" color="muted" className="mt-4 text-center">
        {percent(averages.calories, goalCalories)}% of daily calorie goal on average
      </Text>
    </Screen>
  );
}