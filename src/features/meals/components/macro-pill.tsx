import { View } from 'react-native';
import { Flame, Beef, Wheat, Droplet } from 'lucide-react-native';
import type { MacroKey } from '@/types/nutrition';
import { MACRO_COLORS } from '@/constants/macros';
import { Text } from '@/components/ui/text';

export interface MacroPillProps {
  macro: MacroKey;
  value: number;
  unit: string;
  current?: number;
  target?: number;
}

const ICONS: Record<MacroKey, React.ComponentType<{ size: number; color: string }>> = {
  calories: Flame,
  protein: Beef,
  carbs: Wheat,
  fat: Droplet,
};

/**
 * Compact macro stat: value + optional progress toward a target.
 */
export function MacroPill({ macro, value, unit, current, target }: MacroPillProps) {
  const Icon = ICONS[macro];
  const color = MACRO_COLORS[macro];
  const showProgress = current !== undefined && target !== undefined && target > 0;
  const pct = showProgress ? Math.min(100, (current / target) * 100) : 0;

  return (
    <View className="flex-1 rounded-2xl bg-surface p-3 dark:bg-neutral-900">
      <View className="mb-2 flex-row items-center gap-1.5">
        <Icon size={14} color={color} />
        <Text variant="caption2" weight="semibold" color="muted" className="uppercase">
          {macro === 'calories' ? 'kcal' : unit}
        </Text>
      </View>
      <Text variant="headline" weight="bold" className="text-ink dark:text-neutral-50">
        {Math.round(value)}
      </Text>
      {showProgress ? (
        <View className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
          <View style={{ width: `${pct}%`, backgroundColor: color }} className="h-full rounded-full" />
        </View>
      ) : null}
    </View>
  );
}