import { View } from 'react-native';
import { cn } from '@/utils/cn';
import { Text } from './text';
import { Button } from './button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  compact?: boolean;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We couldn’t load this right now. Check your connection and try again.',
  onRetry,
  compact = false,
  className,
}: ErrorStateProps) {
  return (
    <View className={cn('items-center px-6', compact ? 'py-8' : 'py-16', className)}>
      <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-danger-soft dark:bg-red-950">
        <Text className="text-[26px] leading-none">⚠</Text>
      </View>
      <Text variant="title3" align="center" className="mb-1.5">
        {title}
      </Text>
      <Text variant="bodySmall" color="secondary" align="center" className="max-w-[280px] mb-5">
        {message}
      </Text>
      {onRetry ? <Button label="Try again" onPress={onRetry} size="sm" variant="soft" /> : null}
    </View>
  );
}