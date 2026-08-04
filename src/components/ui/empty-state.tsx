import { View } from 'react-native';
import { cn } from '@/utils/cn';
import { Text } from './text';
import { Button } from './button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  compact = false,
  className,
}: EmptyStateProps) {
  return (
    <View className={cn('items-center px-6', compact ? 'py-8' : 'py-16', className)}>
      {icon ? (
        <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-primary-soft dark:bg-emerald-900">
          {icon}
        </View>
      ) : null}
      <Text variant="title3" align="center" className="mb-1.5">
        {title}
      </Text>
      {description ? (
        <Text variant="bodySmall" color="secondary" align="center" className="max-w-[280px] mb-5">
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} size="sm" />
      ) : null}
    </View>
  );
}