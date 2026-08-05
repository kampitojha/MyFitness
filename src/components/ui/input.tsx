import { forwardRef } from 'react';
import { TextInput, View, type TextInputProps, type ViewStyle } from 'react-native';
import { cn } from '@/utils/cn';
import { Text } from './text';
import { useTheme } from '@/hooks/use-theme';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  inputClassName?: string;
  containerStyle?: ViewStyle;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, helper, leftIcon, rightElement, className, inputClassName, containerStyle, ...props }, ref) => {
    const { isDark } = useTheme();
    const hasError = Boolean(error);
    return (
      <View className={cn('gap-1.5', className)} style={containerStyle}>
        {label ? (
          <Text variant="footnote" weight="semibold" color="secondary" className="ml-1">
            {label}
          </Text>
        ) : null}
        <View
          style={{ backgroundColor: isDark ? '#1C2124' : '#FFFFFF' }}
          className={cn(
            'h-13 flex-row items-center rounded-2xl border bg-surface px-4 shadow-sm dark:bg-neutral-800',
            hasError
              ? 'border-danger'
              : 'border-border focus:border-primary-600 dark:border-neutral-700 dark:focus:border-sky-400',
          )}
        >
          {leftIcon ? <View className="mr-2.5 opacity-60">{leftIcon}</View> : null}
          <TextInput
            ref={ref}
            placeholderTextColor={hasError ? undefined : undefined}
            accessibilityLabel={label ?? props.accessibilityLabel}
            className={cn(
              'flex-1 py-3.5 font-body text-[15px] leading-[20px] text-ink placeholder:text-ink-muted dark:text-neutral-100',
              inputClassName,
            )}
            {...props}
          />
          {rightElement ? <View className="ml-2.5">{rightElement}</View> : null}
        </View>
        {hasError ? (
          <Text variant="caption" color="danger" className="ml-1">
            {error}
          </Text>
        ) : helper ? (
          <Text variant="caption" color="muted" className="ml-1">
            {helper}
          </Text>
        ) : null}
      </View>
    );
  },
);

Input.displayName = 'Input';