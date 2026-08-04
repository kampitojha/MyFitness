import { View } from 'react-native';
import { useMemo } from 'react';
import { Trophy, Flame, Beef } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { useTrends } from '@/hooks/use-trends';
import { useProfile } from '@/hooks/use-profile';
import { formatNumber } from '@/utils/number';

export function WeeklyReportCard() {
  const trends = useTrends('week');
  const { data: profile } = useProfile();

  const calGoal = profile?.dailyGoals.calories ?? 2000;
  const proteinGoal = profile?.dailyGoals.protein ?? 125;

  const stats = useMemo(() => {
    if (!trends.length) return { daysHitCal: 0, daysHitProtein: 0, avgCal: 0, avgProtein: 0, totalDays: 0 };
    let daysHitCal = 0;
    let daysHitProtein = 0;
    let sumCal = 0;
    let sumProtein = 0;

    trends.forEach((t) => {
      sumCal += t.calories;
      sumProtein += t.protein;
      if (t.calories > 0 && Math.abs(t.calories - calGoal) <= calGoal * 0.15) daysHitCal++;
      if (t.protein >= proteinGoal * 0.9) daysHitProtein++;
    });

    return {
      daysHitCal,
      daysHitProtein,
      avgCal: Math.round(sumCal / trends.length),
      avgProtein: Math.round(sumProtein / trends.length),
      totalDays: trends.length,
    };
  }, [trends, calGoal, proteinGoal]);

  const scoreText = useMemo(() => {
    if (stats.daysHitProtein >= 5) return '🔥 Incredible Consistency!';
    if (stats.daysHitProtein >= 3) return '👍 Great Progress This Week!';
    return '💪 Keep Pushing, You Got This!';
  }, [stats.daysHitProtein]);

  return (
    <Card className="p-4 bg-gradient-to-br from-emerald-500/10 via-primary-500/5 to-transparent dark:from-emerald-950/40 dark:border-emerald-900/50">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <Trophy size={20} color="#0E7A4A" />
          <Text variant="subhead" weight="bold">
            Weekly Performance Report
          </Text>
        </View>
        <Text variant="caption" weight="semibold" className="text-primary-600 dark:text-emerald-400">
          {stats.daysHitProtein}/{stats.totalDays} Days Goal Met
        </Text>
      </View>

      <Text variant="headline" weight="bold" className="mb-4 text-ink dark:text-neutral-50">
        {scoreText}
      </Text>

      <View className="flex-row gap-3">
        <View className="flex-1 rounded-xl bg-surface/80 p-3 dark:bg-neutral-800/80 border border-border/50 dark:border-neutral-700">
          <View className="flex-row items-center gap-1.5 mb-1">
            <Flame size={14} color="#F97316" />
            <Text variant="caption2" color="muted">Avg Calories</Text>
          </View>
          <Text variant="body" weight="bold">
            {formatNumber(stats.avgCal)} <Text variant="caption2" color="muted">kcal</Text>
          </Text>
          <Text variant="caption2" className="mt-1" color={stats.avgCal <= calGoal + 200 ? 'secondary' : 'muted'}>
            Target: {calGoal} kcal
          </Text>
        </View>

        <View className="flex-1 rounded-xl bg-surface/80 p-3 dark:bg-neutral-800/80 border border-border/50 dark:border-neutral-700">
          <View className="flex-row items-center gap-1.5 mb-1">
            <Beef size={14} color="#EC4899" />
            <Text variant="caption2" color="muted">Avg Protein</Text>
          </View>
          <Text variant="body" weight="bold">
            {formatNumber(stats.avgProtein)} <Text variant="caption2" color="muted">g</Text>
          </Text>
          <Text variant="caption2" className="mt-1" color={stats.avgProtein >= proteinGoal * 0.9 ? 'secondary' : 'muted'}>
            Target: {proteinGoal}g
          </Text>
        </View>
      </View>
    </Card>
  );
}
