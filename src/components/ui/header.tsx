import { View } from 'react-native';
import { cn } from '@/utils/cn';
import { Text } from './text';
import { IconButton } from './button';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  large?: boolean;
  className?: string;
}

/**
 * Page header with optional back button, subtitle and trailing actions.
 */
export function Header({ title, subtitle, onBack, right, large = false, className }: HeaderProps) {
  return (
    <View className={cn('flex-row items-center gap-3', className)}>
      {onBack ? (
        <IconButton
          label="Go back"
          onPress={onBack}
          variant="surface"
          icon={<Text className="text-ink dark:text-neutral-100 text-lg leading-none">‹</Text>}
        />
      ) : null}
      <View className="flex-1 gap-0.5">
        <Text variant={large ? 'title1' : 'title2'} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="footnote" color="secondary" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ? <View className="flex-row items-center gap-2">{right}</View> : null}
    </View>
  );
}