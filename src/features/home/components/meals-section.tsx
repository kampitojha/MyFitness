import { View } from 'react-native';
import { Camera } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { Skeleton } from '@/components/ui/skeleton';
import { MealRow } from '@/features/meals/components/meal-row';
import type { Meal , MealType } from '@/types/meals';
import { MEAL_TYPES, MEAL_TYPE_LABELS } from '@/types/meals';
import { useRouter } from 'expo-router';

export interface MealsSectionProps {
  meals: Meal[];
  loading?: boolean;
  emptyActionLabel: string;
  emptyActionOnPress: () => void;
}

export function MealsSection({ meals, loading, emptyActionLabel, emptyActionOnPress }: MealsSectionProps) {
  const router = useRouter();

  if (loading) {
    return (
      <View className="gap-3">
        <Skeleton height={20} width="40%" />
        <Skeleton height={72} className="w-full rounded-2xl" />
        <Skeleton height={72} className="w-full rounded-2xl" />
      </View>
    );
  }

  const grouped = MEAL_TYPES.map((type) => ({
    type,
    items: meals.filter((m) => m.type === type),
  })).filter((g) => g.items.length > 0);

  if (grouped.length === 0) {
    return (
      <EmptyState
        icon={<Camera size={26} color="#0284C7" />}
        title="No meals logged yet"
        description="Scan your first meal to start tracking nutrition in seconds."
        actionLabel={emptyActionLabel}
        onAction={emptyActionOnPress}
      />
    );
  }

  return (
    <View className="rounded-3xl bg-surface p-5 shadow-sm dark:bg-neutral-900">
      {grouped.map(({ type, items }, sectionIndex) => (
        <View key={type}>
          <View className="mb-3 flex-row items-center justify-between">
            <Text variant="subhead" weight="semibold">
              {MEAL_TYPE_LABELS[type as MealType]}
            </Text>
            <Text variant="caption" color="muted">
              {items.reduce((sum, m) => sum + m.macros.calories, 0)} kcal
            </Text>
          </View>
          <View className={grouped.length > 1 ? 'gap-4' : 'gap-1'}>
            {items.map((meal) => (
              <MealRow
                key={meal.id}
                meal={meal}
                onPress={() => router.push({ pathname: '/meal/[id]', params: { id: meal.id } })}
              />
            ))}
          </View>
          {sectionIndex < grouped.length - 1 ? <Divider className="my-4" /> : null}
        </View>
      ))}
      <Button
        label={emptyActionLabel}
        onPress={emptyActionOnPress}
        variant="soft"
        size="md"
        className="mt-5"
        fullWidth
      />
    </View>
  );
}