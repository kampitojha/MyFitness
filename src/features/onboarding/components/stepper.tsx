import { View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { cn } from '@/utils/cn';

export interface StepperProps {
  step: number;
  total: number;
}

/**
 * Horizontal step indicator with animated fill on the completed segment.
 */
export function Stepper({ step, total }: StepperProps) {
  const segments = Array.from({ length: total }, (_, i) => i);

  return (
    <View className="flex-row gap-1.5">
      {segments.map((i) => {
        const isActive = i === step;
        const isComplete = i < step;
        return (
          <View key={i} className={cn('h-1.5 flex-1 overflow-hidden rounded-full', isComplete ? 'bg-primary-600 dark:bg-emerald-400' : 'bg-neutral-200 dark:bg-neutral-800')}>
            {isActive ? <StepFill /> : null}
          </View>
        );
      })}
    </View>
  );
}

function StepFill() {
  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming('100%', { duration: 350 }),
  }));

  return (
    <Animated.View
      style={[{ width: '0%' }, animatedStyle]}
      className="h-full rounded-full bg-primary-600 dark:bg-emerald-400"
    />
  );
}