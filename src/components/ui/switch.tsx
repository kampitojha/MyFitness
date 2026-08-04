import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { springs } from '@/theme';
import { cn } from '@/utils/cn';

export interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export function Switch({ value, onValueChange, disabled = false, label, className }: SwitchProps) {
  const progress = useSharedValue(value ? 1 : 0);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor:
      progress.value > 0.5 ? 'rgba(14, 122, 74, 1)' : 'rgba(120, 130, 140, 0.3)',
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * 20 }],
  }));

  return (
    <Pressable
      onPress={() => {
        onValueChange(!value);
        progress.value = withSpring(value ? 0 : 1, springs.snappy);
      }}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={label}
      className={cn('flex-row items-center', className)}
    >
      <Animated.View style={trackStyle} className="h-[31px] w-[51px] rounded-full p-[2px]">
        <Animated.View
          style={thumbStyle}
          className="h-[27px] w-[27px] rounded-full bg-white shadow-sm"
        />
      </Animated.View>
    </Pressable>
  );
}