import { cn } from '@/utils/cn';
import { PressableScale } from './pressable-scale';
import { Text } from './text';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function Chip({ label, selected = false, onPress, icon, className }: ChipProps) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      className={cn(
        'h-9 flex-row items-center gap-1.5 rounded-full border px-3.5',
        selected
          ? 'border-primary-600 bg-primary-600 dark:border-sky-400 dark:bg-sky-400'
          : 'border-border bg-surface dark:border-neutral-700 dark:bg-neutral-900',
        className,
      )}
    >
      {icon}
      <Text
        variant="footnote"
        weight="semibold"
        className={cn(selected ? 'text-white dark:text-sky-950' : 'text-ink-secondary dark:text-neutral-300')}
      >
        {label}
      </Text>
    </PressableScale>
  );
}