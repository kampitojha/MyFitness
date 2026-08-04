import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { cn } from '@/utils/cn';
import { springs } from '@/theme';
import { Text } from './text';

export interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

/**
 * iOS-style segmented control used for date ranges and filters.
 * The highlight thumb glides between options as the selection changes.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  const [widths, setWidths] = useState<Record<string, number>>({});
  const offset = useSharedValue(0);

  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const thumbWidth = widths[options[selectedIndex]?.value] ?? 0;

  useEffect(() => {
    let acc = 0;
    for (let i = 0; i < selectedIndex; i++) {
      acc += widths[options[i].value] ?? 0;
    }
    offset.value = withSpring(acc, springs.snappy);
  }, [selectedIndex, widths, offset, options]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  return (
    <View className={cn('relative flex-row rounded-2xl bg-surface-alt p-1 dark:bg-neutral-800', className)}>
      <Animated.View
        style={[thumbStyle, { width: thumbWidth || undefined }]}
        className="absolute left-1 top-1 bottom-1 rounded-xl bg-surface shadow-sm dark:bg-neutral-900"
      />
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            className="flex-1"
            onLayout={(e) => {
              const w = e.nativeEvent.layout.width;
              setWidths((prev) => (prev[option.value] === w ? prev : { ...prev, [option.value]: w }));
            }}
          >
            <View className="h-9 items-center justify-center rounded-xl">
              <Text
                variant="footnote"
                weight="semibold"
                className={cn(isSelected ? 'text-ink dark:text-neutral-100' : 'text-ink-muted dark:text-neutral-500')}
              >
                {option.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}