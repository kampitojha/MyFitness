import { View } from 'react-native';
import { Flame } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { AnimatedNumber } from '@/components/ui/animated-number';

export interface StreakCardProps {
  current: number;
  longest: number;
}

export function StreakCard({ current, longest }: StreakCardProps) {
  return (
    <View className="flex-row items-center justify-between rounded-[22px] bg-surface p-5 shadow-sm dark:bg-neutral-900">
      <View className="flex-row items-center gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-950">
          <Flame size={22} color="#F97316" />
        </View>
        <View>
          <View className="flex-row items-baseline gap-1">
            <AnimatedNumber value={current} className="font-display text-[28px] font-bold leading-none text-ink dark:text-neutral-50" />
            <Text variant="bodySmall" color="secondary">
              day{current === 1 ? '' : 's'}
            </Text>
          </View>
          <Text variant="caption" color="muted">
            Current streak
          </Text>
        </View>
      </View>
      <View className="items-end">
        <Text variant="title3" weight="bold" className="text-ink-muted dark:text-neutral-500">
          {longest}
        </Text>
        <Text variant="caption2" color="muted">
          Best streak
        </Text>
      </View>
    </View>
  );
}