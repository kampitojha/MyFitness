import { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Pill, Plus, Check, Trash2 } from 'lucide-react-native';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button, IconButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { PressableScale } from '@/components/ui/pressable-scale';

import { PRESET_SUPPLEMENTS, supplementService } from '@/services/supplement.service';
import { useSupplements, useAddSupplement, useToggleSupplement, useRemoveSupplement } from '@/hooks/use-supplements';
import { useTheme } from '@/hooks/use-theme';

export interface SupplementModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SupplementModal({ visible, onClose }: SupplementModalProps) {
  const { colors } = useTheme();
  const { data: supplements = [] } = useSupplements();
  const addMutation = useAddSupplement();
  const toggleMutation = useToggleSupplement();
  const removeMutation = useRemoveSupplement();

  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSelectPreset = (p: typeof PRESET_SUPPLEMENTS[0]) => {
    setName(p.name);
    setDose(p.dose);
    setShowAddForm(true);
  };

  const handleAdd = () => {
    if (!name.trim()) return;
    addMutation.mutate(
      { name: name.trim(), dose: dose.trim() || '1 serving' },
      {
        onSuccess: () => {
          setName('');
          setDose('');
          setShowAddForm(false);
        },
      },
    );
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Daily Supplement Tracker" snapTo={0.85}>
      <View className="mb-4">
        <Text variant="caption" color="secondary" className="mb-2">
          Track your daily vitamins, creatine, protein & minerals
        </Text>
      </View>

      {/* Active Supplements List */}
      <View className="gap-2 mb-4">
        {supplements.length === 0 ? (
          <Card className="p-4 items-center justify-center border-dashed">
            <Pill size={24} color={colors.textMuted} className="mb-1" />
            <Text variant="bodySmall" color="secondary">
              No supplements added yet. Tap below or select a preset!
            </Text>
          </Card>
        ) : (
          supplements.map((sup) => {
            const isTaken = supplementService.isTakenToday(sup);
            const streak = supplementService.streakDays(sup);
            return (
              <Card
                key={sup.id}
                className={`p-3.5 flex-row items-center justify-between border ${
                  isTaken ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-surface dark:bg-neutral-900 border-border/60'
                }`}
              >
                <PressableScale
                  className="flex-1 flex-row items-center gap-3"
                  onPress={() => toggleMutation.mutate({ id: sup.id, taken: isTaken })}
                >
                  <View
                    className={`h-9 w-9 rounded-full items-center justify-center ${
                      isTaken ? 'bg-emerald-500' : 'bg-surface-alt dark:bg-neutral-800'
                    }`}
                  >
                    {isTaken ? <Check size={18} color="#FFFFFF" /> : <Pill size={18} color={colors.textMuted} />}
                  </View>
                  <View>
                    <Text variant="body" weight="semibold" className={isTaken ? 'line-through opacity-70' : ''}>
                      {sup.name}
                    </Text>
                    <Text variant="caption2" color="secondary">
                      {sup.dose} {streak > 1 ? `· 🔥 ${streak} day streak` : ''}
                    </Text>
                  </View>
                </PressableScale>

                <IconButton
                  variant="ghost"
                  label="Remove supplement"
                  onPress={() => removeMutation.mutate(sup.id)}
                  icon={<Trash2 size={16} color={colors.textMuted} />}
                />
              </Card>
            );
          })
        )}
      </View>

      {!showAddForm ? (
        <View className="mb-4">
          <Button
            label="Add Custom Supplement"
            variant="soft"
            onPress={() => setShowAddForm(true)}
            icon={<Plus size={16} color="#0E7A4A" />}
            fullWidth
            className="mb-3"
          />

          <Text variant="caption" weight="semibold" className="mb-2 uppercase tracking-wider text-ink dark:text-neutral-50">
            Quick Add Presets
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
            {PRESET_SUPPLEMENTS.map((preset, idx) => (
              <Chip
                key={idx}
                label={`${preset.name} (${preset.dose})`}
                onPress={() => handleSelectPreset(preset)}
                className="mr-1"
              />
            ))}
          </ScrollView>
        </View>
      ) : (
        <Card className="p-4 gap-3 mb-4 bg-primary-50/50 dark:bg-neutral-800/80">
          <Text variant="subhead" weight="bold">Add Supplement</Text>
          <Input placeholder="Name (e.g. Creatine Monohydrate)" value={name} onChangeText={setName} autoFocus />
          <Input placeholder="Dose (e.g. 5g, 1 scoop, 2 pills)" value={dose} onChangeText={setDose} />
          <View className="flex-row gap-2 mt-1">
            <Button label="Cancel" variant="ghost" className="flex-1" onPress={() => setShowAddForm(false)} />
            <Button label="Save" variant="primary" className="flex-1" onPress={handleAdd} loading={addMutation.isPending} />
          </View>
        </Card>
      )}
    </BottomSheet>
  );
}
