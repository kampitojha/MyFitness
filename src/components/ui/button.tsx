import { ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/utils/cn';
import { Text } from './text';
import { PressableScale } from './pressable-scale';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
  accessibilityHint?: string;
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-10 px-4 rounded-full',
  md: 'h-12 px-5 rounded-full',
  lg: 'h-14 px-6 rounded-full',
};

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-primary-600 active:bg-primary-700 dark:bg-sky-400 dark:active:bg-sky-300',
  secondary: 'bg-surface border border-border dark:border-neutral-700',
  ghost: 'bg-transparent',
  danger: 'bg-danger active:bg-danger',
  soft: 'bg-primary-soft dark:bg-sky-900',
};

const textColorByVariant: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'text-white dark:text-sky-950',
  secondary: 'text-ink dark:text-neutral-100',
  ghost: 'text-primary-600 dark:text-sky-400',
  danger: 'text-white',
  soft: 'text-primary-softText dark:text-sky-300',
};

const labelSize: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'text-[13px]',
  md: 'text-[15px]',
  lg: 'text-[16px]',
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className,
  accessibilityHint,
}: ButtonProps) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;

  return (
    <PressableScale
      disabled={isDisabled}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      className={cn(
        'flex-row items-center justify-center gap-2',
        sizeClasses[size],
        variantClasses[variant],
        isDisabled && 'opacity-45',
        fullWidth && 'w-full',
        className,
      )}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'secondary' ? colors.text : colors.onPrimary} />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text
            variant={size === 'lg' ? 'headline' : 'subhead'}
            weight="semibold"
            className={cn(textColorByVariant[variant], labelSize[size])}
            numberOfLines={1}
          >
            {label}
          </Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </PressableScale>
  );
}

export function IconButton({
  onPress,
  icon,
  label,
  size = 44,
  variant = 'ghost',
  disabled = false,
  className,
}: {
  onPress?: () => void;
  icon: React.ReactNode;
  label: string;
  size?: number;
  variant?: 'ghost' | 'surface' | 'soft';
  disabled?: boolean;
  className?: string;
}) {
  const bg =
    variant === 'surface'
      ? 'bg-surface border border-border dark:border-neutral-700'
      : variant === 'soft'
        ? 'bg-primary-soft dark:bg-sky-900'
        : 'bg-transparent';
  return (
    <PressableScale
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      className={cn('items-center justify-center rounded-full', bg, className)}
      style={{ width: size, height: size }}
    >
      {icon}
    </PressableScale>
  );
}