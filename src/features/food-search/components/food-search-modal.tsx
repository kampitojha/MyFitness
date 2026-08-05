import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Search, Plus, Check, Minus } from 'lucide-react-native';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button, IconButton } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Card } from '@/components/ui/card';
import { PressableScale } from '@/components/ui/pressable-scale';
import { PresetFood, PRESET_FOODS, foodDatabaseService } from '@/services/food-database.service';
import { MEAL_TYPES, MEAL_TYPE_LABELS, type MealType } from '@/types/meals';
import { useSaveMeal } from '@/hooks/use-meals';
import { useTheme } from '@/hooks/use-theme';
import { toISODate } from '@/utils/date';

export interface FoodSearchModalProps {
  visible: boolean;
  onClose: () => void;
  defaultMealType?: MealType;
}

export function FoodSearchModal({ visible, onClose, defaultMealType = 'lunch' }: FoodSearchModalProps) {
  const { colors } = useTheme();
  const saveMeal = useSaveMeal();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PresetFood[]>(PRESET_FOODS);
  const [selectedFood, setSelectedFood] = useState<PresetFood | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [mealType, setMealType] = useState<MealType>(defaultMealType);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    foodDatabaseService.search(query).then(setResults);
  }, [query]);

  const handleSelectFood = (food: PresetFood) => {
    setSelectedFood(food);
    setQuantity(1);
  };

  const handleSave = useCallback(async () => {
    if (!selectedFood) return;
    setSaving(true);
    try {
      const calculated = foodDatabaseService.calculateMacrosForQuantity(selectedFood, quantity);
      const today = toISODate();
      const draft = {
        type: mealType,
        name: `${selectedFood.name} (${quantity}x)`,
        items: [
          {
            id: selectedFood.id,
            name: selectedFood.name,
            servingSize: `${quantity}x ${selectedFood.servingSize}`,
            quantity: 1,
            confidence: 1.0,
            source: 'manual' as const,
            createdAt: new Date().toISOString(),
            macros: calculated,
          },
        ],
      };
      await saveMeal.mutateAsync({ draft, date: today });
      setSaving(false);
      setSelectedFood(null);
      setQuery('');
      onClose();
    } catch {
      setSaving(false);
    }
  }, [selectedFood, quantity, mealType, saveMeal, onClose]);

  const currentMacros = selectedFood
    ? foodDatabaseService.calculateMacrosForQuantity(selectedFood, quantity)
    : null;

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

      {!selectedFood ? (
        <>
          <Input
            placeholder="Search Roti, Paneer, Rice, Whey, Oats..."
            value={query}
            onChangeText={setQuery}
            leftIcon={<Search size={18} color={colors.textMuted} />}
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
                      <Text variant="bodySmall" weight="bold" className="text-primary-600 dark:text-sky-400">
                        {food.macros.calories} kcal
                      </Text>
                      <Text variant="caption2" color="muted">
                        P: {food.macros.protein}g · C: {food.macros.carbs}g
                      </Text>
                    </View>
                    <View className="h-8 w-8 items-center justify-center rounded-full bg-primary-soft dark:bg-sky-900">
                      <Plus size={16} color="#0284C7" />
                    </View>
                  </View>
                </Card>
              </PressableScale>
            ))}
          </View>
        </>
      ) : (
        <View className="gap-4 pb-6 pt-1">
          <Card className="p-4 bg-primary-soft/50 dark:bg-neutral-800">
            <View className="flex-row items-center justify-between mb-2">
              <Text variant="title3" weight="bold" className="text-ink dark:text-neutral-50">
                {selectedFood.name}
              </Text>
              <Button label="Change" variant="ghost" size="sm" onPress={() => setSelectedFood(null)} />
            </View>
            <Text variant="bodySmall" color="secondary">
              Base serving: {selectedFood.servingSize}
            </Text>
          </Card>

          {/* Quantity Selector */}
          <View className="rounded-2xl bg-surface p-4 border border-border/60 dark:bg-neutral-900 dark:border-neutral-800">
            <Text variant="subhead" weight="semibold" className="mb-3 text-ink dark:text-neutral-50">
              Select Quantity
            </Text>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <IconButton
                  variant="surface"
                  label="Decrease quantity"
                  onPress={() => setQuantity((q) => Math.max(0.5, Math.round((q - 0.5) * 10) / 10))}
                  icon={<Minus size={18} color={colors.text} />}
                />
                <Text variant="title2" weight="bold" className="min-w-[50px] text-center text-primary-600 dark:text-sky-400">
                  {quantity}x
                </Text>
                <IconButton
                  variant="surface"
                  label="Increase quantity"
                  onPress={() => setQuantity((q) => Math.round((q + 0.5) * 10) / 10)}
                  icon={<Plus size={18} color={colors.text} />}
                />
              </View>

              <View className="flex-row gap-1">
                {[1, 2, 3].map((val) => (
                  <Chip
                    key={val}
                    label={`${val}x`}
                    selected={quantity === val}
                    onPress={() => setQuantity(val)}
                  />
                ))}
              </View>
            </View>
          </View>

          {/* Live Calculated Macro Summary */}
          {currentMacros ? (
            <View className="rounded-2xl bg-surface p-4 border border-border/60 dark:bg-neutral-900 dark:border-neutral-800">
              <Text variant="caption" color="muted" className="mb-2 uppercase tracking-wider">
                Total Nutrition
              </Text>

              <View className="flex-row items-center justify-between mb-3">
                <Text variant="title1" weight="bold" className="text-primary-600 dark:text-sky-400">
                  {currentMacros.calories} <Text variant="bodySmall" color="secondary">kcal</Text>
                </Text>
              </View>

              <View className="flex-row justify-between pt-2 border-t border-border/40 dark:border-neutral-800">
                <View className="items-center">
                  <Text variant="bodySmall" weight="bold">{currentMacros.protein}g</Text>
                  <Text variant="caption2" color="muted">Protein</Text>
                </View>
                <View className="items-center">
                  <Text variant="bodySmall" weight="bold">{currentMacros.carbs}g</Text>
                  <Text variant="caption2" color="muted">Carbs</Text>
                </View>
                <View className="items-center">
                  <Text variant="bodySmall" weight="bold">{currentMacros.fat}g</Text>
                  <Text variant="caption2" color="muted">Fat</Text>
                </View>
              </View>
            </View>
          ) : null}

          <Button
            label={`Log to ${MEAL_TYPE_LABELS[mealType]}`}
            onPress={handleSave}
            size="lg"
            fullWidth
            loading={saving}
            icon={<Check size={18} color="#FFFFFF" />}
          />
        </View>
      )}
    </BottomSheet>
  );
}
