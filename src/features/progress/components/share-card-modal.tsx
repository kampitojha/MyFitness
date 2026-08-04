import { useState } from 'react';
import { View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Share2, Trophy, Flame, Beef, Droplets } from 'lucide-react-native';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/hooks/use-profile';
import { useTodayMacros } from '@/hooks/use-meals';
import { useWaterTotal } from '@/hooks/use-tracker';
import { useWorkoutBurnForDate } from '@/hooks/use-workouts';
import { toISODate, formatLong } from '@/utils/date';
import { formatNumber } from '@/utils/number';

export interface ShareCardModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ShareCardModal({ visible, onClose }: ShareCardModalProps) {
  const today = toISODate();
  const { data: profile } = useProfile();
  const { macros } = useTodayMacros();
  const waterTotal = useWaterTotal(today);
  const { data: burn } = useWorkoutBurnForDate(today);
  const [copied, setCopied] = useState(false);

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Share daily progress story" snapTo={0.8}>
      {/* Story Card Container */}
      <View className="mb-5 overflow-hidden rounded-[28px] bg-gradient-to-br from-primary-700 via-primary-600 to-emerald-800 p-6 shadow-2xl dark:from-neutral-900 dark:to-neutral-950">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text variant="caption" className="text-white/80 uppercase tracking-widest font-semibold">
              NutraScan Fitness
            </Text>
            <Text variant="title2" weight="bold" className="text-white">
              {profile?.name || 'Athlete'}{'\''}s Daily Summary
            </Text>
          </View>
          <View className="h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <Trophy size={20} color="#FFFFFF" />
          </View>
        </View>

        <Text variant="caption" className="text-white/70 mb-5">
          {formatLong(today)}
        </Text>

        <View className="gap-3 mb-4">
          <View className="flex-row justify-between rounded-2xl bg-white/10 p-3.5 backdrop-blur">
            <View className="flex-row items-center gap-2">
              <Flame size={18} color="#FFD166" />
              <Text variant="bodySmall" weight="semibold" className="text-white">Calories Consumed</Text>
            </View>
            <Text variant="bodySmall" weight="bold" className="text-white">{formatNumber(macros.calories)} kcal</Text>
          </View>

          <View className="flex-row justify-between rounded-2xl bg-white/10 p-3.5 backdrop-blur">
            <View className="flex-row items-center gap-2">
              <Beef size={18} color="#F78C6C" />
              <Text variant="bodySmall" weight="semibold" className="text-white">Protein Target</Text>
            </View>
            <Text variant="bodySmall" weight="bold" className="text-white">{formatNumber(macros.protein)}g / {formatNumber(profile?.dailyGoals.protein ?? 125)}g</Text>
          </View>

          <View className="flex-row justify-between rounded-2xl bg-white/10 p-3.5 backdrop-blur">
            <View className="flex-row items-center gap-2">
              <Flame size={18} color="#FF5964" />
              <Text variant="bodySmall" weight="semibold" className="text-white">Workout Burned</Text>
            </View>
            <Text variant="bodySmall" weight="bold" className="text-white">-{formatNumber(burn ?? 0)} kcal</Text>
          </View>

          <View className="flex-row justify-between rounded-2xl bg-white/10 p-3.5 backdrop-blur">
            <View className="flex-row items-center gap-2">
              <Droplets size={18} color="#38BDF8" />
              <Text variant="bodySmall" weight="semibold" className="text-white">Hydration</Text>
            </View>
            <Text variant="bodySmall" weight="bold" className="text-white">{formatNumber(waterTotal.data ?? 0)} ml</Text>
          </View>
        </View>

        <View className="items-center pt-2">
          <Text variant="caption2" className="text-white/60">
            Tracked with MyFitness App · NutraScan AI
          </Text>
        </View>
      </View>

      <Button
        label={copied ? '✓ Copied!' : 'Copy story summary'}
        onPress={async () => {
          const text = [
            `🏋️ ${profile?.name || 'Athlete'}'s Daily Summary — ${formatLong(today)}`,
            `🔥 Calories: ${formatNumber(macros.calories)} kcal consumed`,
            `🥩 Protein: ${formatNumber(macros.protein)}g / ${formatNumber(profile?.dailyGoals.protein ?? 125)}g`,
            `💪 Workout burned: -${formatNumber(burn ?? 0)} kcal`,
            `💧 Hydration: ${formatNumber(waterTotal.data ?? 0)} ml`,
            '',
            'Tracked with MyFitness · NutraScan AI',
          ].join('\n');
          await Clipboard.setStringAsync(text);
          setCopied(true);
          setTimeout(() => { setCopied(false); onClose(); }, 1500);
        }}
        size="lg"
        fullWidth
        icon={<Share2 size={18} color="#FFFFFF" />}
      />
    </BottomSheet>
  );
}
