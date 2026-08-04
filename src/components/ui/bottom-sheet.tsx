import { useEffect, type ReactNode } from 'react';
import { Dimensions, Modal, Pressable, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { springs } from '@/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  snapTo?: number;
  dismissable?: boolean;
}

export function BottomSheet({ visible, onClose, title, children, snapTo = 0.6, dismissable = true }: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const maxHeight = Math.min(SCREEN_HEIGHT - insets.top - 24, Math.round(SCREEN_HEIGHT * Math.max(snapTo, 0.7)));

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { ...springs.snappy, overshootClamping: true });
    } else {
      translateY.value = withSpring(SCREEN_HEIGHT, springs.snappy);
    }
  }, [visible, translateY]);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      // eslint-disable-next-line react-hooks/immutability
      if (e.translationY > 0) translateY.value = e.translationY;
    })
    .onEnd((e) => {
      if (e.translationY > 100 || e.velocityY > 800) {
        // eslint-disable-next-line react-hooks/immutability
        translateY.value = withSpring(SCREEN_HEIGHT, springs.snappy);
        setTimeout(onClose, 120);
      } else {
        // eslint-disable-next-line react-hooks/immutability
        translateY.value = withSpring(0, springs.snappy);
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    maxHeight,
    transform: [{ translateY: translateY.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [0, SCREEN_HEIGHT], [1, 0]),
  }));

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Animated.View
            style={[overlayStyle, { position: 'absolute', inset: 0 }]}
            className="bg-black/50"
          >
            {dismissable ? (
              <Pressable
                style={{ flex: 1 }}
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Close sheet"
              />
            ) : null}
          </Animated.View>

          <GestureDetector gesture={pan}>
            <Animated.View
              style={[
                sheetStyle,
                { paddingBottom: insets.bottom + 20 },
              ]}
              className="bottom-0 left-0 right-0 rounded-t-[28px] bg-surface shadow-2xl dark:bg-neutral-900"
            >
              <View className="items-center pt-3 pb-2">
                <View className="h-1.5 w-10 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              </View>

              {title ? (
                <View className="px-6 pb-3">
                  <Animated.Text className="font-display text-[20px] font-semibold text-ink dark:text-neutral-100">
                    {title}
                  </Animated.Text>
                </View>
              ) : null}

              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 12 }}
              >
                {children}
              </ScrollView>
            </Animated.View>
          </GestureDetector>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}