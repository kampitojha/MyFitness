import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, ChartLine, History, UserRound, ScanLine } from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';
import { PressableScale } from '@/components/ui/pressable-scale';

type TabKey = 'index' | 'progress' | 'scan' | 'history' | 'profile';

const TAB_ICONS: Record<TabKey, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  index: Home,
  progress: ChartLine,
  scan: ScanLine,
  history: History,
  profile: UserRound,
};

const TAB_LABELS: Record<TabKey, string> = {
  index: 'Home',
  progress: 'Progress',
  scan: 'Scan',
  history: 'History',
  profile: 'Profile',
};

export interface TabBarRouteInfo {
  key: string;
  name: string;
}

/**
 * Minimal structural type accepted by expo-router's Tabs `tabBar` render
 * prop. Kept loose to avoid react-navigation major-version type drift.
 */
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

  return (
    <View
      pointerEvents="box-none"
      className="absolute inset-x-0 bottom-0 z-50"
      style={{ paddingBottom: insets.bottom + (Platform.OS === 'android' ? 8 : 0) }}
    >
      <View
        className="mx-5 mb-2 flex-row items-center justify-between rounded-full border border-black/5 bg-surface/90 px-2 py-1 shadow-lg shadow-black/10 backdrop-blur-md dark:border-white/5 dark:bg-[#1A1A1C]/90"
      >
        {routes.map((route, index) => {
          const key = route.name as TabKey;
          const isFocused = state.routes[state.index]?.name === route.name;
          const isScan = key === 'scan';
          const Icon = TAB_ICONS[key];

          if (isScan) {
            return (
              <View key={route.key} className="flex-1 items-center">
                <PressableScale
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isFocused }}
                  accessibilityLabel="Scan a meal"
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
                >
                  <View className="-mt-7 h-14 w-14 items-center justify-center rounded-full bg-primary-600 shadow-xl shadow-primary-500/30 dark:bg-primary-500">
                    <Icon size={26} color="#FFFFFF" strokeWidth={2.2} />
                  </View>
                </PressableScale>
              </View>
            );
          }

          return (
            <View key={route.key} className="flex-1 items-center justify-center">
              <PressableScale
                accessibilityRole="tab"
                accessibilityState={{ selected: isFocused }}
                accessibilityLabel={TAB_LABELS[key]}
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
                className="items-center justify-center p-2"
                style={{ height: 56, width: 56 }}
              >
                <Icon
                  size={isFocused ? 23 : 22}
                  color={isFocused ? colors.primary : colors.textMuted}
                  strokeWidth={isFocused ? 2.4 : 2}
                />
              </PressableScale>
            </View>
          );
        })}
      </View>
    </View>
  );
}