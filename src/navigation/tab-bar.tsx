import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, ChartLine, History, UserRound, Camera } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/use-theme';
import { PressableScale } from '@/components/ui/pressable-scale';

type TabKey = 'index' | 'progress' | 'scan' | 'history' | 'profile';

const TAB_ICONS: Record<TabKey, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  index: Home,
  progress: ChartLine,
  scan: Camera,
  history: History,
  profile: UserRound,
};

const TAB_LABELS: Record<TabKey, string> = {
  index: 'Home',
  progress: 'Progress',
  scan: 'Scan AI',
  history: 'History',
  profile: 'Profile',
};

export interface TabBarRouteInfo {
  key: string;
  name: string;
}

export interface TabBarProps {
  state: { index: number; routes: TabBarRouteInfo[] };
  navigation: {
    emit: (event: { type: 'tabPress'; target: string; canPreventDefault: true }) => {
      defaultPrevented: boolean;
    };
    navigate: (name: string) => void;
  };
}

function isTabKey(name: string): name is TabKey {
  return name in TAB_ICONS;
}

export function TabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const routes = state.routes.filter((route) => isTabKey(route.name));

  const bottomInset = Math.max(insets.bottom, Platform.OS === 'android' ? 12 : 8);

  return (
    <View
      pointerEvents="box-none"
      className="absolute inset-x-0 bottom-0 z-50 px-4"
      style={{ paddingBottom: bottomInset }}
    >
      <View
        className="flex-row items-center justify-around rounded-3xl border border-border/80 bg-surface/95 px-2 py-1.5 shadow-2xl backdrop-blur-xl dark:border-neutral-800/90 dark:bg-neutral-900/95"
      >
        {routes.map((route) => {
          const key = route.name as TabKey;
          const isFocused = state.routes[state.index]?.name === route.name;
          const isScan = key === 'scan';
          const Icon = TAB_ICONS[key];
          const label = TAB_LABELS[key];

          if (isScan) {
            return (
              <View key={route.key} className="items-center justify-center px-1">
                <PressableScale
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isFocused }}
                  accessibilityLabel="Scan AI Food"
                  onPress={() => {
                    const event = navigation.emit({
                      type: 'tabPress',
                      target: route.key,
                      canPreventDefault: true,
                    });
                    if (!isFocused && !event.defaultPrevented) {
                      navigation.navigate(route.name);
                    }
                  }}
                  className="-mt-7 h-14 w-14 items-center justify-center rounded-full bg-primary-600 shadow-xl shadow-primary-600/40 ring-4 ring-surface dark:bg-sky-500 dark:shadow-sky-500/30 dark:ring-neutral-900"
                >
                  <Icon size={24} color="#FFFFFF" strokeWidth={2.4} />
                </PressableScale>
                <Text
                  variant="caption2"
                  className="mt-1 text-[10px] font-semibold text-primary-600 dark:text-sky-400"
                >
                  {label}
                </Text>
              </View>
            );
          }

          return (
            <PressableScale
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={label}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              className="flex-1 items-center justify-center py-1.5"
            >
              <View
                className={`items-center justify-center rounded-2xl px-3 py-1 ${
                  isFocused ? 'bg-primary-500/10 dark:bg-sky-500/20' : 'bg-transparent'
                }`}
              >
                <Icon
                  size={20}
                  color={isFocused ? colors.primary : colors.textMuted}
                  strokeWidth={isFocused ? 2.5 : 1.8}
                />
                <Text
                  variant="caption2"
                  className={`mt-0.5 text-[10px] ${
                    isFocused
                      ? 'font-bold text-primary-600 dark:text-sky-400'
                      : 'font-normal text-text-muted dark:text-neutral-400'
                  }`}
                >
                  {label}
                </Text>
              </View>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}