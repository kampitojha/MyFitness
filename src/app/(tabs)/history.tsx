import { useMemo, useState } from 'react';
import { View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SearchIcon, Grid, ListFilter, Calendar, ChevronLeft, ChevronRight, Camera } from 'lucide-react-native';

import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Chip } from '@/components/ui/chip';
import { IconButton } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Divider } from '@/components/ui/divider';
import { PressableScale } from '@/components/ui/pressable-scale';
import { MealRow } from '@/features/meals/components/meal-row';
import { useMeals } from '@/hooks/use-meals';
import { useTheme } from '@/hooks/use-theme';
import { MEAL_TYPES, type MealType } from '@/types/meals';
import { relativeDayLabel, toISODate, addDays } from '@/utils/date';
import { formatNumber } from '@/utils/number';

type Filter = 'all' | MealType;
type ViewMode = 'list' | 'gallery';

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
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const today = toISODate();

  const groups = useMemo(() => {
    const source = (meals ?? []).filter((m) => {
      if (selectedDate && m.createdAt.slice(0, 10) !== selectedDate) return false;
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
  }, [meals, filter, query, selectedDate, today]);

  const photoMeals = useMemo(() => {
    return (meals ?? []).filter((m) => Boolean(m.imageUri));
  }, [meals]);

  if (isError) {
    return (
      <Screen edges={['top']}>
        <ErrorState onRetry={() => refetch()} />
      </Screen>
    );
  }

  return (
    <Screen edges={['top']} contentContainerStyle={{ paddingBottom: 130 }}>
      {/* Header */}
      <View className="mb-4 mt-2 flex-row items-center justify-between">
        <View>
          <Text variant="title1" className="text-ink dark:text-neutral-50">
            History & Gallery
          </Text>
          <Text variant="bodySmall" color="secondary">
            Every meal you’ve logged & scanned
          </Text>
        </View>

        <View className="flex-row items-center gap-1 rounded-2xl bg-surface p-1 dark:bg-neutral-900 border border-border/60">
          <IconButton
            variant={viewMode === 'list' ? 'surface' : 'ghost'}
            label="List View"
            onPress={() => setViewMode('list')}
            icon={<ListFilter size={16} color={viewMode === 'list' ? colors.primary : colors.textMuted} />}
          />
          <IconButton
            variant={viewMode === 'gallery' ? 'surface' : 'ghost'}
            label="Photo Gallery"
            onPress={() => setViewMode('gallery')}
            icon={<Grid size={16} color={viewMode === 'gallery' ? colors.primary : colors.textMuted} />}
          />
        </View>
      </View>

      {/* Date Picker Bar */}
      <View className="mb-3 flex-row items-center justify-between rounded-2xl bg-surface p-2.5 shadow-sm dark:bg-neutral-900 border border-border/50">
        <PressableScale
          onPress={() => {
            const base = selectedDate || today;
            setSelectedDate(addDays(base, -1));
          }}
          className="flex-row items-center gap-1 px-2 py-1"
        >
          <ChevronLeft size={18} color={colors.primary} />
          <Text variant="caption" weight="semibold" color="primary">Prev</Text>
        </PressableScale>

        <PressableScale onPress={() => setSelectedDate(null)} className="items-center">
          <View className="flex-row items-center gap-1.5">
            <Calendar size={14} color="#0284C7" />
            <Text variant="subhead" weight="bold">
              {selectedDate ? (selectedDate === today ? 'Today' : relativeDayLabel(selectedDate)) : 'All Time'}
            </Text>
          </View>
          {selectedDate ? (
            <Text variant="caption2" color="muted">Tap to view all time</Text>
          ) : null}
        </PressableScale>

        <PressableScale
          onPress={() => {
            const base = selectedDate || today;
            if (base < today) setSelectedDate(addDays(base, 1));
          }}
          disabled={Boolean(selectedDate && selectedDate >= today)}
          className={`flex-row items-center gap-1 px-2 py-1 ${selectedDate && selectedDate >= today ? 'opacity-30' : ''}`}
        >
          <Text variant="caption" weight="semibold" color="primary">Next</Text>
          <ChevronRight size={18} color={colors.primary} />
        </PressableScale>
      </View>

      {/* Search & Category Filter */}
      {viewMode === 'list' ? (
        <>
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
              description={query || filter !== 'all' || selectedDate ? 'Try clearing your search or date filter.' : 'Log your first meal to start tracking history.'}
              actionLabel={query || filter !== 'all' || selectedDate ? 'Clear filters' : 'Scan a meal'}
              onAction={() => {
                if (query || filter !== 'all' || selectedDate) {
                  setQuery('');
                  setFilter('all');
                  setSelectedDate(null);
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
                      {formatNumber(group.kcal)} kcal
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
        </>
      ) : (
        /* Photo Gallery Grid */
        <View className="pt-1">
          <Text variant="subhead" weight="semibold" className="mb-3">
            Scanned Meal Photos ({photoMeals.length})
          </Text>
          {photoMeals.length === 0 ? (
            <EmptyState
              icon={<Camera size={26} color={colors.textMuted} />}
              title="No scanned photos yet"
              description="Scan meals using the camera to build your food photo timeline!"
              actionLabel="Open Scanner"
              onAction={() => router.push('/scan')}
            />
          ) : (
            <View className="flex-row flex-wrap gap-2.5">
              {photoMeals.map((meal) => (
                <PressableScale
                  key={meal.id}
                  onPress={() => router.push({ pathname: '/meal/[id]', params: { id: meal.id } })}
                  className="w-[48%] overflow-hidden rounded-2xl bg-surface shadow-sm dark:bg-neutral-900"
                >
                  <Image source={{ uri: meal.imageUri }} className="h-36 w-full" resizeMode="cover" />
                  <View className="p-3">
                    <Text variant="bodySmall" weight="bold" numberOfLines={1}>
                      {meal.name}
                    </Text>
                    <View className="flex-row items-center justify-between mt-1">
                      <Text variant="caption2" color="muted">
                        {relativeDayLabel(meal.createdAt.slice(0, 10))}
                      </Text>
                      <Text variant="caption2" weight="semibold" className="text-primary-600 dark:text-sky-400">
                        {meal.macros.calories} kcal
                      </Text>
                    </View>
                  </View>
                </PressableScale>
              ))}
            </View>
          )}
        </View>
      )}
    </Screen>
  );
}