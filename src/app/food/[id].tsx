import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Minus, Plus, Check, Scale } from 'lucide-react-native';

import { Screen } from '@/components/ui/screen';
import { Header } from '@/components/ui/header';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Button, IconButton } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { MacroRing } from '@/components/ui/macro-ring';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Spinner } from '@/components/ui/spinner';
import { ErrorState } from '@/components/ui/error-state';

import {
  foodDatabaseService,
  type PresetFood,
  type PresetMicros,
} from '@/services/food-database.service';
import { useSaveMeal } from '@/hooks/use-meals';
import { useProfile } from '@/hooks/use-profile';
import { useTheme } from '@/hooks/use-theme';
import { useSettingsStore } from '@/store/settings.store';
import { MEAL_TYPES, MEAL_TYPE_LABELS, type MealType } from '@/types/meals';
import { toISODate } from '@/utils/date';
import { formatNumber } from '@/utils/number';
import { MACRO_COLORS } from '@/constants/macros';

const CAL_PER_G = { protein: 4, carbs: 4, fat: 9 } as const;

export default function FoodDetailScreen() {
  const { id, mealType: mealTypeParam } = useLocalSearchParams<{ id: string; mealType?: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const saveMeal = useSaveMeal();
  const hapticsEnabled = useSettingsStore((s) => s.hapticsEnabled);
  const { data: profile } = useProfile();

  const [food, setFood] = useState<PresetFood | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [mealType, setMealType] = useState<MealType>(
    MEAL_TYPES.includes(mealTypeParam as MealType) ? (mealTypeParam as MealType) : 'lunch',
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const found = await foodDatabaseService.getById(id || '');
        if (!active) return;
        if (!found) {
          setError(true);
        } else {
          setFood(found);
        }
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  const goalCalories = profile?.dailyGoals?.calories ?? 2000;
  const macros = food ? foodDatabaseService.calculateMacrosForQuantity(food, quantity) : null;
  const micros: PresetMicros = food
    ? foodDatabaseService.calculateMicrosForQuantity(food, quantity)
    : {};
  const ringValue = macros ? Math.min(100, Math.round((macros.calories / goalCalories) * 100)) : 0;

  const calorieSplit = useMemo(() => {
    if (!macros) return { items: [], total: 0 };
    const protein = macros.protein * CAL_PER_G.protein;
    const carbs = macros.carbs * CAL_PER_G.carbs;
    const fat = macros.fat * CAL_PER_G.fat;
    const total = Math.max((protein + carbs + fat) || macros.calories, 1);
    const pct = (v: number) => Math.round((v / total) * 100);
    return {
      total,
      items: [
        { key: 'protein' as const, label: 'Protein', kcal: protein, pct: pct(protein), color: MACRO_COLORS.protein },
        { key: 'carbs' as const, label: 'Carbs', kcal: carbs, pct: pct(carbs), color: MACRO_COLORS.carbs },
        { key: 'fat' as const, label: 'Fat', kcal: fat, pct: pct(fat), color: MACRO_COLORS.fat },
      ],
    };
  }, [macros]);

  const handleLog = useCallback(async () => {
    if (!food || !macros) return;
    if (hapticsEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    setSaving(true);
    try {
      const today = toISODate();
      await saveMeal.mutateAsync({
        draft: {
          type: mealType,
          name: `${food.name} (${quantity}x)`,
          items: [
            {
              id: food.id,
              name: food.name,
              servingSize: `${quantity}x ${food.servingSize}`,
              quantity: 1,
              confidence: 1.0,
              source: 'manual' as const,
              createdAt: new Date().toISOString(),
              macros,
            },
          ],
        },
        date: today,
      });
      router.back();
    } catch {
      setSaving(false);
    }
  }, [food, macros, mealType, quantity, saveMeal, router, hapticsEnabled]);

  const step = useCallback((delta: number) => {
    if (hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
    setQuantity((q) => Math.max(0.5, Math.round((q + delta) * 10) / 10));
  }, [hapticsEnabled]);

  if (loading) {
    return (
      <Screen edges={['top']}>
        <Header title="Food Details" onBack={() => router.back()} />
        <View className="flex-1 items-center justify-center">
          <Spinner size="large" />
        </View>
      </Screen>
    );
  }

  if (error || !food || !macros) {
    return (
      <Screen edges={['top']}>
        <Header title="Food Details" onBack={() => router.back()} />
        <ErrorState
          title="Food Not Found"
          message="We couldn't load the nutrition details for this food."
          onRetry={() => router.back()}
        />
      </Screen>
    );
  }

  return (
    <Screen edges={['top']} contentContainerStyle={{ paddingBottom: 0 }}>
      <Header title="Food Details" onBack={() => router.back()} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}>
        {/* Hero Card */}
        <View className="mx-5 mb-4 overflow-hidden rounded-3xl">
          <LinearGradient
            colors={['#0E7A4A', '#0A4E31']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-6"
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-4">
                <Chip label={food.category} className="bg-white/15 border-white/20 mb-2" />
                <Text variant="title3" weight="bold" className="text-white leading-tight">
                  {food.name}
                </Text>
                <View className="mt-1.5 flex-row items-center">
                  <Scale size={13} color="rgba(255,255,255,0.8)" />
                  <Text variant="footnote" className="ml-1.5 text-white/80">
                    {quantity}x · {food.servingSize}
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row items-center">
              <MacroRing value={ringValue} size={132} strokeWidth={9} color="#7EE0B0" trackColor="rgba(255,255,255,0.15)">
                <View className="items-center">
                  <Text variant="display" className="text-white font-bold leading-tight">
                    {formatNumber(macros.calories)}
                  </Text>
                  <Text variant="caption" className="text-white/80">
                    kcal
                  </Text>
                </View>
              </MacroRing>

              <View className="ml-6 flex-1 gap-2">
                <Text variant="caption" className="text-white/70 font-semibold">
                  MACRO BREAKDOWN
                </Text>
                {calorieSplit.items.map((item) => (
                  <View key={item.key} className="flex-row items-center gap-2">
                    <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <Text variant="bodySmall" className="flex-1 text-white">
                      {item.label}
                    </Text>
                    <Text variant="bodySmall" weight="semibold" className="text-white">
                      {macros[item.key]}g
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Serving Selector */}
        <Card className="mx-5 mb-4 p-4">
          <Text variant="subhead" weight="semibold" className="mb-3 text-ink dark:text-neutral-50">
            Serving size
          </Text>

          <View className="flex-row items-center justify-between">
            <View className="h-12 flex-row items-center gap-4 rounded-full bg-primary-soft/60 px-2 dark:bg-neutral-800">
              <IconButton
                variant="soft"
                label="Decrease serving"
                onPress={() => step(-0.5)}
                size={40}
                icon={<Minus size={18} color={colors.primary} />}
              />
              <Text variant="title2" weight="bold" className="min-w-[56px] text-center text-primary-600 dark:text-emerald-400">
                {quantity}x
              </Text>
              <IconButton
                variant="soft"
                label="Increase serving"
                onPress={() => step(0.5)}
                size={40}
                icon={<Plus size={18} color={colors.primary} />}
              />
            </View>

            <View className="flex-row gap-2">
              {[0.5, 1, 2, 3].map((val) => (
                <Chip
                  key={val}
                  label={`${val}x`}
                  selected={quantity === val}
                  onPress={() => setQuantity(val)}
                />
              ))}
            </View>
          </View>

          <Text variant="caption" color="muted" className="mt-3">
            Values below update live as you change the serving size.
          </Text>
        </Card>

        {/* Calorie Breakdown */}
        <Card className="mx-5 mb-4 p-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text variant="subhead" weight="semibold" className="text-ink dark:text-neutral-50">
              Calorie breakdown
            </Text>
            <Text variant="caption" color="muted">
              {formatNumber(macros.calories)} kcal total
            </Text>
          </View>

          <View className="gap-4">
            {calorieSplit.items.map((item) => (
              <View key={item.key}>
                <View className="mb-1.5 flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="h-2.5 w-2.5 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                    <Text variant="bodySmall" color="secondary">
                      {item.label}
                    </Text>
                  </View>
                  <Text variant="bodySmall" weight="semibold">
                    {formatNumber(item.kcal)} kcal
                  </Text>
                </View>
                <ProgressBar value={item.pct} color={item.color} height={7} trackClassName="bg-neutral-100 dark:bg-neutral-800" />
                <View className="mt-1.5 self-end">
                  <Text variant="caption2" color="muted">
                    {item.pct}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Nutrition Facts */}
        <Card className="mx-5 mb-4 !p-0 overflow-hidden">
          <View className="px-4 py-3 border-b border-border/60 dark:border-neutral-800">
            <Text variant="subhead" weight="semibold" className="text-ink dark:text-neutral-50">
              Nutrition facts
            </Text>
            <Text variant="caption2" color="muted">
              Per {quantity}x serving
            </Text>
          </View>

          <NutritionRow label="Calories" value={macros.calories} unit=" kcal" strong />

          <View className="border-t border-border/60 dark:border-neutral-800 px-4 py-2.5">
            <NutritionRow label="Fat" value={macros.fat} unit="g" />
            <NutritionSubRow label="Saturated fat" value={micros.saturatedFat} />
          </View>

          <View className="border-t border-border/60 dark:border-neutral-800 px-4 py-2.5">
            <NutritionRow label="Cholesterol" value={micros.cholesterol} unit="mg" />
          </View>

          <View className="border-t border-border/60 dark:border-neutral-800 px-4 py-2.5">
            <NutritionRow label="Sodium" value={micros.sodium} unit="mg" />
          </View>

          <View className="border-t border-border/60 dark:border-neutral-800 px-4 py-2.5">
            <NutritionRow label="Carbohydrates" value={macros.carbs} unit="g" />
            <NutritionSubRow label="Fiber" value={micros.fiber} />
            <NutritionSubRow label="Sugars" value={micros.sugar} />
          </View>

          <View className="border-t border-border/60 dark:border-neutral-800 px-4 py-2.5">
            <NutritionRow label="Protein" value={macros.protein} unit="g" />
          </View>
        </Card>

        {/* Log To */}
        <View className="mx-5 mb-2">
          <Text variant="caption" color="muted" className="mb-2">
            LOG TO
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {MEAL_TYPES.map((type) => (
              <Chip
                key={type}
                label={MEAL_TYPE_LABELS[type]}
                selected={mealType === type}
                onPress={() => setMealType(type)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky footer */}
      <View className="border-t border-border/60 bg-background px-5 pt-3 pb-2 dark:border-neutral-800 dark:bg-background-dark">
        <Button
          label={`Log ${macros.calories} kcal to ${MEAL_TYPE_LABELS[mealType]}`}
          onPress={handleLog}
          size="lg"
          fullWidth
          loading={saving}
          icon={<Check size={18} color="#FFFFFF" />}
        />
      </View>
    </Screen>
  );
}

function NutritionRow({
  label,
  value,
  unit,
  strong = false,
}: {
  label: string;
  value?: number;
  unit?: string;
  strong?: boolean;
}) {
  const formatted = value == null ? '—' : `${formatNumber(value)}${unit ?? ''}`;
  return (
    <View className="flex-row items-center justify-between py-2">
      <Text variant={strong ? 'headline' : 'body'} weight={strong ? 'bold' : 'medium'}>
        {label}
      </Text>
      <Text variant={strong ? 'headline' : 'body'} weight="semibold" className="text-primary-600 dark:text-emerald-400">
        {formatted}
      </Text>
    </View>
  );
}

function NutritionSubRow({ label, value, unit = 'g' }: { label: string; value?: number; unit?: string }) {
  return (
    <View className="flex-row items-center justify-between py-1 pl-4">
      <Text variant="caption" color="muted">
        {label}
      </Text>
      <Text variant="caption" color="secondary">
        {value == null ? '—' : `${formatNumber(value)}${unit}`}
      </Text>
    </View>
  );
}