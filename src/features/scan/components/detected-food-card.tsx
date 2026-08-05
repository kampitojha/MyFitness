import { View } from 'react-native';
import { Minus, Plus, Trash2, Sparkles } from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Text } from '@/components/ui/text';
import type { DetectedFood } from '@/types/food';
import { scaleMacros } from '@/types/meals';
import { formatNumber, percent } from '@/utils/number';

export interface DetectedFoodCardProps {
  food: DetectedFood;
  onUpdateQuantity: (q: number) => void;
  onRemove: () => void;
}

export function DetectedFoodCard({ food, onUpdateQuantity, onRemove }: DetectedFoodCardProps) {
  const { colors } = useTheme();
  const macros = scaleMacros(food.macros, food.quantity);
  const confidence = percent(food.confidence, 100);

  return (
    <View className="rounded-2xl border border-border bg-surface p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text variant="subhead" weight="semibold" numberOfLines={2} className="flex-1">
              {food.name}
            </Text>
          </View>
          <Text variant="caption" color="muted" className="mt-0.5">
            {food.servingSize} · prediction {confidence}%
          </Text>
        </View>
        <PressableScale onPress={onRemove} accessibilityRole="button" accessibilityLabel={`Remove ${food.name}`}>
          <Trash2 size={18} color={colors.textMuted} />
        </PressableScale>
      </View>

      <View className="mt-3 flex-row gap-3">
        <MacroValue label="kcal" value={formatNumber(macros.calories)} />
        <MacroValue label="Protein" value={`${formatNumber(macros.protein)}g`} />
        <MacroValue label="Carbs" value={`${formatNumber(macros.carbs)}g`} />
        <MacroValue label="Fat" value={`${formatNumber(macros.fat)}g`} />
      </View>

      <View className="mt-3 flex-row items-center justify-between rounded-xl bg-surface-alt px-2 py-1.5 dark:bg-neutral-800">
        <PressableScale
          onPress={() => onUpdateQuantity(Math.max(0.1, Math.round((food.quantity - 0.25) * 4) / 4))}
          accessibilityRole="button"
          accessibilityLabel="Decrease serving"
          className="h-8 w-8 items-center justify-center rounded-full bg-surface dark:bg-neutral-900"
        >
          <Minus size={16} color={colors.text} />
        </PressableScale>
        <Text variant="footnote" weight="semibold" className="text-ink dark:text-neutral-100">
          {food.quantity} serving{food.quantity === 1 ? '' : 's'}
        </Text>
        <PressableScale
          onPress={() => onUpdateQuantity(Math.round((food.quantity + 0.25) * 4) / 4)}
          accessibilityRole="button"
          accessibilityLabel="Increase serving"
          className="h-8 w-8 items-center justify-center rounded-full bg-surface dark:bg-neutral-900"
        >
          <Plus size={16} color={colors.text} />
        </PressableScale>
      </View>

      {food.healthScore !== undefined ? (
        <View className="mt-3 flex-row items-center gap-1.5">
          <Sparkles size={13} color={colors.accent} />
          <Text variant="caption2" color="secondary">
            Health score {food.healthScore}/100
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function MacroValue({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 items-center rounded-xl bg-surface-alt py-2 dark:bg-neutral-800">
      <Text variant="footnote" weight="bold" className="text-ink dark:text-neutral-100">
        {value}
      </Text>
      <Text variant="caption2" color="muted">
        {label}
      </Text>
    </View>
  );
}