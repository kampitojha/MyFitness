import { View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Text } from '@/components/ui/text';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/utils/cn';

export interface SettingsRowProps {
  label: string;
  icon: React.ReactNode;
  onPress?: () => void;
  value?: string;
  switchValue?: boolean;
  onSwitchChange?: (v: boolean) => void;
  destructive?: boolean;
  last?: boolean;
}

export function SettingsRow({ label, icon, onPress, value, switchValue, onSwitchChange, destructive, last }: SettingsRowProps) {
  const { colors } = useTheme();
  const isSwitch = switchValue !== undefined;
  const Content = (
    <View className="flex-row items-center gap-3">
      <View
        className={cn(
          'h-9 w-9 items-center justify-center rounded-xl',
          destructive ? 'bg-danger-soft dark:bg-red-950' : 'bg-surface-alt dark:bg-neutral-800',
        )}
      >
        {icon}
      </View>
      <View className="flex-1">
        <Text variant="body" weight="medium" numberOfLines={1} className={destructive ? 'text-danger' : 'text-ink dark:text-neutral-100'}>
          {label}
        </Text>
      </View>
      {value ? (
        <Text variant="footnote" color="muted">
          {value}
        </Text>
      ) : null}
      {isSwitch ? (
        <Switch value={switchValue} onValueChange={onSwitchChange ?? (() => undefined)} label={label} />
      ) : (
        <ChevronRight size={18} color={colors.textMuted} />
      )}
    </View>
  );

  const render = isSwitch || !onPress ? (
    <View className="px-4 py-3.5">{Content}</View>
  ) : (
    <PressableScale onPress={onPress} className="px-4 py-3.5">
      {Content}
    </PressableScale>
  );

  return (
    <View className={cn('rounded-2xl bg-surface dark:bg-neutral-900', !last && 'mb-2')}>
      {render}
    </View>
  );
}