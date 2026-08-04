import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { SearchIcon } from 'lucide-react-native';

import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Divider } from '@/components/ui/divider';
import { MealRow } from '@/features/meals/components/meal-row';
import { useMeals } from '@/hooks/use-meals';
import { useTheme } from '@/hooks/use-theme';
import { MEAL_TYPES, type MealType } from '@/types/meals';
import { relativeDayLabel, toISODate } from '@/utils/date';

type Filter = 'all' | MealType;

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  ...MEAL_TYPES.map((t) => ({ value: t as Filter, label: t.charAt(0).toUpperCase() + t.slice(1) })),
];

export default function HistoryScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { data: meals, isLoading, isError, refetch } = useMeals();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const groups = useMemo(() => {
    const today = toISODate();
    const source = (meals ?? []).filter((m) => {
      if (filter !== 'all' && m.type !== filter) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const matchesMeal = m.name.toLowerCase().includes(q);
        const matchesItem = m.items.some((i) => i.name.toLowerCase().includes(q));
        if (!matchesMeal && !matchesItem) return false;
      }
      return true;
    });

    const map = new Map<string, typeof source>();
    for (const meal of source) {
      const day = meal.createdAt.slice(0, 10);
      map.set(day, [...(map.get(day) ?? []), meal]);
    }
    return [...map.entries()]
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([day, items]) => ({
        day,
        label: day === today ? 'Today' : relativeDayLabel(day),
        kcal: items.reduce((s, m) => s + m.macros.calories, 0),
        items,
      }));
  }, [meals, filter, query]);

  if (isError) {
    return (
      <Screen edges={['top']}>
        <ErrorState onRetry={() => refetch()} />
      </Screen>
    );
  }

  return (
    <Screen edges={['top']} contentContainerStyle={{ paddingBottom: 130 }}>
      <View className="mb-4 mt-2">
        <Text variant="title1" className="text-ink dark:text-neutral-50">
          History
        </Text>
        <Text variant="bodySmall" color="secondary">
          Every meal you’ve logged
        </Text>
      </View>

      <Input
        placeholder="Search meals or foods"
        value={query}
        onChangeText={setQuery}
        leftIcon={<SearchIcon size={18} color={colors.textMuted} />}
        className="mb-3"
      />

      <View className="mb-5 flex-row flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Chip key={f.value} label={f.label} selected={filter === f.value} onPress={() => setFilter(f.value)} />
        ))}
      </View>

      {isLoading ? (
        <View className="gap-4">
          {[0, 1, 2].map((i) => (
            <View key={i} className="rounded-[20px] bg-surface p-5 dark:bg-neutral-900">
              <Skeleton height={18} width="40%" />
              <View className="mt-3 gap-4">
                <Skeleton height={56} className="w-full rounded-2xl" />
                <Skeleton height={56} className="w-full rounded-2xl" />
              </View>
            </View>
          ))}
        </View>
      ) : groups.length === 0 ? (
        <EmptyState
          icon={<SearchIcon size={26} color={colors.textMuted} />}
          title="No meals found"
          description={query || filter !== 'all' ? 'Try a different search or filter.' : 'Log your first meal and it will show up here.'}
          actionLabel={query || filter !== 'all' ? 'Clear filters' : 'Scan a meal'}
          onAction={() => {
            if (query || filter !== 'all') {
              setQuery('');
              setFilter('all');
            } else {
              router.push('/scan');
            }
          }}
        />
      ) : (
        <View className="gap-4">
          {groups.map((group) => (
            <View key={group.day} className="rounded-[22px] bg-surface p-5 shadow-sm dark:bg-neutral-900">
              <View className="mb-4 flex-row items-center justify-between">
                <Text variant="subhead" weight="semibold">
                  {group.label}
                </Text>
                <Text variant="caption" color="muted">
                  {group.kcal} kcal
                </Text>
              </View>
              <View className="gap-4">
                {group.items.map((meal, index) => (
                  <View key={meal.id}>
                    <MealRow meal={meal} onPress={() => router.push({ pathname: '/meal/[id]', params: { id: meal.id } })} />
                    {index < group.items.length - 1 ? <Divider className="my-4" /> : null}
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}
    </Screen>
  );
}