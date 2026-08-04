import { ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/utils/cn';

export function Spinner({ size = 'small', color, className }: { size?: 'small' | 'large'; color?: string; className?: string }) {
  const { colors } = useTheme();
  return (
    <ActivityIndicator
      size={size}
      color={color ?? colors.primary}
      className={cn(className)}
      accessibilityLabel="Loading"
    />
  );
}