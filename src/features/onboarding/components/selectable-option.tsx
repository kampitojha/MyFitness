import { View } from 'react-native';
import { Check } from 'lucide-react-native';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';

export interface SelectableOptionProps {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onPress?: () => void;
}

export function SelectableOption({ label, description, icon, selected = false, onPress }: SelectableOptionProps) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      className={cn(
        'flex-row items-center gap-3 rounded-2xl border-2 p-4',
        selected
          ? 'border-primary-600 bg-primary-soft dark:border-sky-400 dark:bg-sky-900'
          : 'border-border bg-surface dark:border-neutral-800 dark:bg-neutral-900',
      )}
    >
      {icon ? (
        <View className={cn('h-11 w-11 items-center justify-center rounded-xl', selected ? 'bg-white dark:bg-sky-950' : 'bg-surface-alt dark:bg-neutral-800')}>
          {icon}
        </View>
      ) : null}
      <View className="flex-1 gap-0.5">
        <Text variant="subhead" weight={selected ? 'semibold' : 'medium'}>
          {label}
        </Text>
        {description ? (
          <Text variant="caption" color="secondary">
            {description}
          </Text>
        ) : null}
      </View>
      <View
        className={cn(
          'h-6 w-6 items-center justify-center rounded-full border-2',
          selected ? 'border-primary-600 bg-primary-600 dark:border-sky-400 dark:bg-sky-400' : 'border-neutral-300 dark:border-neutral-700',
        )}
      >
        {selected ? <Check size={14} color="#FFFFFF" /> : null}
      </View>
    </PressableScale>
  );
}