import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, ScrollView } from 'react-native';
import { Trash2, Calendar } from 'lucide-react-native';

import { Screen } from '@/components/ui/screen';
import { Header } from '@/components/ui/header';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { IconButton } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Divider } from '@/components/ui/divider';
import { MacroRing } from '@/components/ui/macro-ring';
import { Spinner } from '@/components/ui/spinner';
import { ErrorState } from '@/components/ui/error-state';
import { useMeal, useDeleteMeal } from '@/hooks/use-meals';
import { useProfile } from '@/hooks/use-profile';
import { useTheme } from '@/hooks/use-theme';
import { formatLong } from '@/utils/date';
import type { FoodItem } from '@/types/food';

export default function MealDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  const { data: meal, isLoading, isError, refetch } = useMeal(id || '');
  const deleteMealMutation = useDeleteMeal();
  const { data: profile } = useProfile();
  const goalCalories = profile?.dailyGoals?.calories ?? 2000;
  const ringValue = Math.min(100, Math.round(((meal?.macros.calories ?? 0) / goalCalories) * 100));

  const handleDelete = () => {
    if (!id) return;
    deleteMealMutation.mutate(id, {
      onSuccess: () => {
        router.back();
      },
    });
  };

  if (isLoading) {
    return (
      <Screen>
        <Header title="Meal Details" onBack={() => router.back()} />
        <View className="flex-1 items-center justify-center">
          <Spinner size="large" />
        </View>
      </Screen>
    );
  }

  if (isError || !meal) {
    return (
      <Screen>
        <Header title="Meal Details" onBack={() => router.back()} />
        <ErrorState
          title="Meal Not Found"
          message="Could not load the requested meal details."
          onRetry={refetch}
        />
      </Screen>
    );
  }

  const { name, type, macros, items, createdAt } = meal;

  return (
    <Screen>
      <Header
        title={name}
        onBack={() => router.back()}
        right={
          <IconButton
            label="Delete Meal"
            variant="surface"
            onPress={handleDelete}
            disabled={deleteMealMutation.isPending}
            icon={<Trash2 size={20} color={colors.primary} />}
          />
        }
      />

      <ScrollView className="flex-1 px-4 pt-2" showsVerticalScrollIndicator={false}>
        {/* Top Summary Card */}
        <Card className="mb-4 p-4">
          <View className="flex-row items-center justify-between mb-3">
            <Chip label={type.toUpperCase()} />
            <View className="flex-row items-center">
              <Calendar size={14} color={colors.textSecondary} className="mr-1" />
              <Text variant="caption" color="secondary">
                {formatLong(createdAt.slice(0, 10))}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between my-2">
            <View>
              <Text variant="display" className="text-primary font-bold">
                {macros.calories}
              </Text>
              <Text variant="bodySmall" color="secondary">
                {ringValue}% of daily goal
              </Text>
            </View>

            <MacroRing value={ringValue} size={80} strokeWidth={8} color={colors.primary} />
          </View>

          <Divider className="my-4" />

          {/* Macro Breakdown */}
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text variant="title3" className="font-bold">
                {macros.protein}g
              </Text>
              <Text variant="caption" color="secondary">
                Protein
              </Text>
            </View>
            <View className="items-center">
              <Text variant="title3" className="font-bold">
                {macros.carbs}g
              </Text>
              <Text variant="caption" color="secondary">
                Carbs
              </Text>
            </View>
            <View className="items-center">
              <Text variant="title3" className="font-bold">
                {macros.fat}g
              </Text>
              <Text variant="caption" color="secondary">
                Fat
              </Text>
            </View>
          </View>
        </Card>

        {/* Meal Items List */}
        <Text variant="title2" className="mb-3 font-semibold">
          Items Breakdown
        </Text>

        {items && items.length > 0 ? (
          items.map((item: FoodItem, idx: number) => (
            <Card key={idx} className="mb-2 p-3 flex-row items-center justify-between">
              <View className="flex-1">
                <Text variant="body" className="font-medium">
                  {item.name}
                </Text>
                <Text variant="caption" color="secondary">
                  {item.servingSize}
                </Text>
              </View>
              <View className="items-end">
                <Text variant="body" className="font-semibold text-primary">
                  {item.macros.calories} kcal
                </Text>
                <Text variant="caption" color="secondary">
                  P:{item.macros.protein}g • C:{item.macros.carbs}g • F:{item.macros.fat}g
                </Text>
              </View>
            </Card>
          ))
        ) : (
          <Card className="p-4 items-center">
            <Text variant="bodySmall" color="secondary">
              No individual items listed for this meal.
            </Text>
          </Card>
        )}
      </ScrollView>
    </Screen>
  );
}
