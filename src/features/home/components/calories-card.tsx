import { View } from 'react-native';
import { Flame } from 'lucide-react-native';
import { MacroRing } from '@/components/ui/macro-ring';
import { Text } from '@/components/ui/text';
import { AnimatedNumber } from '@/components/ui/animated-number';
import type { DailyGoals } from '@/types/user';
import type { Macros } from '@/types/nutrition';
import { MACRO_COLORS, MACRO_ORDER } from '@/constants/macros';
import { statusColors } from '@/theme/colors';
import { formatNumber, clamp } from '@/utils/number';

export interface CaloriesCardProps {
  consumed: Macros;
  goals: DailyGoals;
  burnedCalories?: number;
}

export function CaloriesCard({ consumed, goals, burnedCalories = 0 }: CaloriesCardProps) {
  const pct = clamp(consumed.calories / goals.calories, 0, 1);
  const diff = goals.calories - consumed.calories + burnedCalories;
  const isOver = diff < 0;
  const amount = Math.abs(diff);

  const macroRows = MACRO_ORDER.filter((m) => m !== 'calories').map((key) => {
    const value = consumed[key];
    const target = goals[key];
    return { key, value, target };
  });

  return (
    <View className="rounded-3xl bg-surface p-5 shadow-sm dark:bg-neutral-900">
      <View className="items-center">
        <MacroRing value={pct * 100} size={196} strokeWidth={16} color={MACRO_COLORS.calories}>
          <View className="items-center">
            <View className="flex-row items-end gap-1">
              <AnimatedNumber
                value={consumed.calories}
                className="font-display text-[34px] font-bold leading-[36px] text-ink dark:text-neutral-50"
              />
              <Text variant="caption" color="muted" className="mb-1.5">
                / {formatNumber(goals.calories)}
              </Text>
            </View>
            <Text variant="caption" color="muted">
              calories consumed
            </Text>
          </View>
        </MacroRing>

        <View
          className={
            isOver
              ? 'mt-4 flex-row items-center justify-center gap-1.5 rounded-full bg-danger-soft px-4 py-1.5 dark:bg-red-950'
              : 'mt-4 flex-row items-center justify-center gap-1.5 rounded-full bg-primary-soft px-4 py-1.5 dark:bg-emerald-900'
          }
        >
          <Flame size={14} color={isOver ? statusColors.danger : MACRO_COLORS.calories} />
          <Text
            variant="footnote"
            weight="semibold"
            className={isOver ? 'text-danger dark:text-red-300' : 'text-primary-softText dark:text-emerald-300'}
          >
            {isOver ? `${formatNumber(amount)} kcal over` : `${formatNumber(amount)} kcal remaining`}
            {burnedCalories > 0 ? ` (incl. -${formatNumber(burnedCalories)} workout)` : ''}
          </Text>
        </View>
      </View>

      <View className="mt-5 flex-row gap-3">
        {macroRows.map((row) => {
          const p = clamp(row.value / row.target, 0, 1);
          return (
            <View key={row.key} className="flex-1">
              <Text variant="caption" weight="semibold" className="mb-1 capitalize text-ink-muted dark:text-neutral-500">
                {row.key}
              </Text>
              <View className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                <View
                  style={{ width: `${p * 100}%`, backgroundColor: MACRO_COLORS[row.key] }}
                  className="h-full rounded-full"
                />
              </View>
              <View className="mt-1.5 flex-row items-baseline justify-between">
                <Text variant="footnote" weight="semibold" className="text-ink dark:text-neutral-100">
                  {formatNumber(row.value)}g
                </Text>
                <Text variant="caption2" color="muted">
                  {row.target}g
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}