import { useState } from 'react';
import { View } from 'react-native';
import { Dumbbell, Flame, Check } from 'lucide-react-native';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { WORKOUT_TYPES } from '@/services/workout.service';
import { useSaveWorkout } from '@/hooks/use-workouts';
import { toISODate } from '@/utils/date';

export interface WorkoutModalProps {
  visible: boolean;
  onClose: () => void;
}

export function WorkoutModal({ visible, onClose }: WorkoutModalProps) {
  const saveWorkout = useSaveWorkout();
  const [selectedType, setSelectedType] = useState(WORKOUT_TYPES[0]);
  const [duration, setDuration] = useState('45');
  const [saving, setSaving] = useState(false);

  const durationNum = Math.max(1, Number(duration) || 0);
  const estimatedBurn = Math.round(durationNum * selectedType.calPerMin);

  const handleSave = async () => {
    setSaving(true);
    try {
      const today = toISODate();
      await saveWorkout.mutateAsync({
        type: selectedType.id,
        name: selectedType.name,
        durationMinutes: durationNum,
        date: today,
      });
      setSaving(false);
      onClose();
    } catch {
      setSaving(false);
    }
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Log workout activity" snapTo={0.75}>
      <Text variant="subhead" weight="semibold" className="mb-2 text-ink dark:text-neutral-50">
        Select Exercise Type
      </Text>

      <View className="mb-4 flex-row flex-wrap gap-2">
        {WORKOUT_TYPES.map((w) => (
          <Chip
            key={w.id}
            label={w.name}
            selected={selectedType.id === w.id}
            onPress={() => setSelectedType(w)}
          />
        ))}
      </View>

      <Input
        label="Duration (minutes)"
        keyboardType="number-pad"
        value={duration}
        onChangeText={setDuration}
        placeholder="e.g. 45"
        className="mb-4"
      />

      <View className="mb-5 flex-row items-center justify-between rounded-2xl bg-primary-soft p-4 dark:bg-emerald-950">
        <View className="flex-row items-center gap-2">
          <Flame size={22} color="#0E7A4A" />
          <View>
            <Text variant="subhead" weight="bold" className="text-primary-softText dark:text-emerald-200">
              Estimated Burn
            </Text>
            <Text variant="caption" color="secondary">
              ~{selectedType.calPerMin} kcal per minute
            </Text>
          </View>
        </View>

        <Text variant="title1" weight="bold" className="text-primary-600 dark:text-emerald-400">
          -{estimatedBurn} <Text variant="bodySmall" color="secondary">kcal</Text>
        </Text>
      </View>

      <Button
        label="Save workout"
        onPress={handleSave}
        size="lg"
        fullWidth
        loading={saving}
        icon={<Check size={18} color="#FFFFFF" />}
      />
    </BottomSheet>
  );
}
