import { forwardRef } from 'react';
import { Pressable, type PressableProps, type View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { springs } from '@/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface PressableScaleProps extends PressableProps {
  scaleTo?: number;
  children?: React.ReactNode;
}

/**
 * Base pressable with a tactile spring scale. All tappable components
 * in the app should compose on top of this for consistent feedback.
 */
export const PressableScale = forwardRef<View, PressableScaleProps>(
  ({ scaleTo = 0.97, onPressIn, onPressOut, children, style, ...props }, ref) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    return (
      <AnimatedPressable
        ref={ref}
        accessibilityRole={props.accessibilityRole ?? 'button'}
        onPressIn={(e) => {
          scale.value = withSpring(scaleTo, springs.snappy);
          onPressIn?.(e);
        }}
        onPressOut={(e) => {
          scale.value = withSpring(1, springs.snappy);
          onPressOut?.(e);
        }}
        style={[animatedStyle, style]}
        {...props}
      >
        {children}
      </AnimatedPressable>
    );
  },
);

PressableScale.displayName = 'PressableScale';