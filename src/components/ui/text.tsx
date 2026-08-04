import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { cn } from '@/utils/cn';

export interface TextProps extends RNTextProps {
  variant?:
    | 'display'
    | 'largeTitle'
    | 'title1'
    | 'title2'
    | 'title3'
    | 'headline'
    | 'subhead'
    | 'body'
    | 'bodySmall'
    | 'footnote'
    | 'caption'
    | 'caption2';
  color?: 'default' | 'secondary' | 'muted' | 'primary' | 'onPrimary' | 'success' | 'warning' | 'danger';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold' | 'heavy';
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  numberOfLines?: number;
}

const variantClasses: Record<NonNullable<TextProps['variant']>, string> = {
  display: 'text-[40px] leading-[42px] font-bold tracking-tight',
  largeTitle: 'text-[34px] leading-[38px] font-bold tracking-tight',
  title1: 'text-[28px] leading-[33px] font-bold tracking-tight',
  title2: 'text-[24px] leading-[29px] font-bold tracking-tight',
  title3: 'text-[20px] leading-[25px] font-semibold tracking-tight',
  headline: 'text-[17px] leading-[22px] font-semibold',
  subhead: 'text-[15px] leading-[20px] font-medium',
  body: 'text-[15px] leading-[21px]',
  bodySmall: 'text-[14px] leading-[19px]',
  footnote: 'text-[13px] leading-[18px]',
  caption: 'text-[12px] leading-[16px]',
  caption2: 'text-[11px] leading-[14px]',
};

const colorClasses: Record<NonNullable<TextProps['color']>, string> = {
  default: 'text-ink dark:text-neutral-50',
  secondary: 'text-ink-secondary dark:text-neutral-400',
  muted: 'text-ink-muted dark:text-neutral-500',
  primary: 'text-primary-600 dark:text-emerald-400',
  onPrimary: 'text-white dark:text-emerald-950',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
};

const weightClasses: Record<NonNullable<TextProps['weight']>, string> = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  heavy: 'font-extrabold',
};

export function Text({ variant = 'body', color = 'default', weight, align = 'auto', className, style, ...props }: TextProps) {
  return (
    <RNText
      {...props}
      accessibilityRole={props.accessibilityRole ?? 'text'}
      className={cn(
        'font-body',
        variantClasses[variant],
        colorClasses[color],
        weight ? weightClasses[weight] : undefined,
        align !== 'auto' && `text-${align}`,
        className,
      )}
      style={style}
    />
  );
}