import { View } from 'react-native';
import { Droplets, Plus } from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';
import { Text } from '@/components/ui/text';
import { PressableScale } from '@/components/ui/pressable-scale';
import { ProgressBar } from '@/components/ui/progress-bar';
import { WATER_TARGET_ML } from '@/constants/macros';
import { formatWaterMl } from '@/utils/number';

export interface WaterCardProps {
  consumedMl: number;
  targetMl?: number;
  onAdd?: () => void;
  stepMl?: number;
  disabled?: boolean;
}

const GLASSES = Array.from({ length: 8 }, (_, i) => (i + 1) * 250);

export function WaterCard({ consumedMl, targetMl = WATER_TARGET_ML, onAdd, stepMl = 250, disabled }: WaterCardProps) {
  const { colors } = useTheme();
  const pct = Math.min(100, (consumedMl / targetMl) * 100);
  const filled = Math.floor(consumedMl / stepMl);

  return (
    <View className="rounded-[24px] bg-surface p-5 shadow-sm dark:bg-neutral-900">
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="h-9 w-9 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-950">
            <Droplets size={18} color="#0EA5E9" />
          </View>
          <View>
            <Text variant="subhead" weight="semibold">
              Water
            </Text>
            <Text variant="caption" color="muted">
              {formatWaterMl(consumedMl)} of {formatWaterMl(targetMl)}
            </Text>
          </View>
        </View>
        <PressableScale
          disabled={disabled}
          onPress={onAdd}
          accessibilityRole="button"
          accessibilityLabel="Add a glass of water"
          className="flex-row items-center gap-1 rounded-full bg-primary-soft px-3.5 py-2 dark:bg-emerald-900"
        >
          <Plus size={14} color={colors.primary} />
          <Text variant="footnote" weight="semibold" className="text-primary-softText dark:text-emerald-300">
            Add
          </Text>
        </PressableScale>
      </View>

      <View className="mb-3 flex-row justify-between">
        {GLASSES.map((glass) => {
          const index = GLASSES.indexOf(glass);
          const isFilled = index < filled;
          return (
            <View
              key={glass}
              className={
                isFilled
                  ? 'h-7 w-4 rounded-b-xl rounded-t-sm border-2 border-b-4 border-sky-400 bg-sky-200 dark:border-sky-500 dark:bg-sky-800'
                  : 'h-7 w-4 rounded-b-xl rounded-t-sm border-2 border-b-4 border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800'
              }
            />
          );
        })}
      </View>

      <ProgressBar value={pct} color="#0EA5E9" height={6} />
    </View>
  );
}