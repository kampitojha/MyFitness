import { Image } from 'expo-image';
import { View } from 'react-native';
import { CalendarRange, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Text } from '@/components/ui/text';
import type { Meal } from '@/types/meals';
import { MEAL_TYPE_LABELS } from '@/types/meals';
import { formatNumber } from '@/utils/number';

export interface MealRowProps {
  meal: Meal;
  onPress?: () => void;
  showImage?: boolean;
}

export function MealRow({ meal, onPress, showImage = true }: MealRowProps) {
  const { colors } = useTheme();
  const time = meal.createdAt.length > 10 ? meal.createdAt.slice(11, 16) : '';
  const meta = `${MEAL_TYPE_LABELS[meal.type]}${time ? ` · ${time}` : ''}`;

  return (
    <PressableScale onPress={onPress} className="flex-row items-center gap-3">
      {showImage ? (
        <View className="h-14 w-14 overflow-hidden rounded-2xl bg-surface-alt dark:bg-neutral-800">
          {meal.imageUri ? (
            <Image source={{ uri: meal.imageUri }} style={{ width: 56, height: 56 }} contentFit="cover" transition={150} />
          ) : (
            <View className="h-full w-full items-center justify-center">
              <CalendarRange size={22} color={colors.textMuted} />
            </View>
          )}
        </View>
      ) : null}

      <View className="flex-1 gap-0.5">
        <Text variant="body" weight="semibold" numberOfLines={1}>
          {meal.name}
        </Text>
        <View className="flex-row items-center gap-1.5">
          <Text variant="caption" color="muted">
            {meta}
          </Text>
        </View>
        <View className="mt-0.5 flex-row items-center gap-2.5">
          <Text variant="footnote" weight="semibold" className="text-primary-600 dark:text-emerald-400">
            {formatNumber(meal.macros.calories)} kcal
          </Text>
          <Text variant="caption" color="muted">
            P {formatNumber(meal.macros.protein)} · C {formatNumber(meal.macros.carbs)} · F {formatNumber(meal.macros.fat)}
          </Text>
        </View>
      </View>

      <ChevronRight size={18} color={colors.textMuted} />
    </PressableScale>
  );
}