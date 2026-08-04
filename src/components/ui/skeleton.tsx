import { useEffect, type ReactNode } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/utils/cn';

export interface SkeletonProps {
  className?: string;
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  children?: ReactNode;
}

/**
 * Pulsing skeleton placeholder used for loading states.
 */
export function Skeleton({ className, width, height = 14, borderRadius = 8, children }: SkeletonProps) {
  const { colors } = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [colors.surfaceAlt, colors.border]),
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width,
          height,
          borderRadius,
        },
      ]}
      className={cn('overflow-hidden', className)}
    >
      {children}
    </Animated.View>
  );
}