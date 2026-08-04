import { useState } from 'react';
import { View } from 'react-native';
import { Moon, Sun, Check } from 'lucide-react-native';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';

import { sleepService, SLEEP_QUALITY_LABELS, type SleepQuality } from '@/services/sleep.service';
import { useLogSleep, useSleepToday } from '@/hooks/use-sleep';
import { toISODate } from '@/utils/date';

export interface SleepLogModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SleepLogModal({ visible, onClose }: SleepLogModalProps) {
  const today = toISODate();
  const { data: todaySleep } = useSleepToday();
  const logMutation = useLogSleep();

  const [bedHours, setBedHours] = useState(todaySleep?.bedtimeHour?.toString() ?? '23');
  const [bedMins, setBedMins] = useState(todaySleep?.bedtimeMin?.toString() ?? '00');
  const [wakeHours, setWakeHours] = useState(todaySleep?.wakeHour?.toString() ?? '07');
  const [wakeMins, setWakeMins] = useState(todaySleep?.wakeMin?.toString() ?? '00');
  const [quality, setQuality] = useState<SleepQuality>((todaySleep?.quality as SleepQuality) ?? 4);

  const bH = Math.min(23, Math.max(0, Number(bedHours) || 0));
  const bM = Math.min(59, Math.max(0, Number(bedMins) || 0));
  const wH = Math.min(23, Math.max(0, Number(wakeHours) || 0));
  const wM = Math.min(59, Math.max(0, Number(wakeMins) || 0));

  const durationMins = sleepService.calcDuration(bH, bM, wH, wM);

  const handleSave = () => {
    logMutation.mutate(
      {
        date: today,
        bedtimeHour: bH,
        bedtimeMin: bM,
        wakeHour: wH,
        wakeMin: wM,
        durationMinutes: durationMins,
        quality,
      },
      {
        onSuccess: onClose,
      },
    );
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Log Sleep & Recovery" snapTo={0.85}>
      <Card className="p-4 mb-4 bg-indigo-500/10 border-indigo-500/30 dark:bg-indigo-950/40">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Moon size={22} color="#6366F1" />
            <Text variant="subhead" weight="bold">Calculated Sleep Duration</Text>
          </View>
          <Text variant="title2" weight="bold" className="text-indigo-600 dark:text-indigo-400">
            {sleepService.formatDuration(durationMins)}
          </Text>
        </View>
      </Card>

      {/* Bedtime & Waketime Inputs */}
      <View className="flex-row gap-3 mb-4">
        <View className="flex-1 rounded-2xl bg-surface p-3.5 border border-border/60 dark:bg-neutral-900">
          <View className="flex-row items-center gap-1.5 mb-2">
            <Moon size={16} color="#6366F1" />
            <Text variant="caption" weight="semibold">Bedtime</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Input
              value={bedHours}
              onChangeText={setBedHours}
              keyboardType="number-pad"
              placeholder="23"
              className="flex-1 text-center font-bold"
              maxLength={2}
            />
            <Text variant="body" weight="bold">:</Text>
            <Input
              value={bedMins}
              onChangeText={setBedMins}
              keyboardType="number-pad"
              placeholder="00"
              className="flex-1 text-center font-bold"
              maxLength={2}
            />
          </View>
        </View>

        <View className="flex-1 rounded-2xl bg-surface p-3.5 border border-border/60 dark:bg-neutral-900">
          <View className="flex-row items-center gap-1.5 mb-2">
            <Sun size={16} color="#F59E0B" />
            <Text variant="caption" weight="semibold">Wake-up Time</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Input
              value={wakeHours}
              onChangeText={setWakeHours}
              keyboardType="number-pad"
              placeholder="07"
              className="flex-1 text-center font-bold"
              maxLength={2}
            />
            <Text variant="body" weight="bold">:</Text>
            <Input
              value={wakeMins}
              onChangeText={setWakeMins}
              keyboardType="number-pad"
              placeholder="00"
              className="flex-1 text-center font-bold"
              maxLength={2}
            />
          </View>
        </View>
      </View>

      {/* Sleep Quality Selector */}
      <Text variant="subhead" weight="semibold" className="mb-2 text-ink dark:text-neutral-50">
        Sleep Quality
      </Text>
      <View className="flex-row flex-wrap gap-2 mb-5">
        {([1, 2, 3, 4, 5] as SleepQuality[]).map((q) => (
          <Chip
            key={q}
            label={SLEEP_QUALITY_LABELS[q]}
            selected={quality === q}
            onPress={() => setQuality(q)}
          />
        ))}
      </View>

      <Button
        label="Save Sleep Log"
        onPress={handleSave}
        size="lg"
        fullWidth
        loading={logMutation.isPending}
        icon={<Check size={18} color="#FFFFFF" />}
      />
    </BottomSheet>
  );
}
