import { View } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';
import { Text } from '@/components/ui/text';

export interface InsightCardProps {
  title: string;
  message: string;
}

export function InsightCard({ title, message }: InsightCardProps) {
  const { colors } = useTheme();
  return (
    <View className="rounded-[24px] bg-primary-soft p-5 dark:bg-emerald-900">
      <View className="flex-row items-center gap-2">
        <View className="h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-emerald-950">
          <Sparkles size={16} color={colors.primary} />
        </View>
        <Text variant="subhead" weight="semibold" className="text-primary-softText dark:text-emerald-200">
          {title}
        </Text>
      </View>
      <Text variant="bodySmall" className="mt-2 leading-[20px] text-primary-softText/90 dark:text-emerald-200/90">
        {message}
      </Text>
    </View>
  );
}