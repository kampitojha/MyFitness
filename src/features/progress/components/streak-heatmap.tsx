import { View, useWindowDimensions } from 'react-native';
import { useMemo } from 'react';
import { Text } from '@/components/ui/text';
import { useAllMealsSummary } from '@/hooks/use-meals';
import { lastNDays, toISODate } from '@/utils/date';
import { useTheme } from '@/hooks/use-theme';

const WEEKS = 15; // how many weeks to show
const DAYS = WEEKS * 7;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getColor(logged: boolean, calories: number, isDark: boolean): string {
  if (!logged) return isDark ? '#1f2937' : '#f1f5f9';
  if (calories < 500) return isDark ? '#064e3b' : '#d1fae5';
  if (calories < 1200) return isDark ? '#065f46' : '#6ee7b7';
  if (calories < 1800) return isDark ? '#047857' : '#34d399';
  return isDark ? '#059669' : '#10b981';
}

/**
 * GitHub-style activity heatmap calendar showing logged meal days.
 * 15 weeks × 7 days grid.
 */
export function StreakHeatmap() {
  const { isDark } = useTheme();
  const grouped = useAllMealsSummary();
  const { width } = useWindowDimensions();

  const cellSize = Math.floor(Math.min((width - 56) / WEEKS, 18));
  const gap = 2;

  const days = useMemo(() => lastNDays(DAYS, toISODate()), []);

  // Pad so first day starts at correct weekday column
  const firstDay = new Date(days[0]);
  const startPad = firstDay.getDay(); // 0=Sun

  const cells = useMemo(() => {
    return days.map((date) => {
      const meals = grouped[date] ?? [];
      const calories = meals.reduce((s, m) => s + m.macros.calories, 0);
      return { date, calories, logged: meals.length > 0 };
    });
  }, [days, grouped]);

  // Month labels
  const monthLabels = useMemo(() => {
    const seen = new Set<string>();
    const labels: { label: string; col: number }[] = [];
    days.forEach((date, i) => {
      const col = Math.floor((startPad + i) / 7);
      const month = MONTHS[new Date(date).getMonth()];
      if (!seen.has(month)) {
        seen.add(month);
        labels.push({ label: month, col });
      }
    });
    return labels;
  }, [days, startPad]);

  const totalLogged = cells.filter((c) => c.logged).length;
  const totalCols = Math.ceil((startPad + DAYS) / 7);

  return (
    <View>
      {/* Month labels */}
      <View className="mb-1 flex-row" style={{ paddingLeft: 28 }}>
        {monthLabels.map(({ label, col }) => (
          <View key={label} style={{ position: 'absolute', left: 28 + col * (cellSize + gap) }}>
            <Text variant="caption2" color="muted">{label}</Text>
          </View>
        ))}
        <View style={{ height: 14 }} />
      </View>

      <View className="flex-row gap-0.5">
        {/* Day labels */}
        <View style={{ width: 24, gap }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <View key={i} style={{ height: cellSize, justifyContent: 'center' }}>
              {i % 2 === 1 && (
                <Text variant="caption2" color="muted" style={{ fontSize: 8 }}>{d}</Text>
              )}
            </View>
          ))}
        </View>

        {/* Grid */}
        <View style={{ flexDirection: 'row', gap }}>
          {Array.from({ length: totalCols }).map((_, col) => (
            <View key={col} style={{ flexDirection: 'column', gap }}>
              {Array.from({ length: 7 }).map((_, row) => {
                const idx = col * 7 + row - startPad;
                const cell = idx >= 0 && idx < cells.length ? cells[idx] : null;
                return (
                  <View
                    key={row}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      borderRadius: 3,
                      backgroundColor: cell
                        ? getColor(cell.logged, cell.calories, isDark)
                        : 'transparent',
                    }}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </View>

      {/* Legend */}
      <View className="mt-3 flex-row items-center justify-between">
        <Text variant="caption2" color="muted">
          {totalLogged} days logged in last {WEEKS} weeks
        </Text>
        <View className="flex-row items-center gap-1">
          <Text variant="caption2" color="muted">Less</Text>
          {[false, true, true, true, true].map((logged, i) => (
            <View
              key={i}
              style={{
                width: 10, height: 10, borderRadius: 2,
                backgroundColor: getColor(logged, [0, 400, 1000, 1600, 2200][i], isDark),
              }}
            />
          ))}
          <Text variant="caption2" color="muted">More</Text>
        </View>
      </View>
    </View>
  );
}
