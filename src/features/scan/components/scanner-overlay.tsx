import { View } from 'react-native';
import { MotiView } from 'moti';
import { useTheme } from '@/hooks/use-theme';

export interface ScannerOverlayProps {
  scanning?: boolean;
  showFrame?: boolean;
}

/**
 * Overlay drawn over a captured image: an etiquette frame when framing,
 * and a sweeping scan line while processing.
 */
export function ScannerOverlay({ scanning, showFrame = true }: ScannerOverlayProps) {
  const { colors } = useTheme();

  return (
    <View pointerEvents="none" className="absolute inset-0">
      {showFrame && !scanning ? (
        <View className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2">
          {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
            <View key={corner} className={`${CORNER_CLASS[corner as Corner]} border-4 border-white/90 rounded-lg`} />
          ))}
        </View>
      ) : null}

      {scanning ? (
        <MotiView
          from={{ translateY: -220, opacity: 0 }}
          animate={{ translateY: 220, opacity: [0, 1, 1, 0] }}
          transition={{ type: 'timing', duration: 1400, loop: true, repeatReverse: true }}
          className="absolute left-0 right-0 top-1/2 mx-10 h-0.5 rounded-full"
          style={{ backgroundColor: colors.accent }}
        >
          <View style={{ backgroundColor: colors.accent }} className="h-0.5 w-16 rounded-full" />
        </MotiView>
      ) : null}
    </View>
  );
}

type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const CORNER_CLASS: Record<Corner, string> = {
  'top-left': 'absolute left-0 top-0 h-10 w-10 border-b-0 border-r-0',
  'top-right': 'absolute right-0 top-0 h-10 w-10 border-b-0 border-l-0',
  'bottom-left': 'absolute left-0 bottom-0 h-10 w-10 border-t-0 border-r-0',
  'bottom-right': 'absolute right-0 bottom-0 h-10 w-10 border-t-0 border-l-0',
};