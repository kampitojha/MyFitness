import { ScrollView, View, type ScrollViewProps, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { cn } from '@/utils/cn';

export interface ScreenProps extends ScrollViewProps {
  children: React.ReactNode;
  edges?: Edge[];
  scroll?: boolean;
  contentClassName?: string;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Standard screen container handling safe areas, status bar and
 * horizontal content padding.
 */
export function Screen({
  children,
  edges = ['top'],
  scroll = true,
  contentClassName,
  padded = true,
  className,
  style,
  ...scrollProps
}: ScreenProps) {
  const content = (
    <View className={cn(padded && 'px-5', contentClassName)}>{children}</View>
  );

  return (
    <SafeAreaView edges={edges} style={[{ flex: 1 }, style]} className={cn('bg-background dark:bg-background-dark', className)}>
      <StatusBar style="auto" />
      {scroll ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          {...scrollProps}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}