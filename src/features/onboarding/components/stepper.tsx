import { View, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { cn } from '@/utils/cn';

export interface StepperProps {
  step: number;
  total: number;
  onStepPress?: (stepIndex: number) => void;
}

/**
 * Horizontal step indicator with animated fill and interactive tap targets.
 */
export function Stepper({ step, total, onStepPress }: StepperProps) {
  const segments = Array.from({ length: total }, (_, i) => i);

  return (
    <View className="flex-row items-center gap-2 py-1">
      {segments.map((i) => {
        const isActive = i === step;
        const isComplete = i < step;
        return (
          <Pressable
            key={i}
            onPress={() => onStepPress?.(i)}
            hitSlop={8}
            className="flex-1 py-1"
          >
            <View
              className={cn(
                'h-2.5 flex-1 overflow-hidden rounded-full transition-all',
                isComplete
                  ? 'bg-primary-600 dark:bg-emerald-400'
                  : isActive
                  ? 'bg-primary-200 dark:bg-emerald-900'
                  : 'bg-neutral-200 dark:bg-neutral-800'
              )}
            >
              {isActive ? <StepFill /> : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

function StepFill() {
  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming('100%', { duration: 300 }),
  }));

  return (
    <Animated.View
      style={[{ width: '0%' }, animatedStyle]}
      className="h-full rounded-full bg-primary-600 dark:bg-emerald-400"
    />
  );
}