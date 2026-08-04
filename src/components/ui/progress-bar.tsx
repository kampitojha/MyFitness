import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { durations, easings } from '@/theme';
import { cn } from '@/utils/cn';
import { clamp } from '@/utils/number';

export interface ProgressBarProps {
  value: number; // 0..100
  color?: string;
  trackClassName?: string;
  barClassName?: string;
  height?: number;
  animated?: boolean;
}

export function ProgressBar({
  value,
  color,
  trackClassName,
  barClassName,
  height = 8,
  animated = true,
}: ProgressBarProps) {
  const width = useSharedValue(0);
  const pct = clamp(value, 0, 100);

  useEffect(() => {
    if (animated) {
      width.value = withTiming(pct, { duration: durations.normal, easing: easings.standard });
    } else {
      width.value = pct;
    }
  }, [pct, animated, width]);

  const barStyle = useAnimatedStyle(() => ({ width: `${width.value}%` }));

  return (
    <View
      className={cn('w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800', trackClassName)}
      style={{ height }}
    >
      <Animated.View
        className={cn('h-full rounded-full bg-primary-600 dark:bg-emerald-400', barClassName)}
        style={[{ height }, color ? { backgroundColor: color } : undefined, barStyle]}
      />
    </View>
  );
}