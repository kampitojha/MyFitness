import { View } from 'react-native';
import { Footprints, Pill, Moon } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { PressableScale } from '@/components/ui/pressable-scale';
import { useStepCounter, STEP_GOAL } from '@/hooks/use-steps';
import { useSupplementsToday } from '@/hooks/use-supplements';
import { useSleepToday } from '@/hooks/use-sleep';
import { sleepService, SLEEP_QUALITY_LABELS, type SleepQuality } from '@/services/sleep.service';
import { formatNumber } from '@/utils/number';

export interface FitnessWidgetsProps {
  onOpenSupplements: () => void;
  onOpenSleep: () => void;
}

export function FitnessWidgets({ onOpenSupplements, onOpenSleep }: FitnessWidgetsProps) {
  const { steps, distance, supported } = useStepCounter();
  const { taken, total: totalSupps } = useSupplementsToday();
  const { data: sleepToday } = useSleepToday();

  const stepPct = Math.min(100, Math.round((steps / STEP_GOAL) * 100));

  return (
    <View className="gap-3 mb-4">
      {/* Live Step Counter Widget */}
      <Card className="p-4 bg-surface dark:bg-neutral-900 border border-border/60">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center gap-2">
            <View className="h-9 w-9 rounded-xl bg-emerald-500/10 items-center justify-center">
              <Footprints size={20} color="#0E7A4A" />
            </View>
            <View>
              <Text variant="subhead" weight="bold">Daily Step Counter</Text>
              <Text variant="caption2" color="muted">
                {supported ? 'Live Pedometer sensor' : 'Activity tracking'}
              </Text>
            </View>
          </View>
          <Text variant="title2" weight="bold" className="text-primary-600 dark:text-emerald-400">
            {formatNumber(steps)} <Text variant="caption2" color="muted">/ {formatNumber(STEP_GOAL)}</Text>
          </Text>
        </View>

        {/* Progress Bar */}
        <View className="h-2 w-full rounded-full bg-surface-alt dark:bg-neutral-800 overflow-hidden mb-1">
          <View className="h-full rounded-full bg-primary-600 dark:bg-emerald-400" style={{ width: `${stepPct}%` }} />
        </View>

        <View className="flex-row justify-between pt-1">
          <Text variant="caption2" color="muted">
            Distance: {distance > 1000 ? `${(distance / 1000).toFixed(1)} km` : `${distance} m`}
          </Text>
          <Text variant="caption2" weight="semibold" className="text-primary-600 dark:text-emerald-400">
            ~{Math.round(steps * 0.04)} kcal burned
          </Text>
        </View>
      </Card>

      {/* Row: Supplements & Sleep Widgets */}
      <View className="flex-row gap-3">
        {/* Supplement Widget */}
        <PressableScale onPress={onOpenSupplements} className="flex-1">
          <Card className="p-3.5 bg-surface dark:bg-neutral-900 border border-border/60">
            <View className="flex-row items-center justify-between mb-2">
              <View className="h-8 w-8 rounded-xl bg-purple-500/10 items-center justify-center">
                <Pill size={18} color="#8B5CF6" />
              </View>
              <Text variant="caption" weight="bold" className="text-purple-600 dark:text-purple-400">
                {taken}/{totalSupps}
              </Text>
            </View>
            <Text variant="bodySmall" weight="bold">Supplements</Text>
            <Text variant="caption2" color="muted" numberOfLines={1}>
              {totalSupps === 0 ? 'Tap to track' : taken === totalSupps ? 'All done today! 🎉' : `${totalSupps - taken} remaining`}
            </Text>
          </Card>
        </PressableScale>

        {/* Sleep Widget */}
        <PressableScale onPress={onOpenSleep} className="flex-1">
          <Card className="p-3.5 bg-surface dark:bg-neutral-900 border border-border/60">
            <View className="flex-row items-center justify-between mb-2">
              <View className="h-8 w-8 rounded-xl bg-indigo-500/10 items-center justify-center">
                <Moon size={18} color="#6366F1" />
              </View>
              <Text variant="caption" weight="bold" className="text-indigo-600 dark:text-indigo-400">
                {sleepToday ? sleepService.formatDuration(sleepToday.durationMinutes) : 'Log'}
              </Text>
            </View>
            <Text variant="bodySmall" weight="bold">Sleep & Recovery</Text>
            <Text variant="caption2" color="muted" numberOfLines={1}>
              {sleepToday ? SLEEP_QUALITY_LABELS[sleepToday.quality as SleepQuality] : 'Tap to log sleep'}
            </Text>
          </Card>
        </PressableScale>
      </View>
    </View>
  );
}
