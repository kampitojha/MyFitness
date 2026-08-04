import { View } from 'react-native';
import { MotiView } from 'moti';
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
            {isActive ? (
              <MotiView
                from={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ type: 'timing', duration: 350 }}
                className="h-full rounded-full bg-primary-600 dark:bg-emerald-400"
              />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}