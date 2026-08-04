import { View } from 'react-native';
import { AnimatedNumber } from '@/components/ui/animated-number';
import { Text } from '@/components/ui/text';

export interface MetricCardProps {
  label: string;
  value: number;
  unit?: string;
  delta?: number;
  color: string;
  icon?: React.ReactNode;
}

export function MetricCard({ label, value, unit, delta, color, icon }: MetricCardProps) {
  return (
    <View className="rounded-[20px] bg-surface p-4 shadow-sm dark:bg-neutral-900">
      <View className="mb-3 flex-row items-center gap-2">
        <View className="h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}22` }}>
          {icon}
        </View>
        <Text variant="caption" weight="semibold" color="muted" className="flex-1">
          {label}
        </Text>
      </View>
      <View className="flex-row items-baseline gap-1">
        <AnimatedNumber value={value} className="font-display text-[26px] font-bold leading-[30px] text-ink dark:text-neutral-50" />
        {unit ? (
          <Text variant="footnote" color="secondary">
            {unit}
          </Text>
        ) : null}
      </View>
      {delta !== undefined ? (
        <Text variant="caption2" className={delta >= 0 ? 'text-success' : 'text-danger'}>
          {delta >= 0 ? '+' : ''}{Math.round(delta)} vs last period
        </Text>
      ) : null}
    </View>
  );
}