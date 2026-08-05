import { View } from 'react-native';
import { useState } from 'react';
import { Award } from 'lucide-react-native';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Text } from '@/components/ui/text';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/utils/cn';

export interface AchievementCardProps {
  title: string;
  description: string;
  unlockedAt?: string;
  progress: number;
  loading?: boolean;
  onPress?: () => void;
}

export function AchievementCard({ title, description, unlockedAt, progress, loading, onPress }: AchievementCardProps) {
  const [pressed, setPressed] = useState(false);
  const unlocked = Boolean(unlockedAt);

  return (
    <PressableScale
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={!onPress || loading}
      className={cn(
        'flex-row items-center gap-3 rounded-[18px] border bg-surface p-4',
        unlocked ? 'border-primary-soft dark:border-sky-900' : 'border-border dark:border-neutral-800',
      )}
    >
      <View
        className={cn(
          'h-11 w-11 items-center justify-center rounded-xl',
          unlocked ? 'bg-primary-soft dark:bg-sky-900' : 'bg-surface-alt dark:bg-neutral-800',
        )}
      >
        {loading ? (
          <Spinner size="small" />
        ) : (
          <Award
            size={20}
            color={unlocked ? '#0284C7' : '#9AA3AF'}
          />
        )}
      </View>
      <View className="flex-1 gap-1">
        <Text variant="body" weight="semibold" numberOfLines={1}>
          {title}
        </Text>
        <Text variant="caption" color="secondary" numberOfLines={1}>
          {unlocked ? `Unlocked${unlockedAt ? ` · ${unlockedAt}` : ''}` : description}
        </Text>
        <View className="mt-1">
          <ProgressBar value={progress * 100} height={5} animated={pressed} />
        </View>
      </View>
    </PressableScale>
  );
}