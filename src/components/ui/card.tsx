import { View, type ViewProps } from 'react-native';
import { cn } from '@/utils/cn';

export interface CardProps extends ViewProps {
  children: React.ReactNode;
  padded?: boolean;
  pressable?: boolean;
}

export function Card({ children, padded = true, pressable = false, className, ...props }: CardProps) {
  return (
    <View
      {...props}
      className={cn(
        'rounded-[20px] bg-surface dark:bg-surface',
        pressable ? 'active:opacity-90' : 'shadow-sm',
        padded && 'p-4',
        className,
      )}
    >
      {children}
    </View>
  );
}