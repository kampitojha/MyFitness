import { ScrollView, View, type ScrollViewProps } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { cn } from '@/utils/cn';

export interface ScreenProps extends ScrollViewProps {
  children: React.ReactNode;
  edges?: Edge[];
  scroll?: boolean;
  contentClassName?: string;
  padded?: boolean;
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
  ...scrollProps
}: ScreenProps) {
  const content = (
    <View className={cn(padded && 'px-5', contentClassName)}>{children}</View>
  );

  return (
    <SafeAreaView edges={edges} className={cn('flex-1 bg-background dark:bg-background-dark', className)}>
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