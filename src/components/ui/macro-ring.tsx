import { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { durations, easings } from '@/theme';
import { clamp } from '@/utils/number';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface MacroRingProps {
  value: number; // 0..100
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  children?: React.ReactNode;
}

/**
 * Circular progress ring used for calorie/macro targets on the Home screen.
 * Animates the stroke as it fills.
 */
export function MacroRing({
  value,
  size = 200,
  strokeWidth = 14,
  color,
  trackColor,
  children,
}: MacroRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = clamp(value, 0, 100);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(pct, { duration: durations.medium, easing: easings.standard });
  }, [pct, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - (circumference * progress.value) / 100,
  }));

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor ?? 'rgba(0,0,0,0.06)'}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
        />
      </Svg>
      <View
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        className="items-center justify-center"
      >
        {children}
      </View>
    </View>
  );
}