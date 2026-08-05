import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Search, ChevronRight } from 'lucide-react-native';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Chip } from '@/components/ui/chip';
import { Card } from '@/components/ui/card';
import { PressableScale } from '@/components/ui/pressable-scale';
import { foodDatabaseService, type PresetFood } from '@/services/food-database.service';
import { MEAL_TYPES, MEAL_TYPE_LABELS, type MealType } from '@/types/meals';
import { useSettingsStore } from '@/store/settings.store';

export interface FoodSearchModalProps {
  visible: boolean;
  onClose: () => void;
  defaultMealType?: MealType;
}

export function FoodSearchModal({ visible, onClose, defaultMealType = 'lunch' }: FoodSearchModalProps) {
  const router = useRouter();
  const hapticsEnabled = useSettingsStore((s) => s.hapticsEnabled);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PresetFood[]>([]);
  const [mealType, setMealType] = useState<MealType>(defaultMealType);

  useEffect(() => {
    foodDatabaseService.search(query).then(setResults);
  }, [query]);

  const handleSelectFood = (food: PresetFood) => {
    if (hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
    onClose();
    router.push({ pathname: '/food/[id]', params: { id: food.id, mealType } });
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Log food item" snapTo={0.85}>
      <View className="mb-3 flex-row flex-wrap gap-2">
        {MEAL_TYPES.map((type) => (
          <Chip
            key={type}
            label={MEAL_TYPE_LABELS[type]}
            selected={mealType === type}
            onPress={() => setMealType(type)}
          />
        ))}
      </View>

      <Input
        placeholder="Search Roti, Paneer, Rice, Whey, Oats..."
        value={query}
        onChangeText={setQuery}
        leftIcon={<Search size={18} color="#9CA3AF" />}
        className="mb-4"
      />

      <Text variant="subhead" weight="semibold" className="mb-2 text-ink dark:text-neutral-50">
        {query ? 'Search Results' : 'Popular Foods'}
      </Text>

      <View className="gap-2 pb-6">
        {results.map((food) => (
          <PressableScale key={food.id} onPress={() => handleSelectFood(food)}>
            <Card className="flex-row items-center justify-between p-3.5">
              <View className="flex-1 pr-2">
                <Text variant="body" weight="semibold" className="text-ink dark:text-neutral-50">
                  {food.name}
                </Text>
                <Text variant="caption" color="secondary">
                  {food.servingSize} · {food.category}
                </Text>
              </View>

              <View className="flex-row items-center justify-end">
                <View className="items-end mr-2">
                  <Text variant="bodySmall" weight="bold" className="text-primary-600 dark:text-emerald-400">
                    {food.macros.calories} kcal
                  </Text>
                  <Text variant="caption2" color="muted">
                    P: {food.macros.protein}g · C: {food.macros.carbs}g
                  </Text>
                </View>
                <View className="h-8 w-8 items-center justify-center rounded-full bg-primary-soft dark:bg-emerald-900">
                  <ChevronRight size={16} color="#0E7A4A" />
                </View>
              </View>
            </Card>
          </PressableScale>
        ))}
      </View>
    </BottomSheet>
  );
}
