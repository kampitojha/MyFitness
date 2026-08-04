import { useEffect } from 'react';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';
import { durations, easings } from '@/theme';
import { useTheme } from '@/hooks/use-theme';
import type { TrendDatum } from '@/hooks/use-trends';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export interface BarChartProps {
  data: TrendDatum[];
  width: number;
  height: number;
  color: string;
  goal?: number;
  valueKey: keyof Pick<TrendDatum, 'calories' | 'protein' | 'waterMl'>;
}

export function BarChart({ data, width, height, color, goal, valueKey }: BarChartProps) {
  const { colors } = useTheme();
  const barW = Math.min(26, (width / data.length) * 0.6);
  const max = Math.max(...data.map((d) => d[valueKey] ?? 0), goal ?? 1, 1);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, { duration: durations.medium, easing: easings.standard });
  }, [data, valueKey, progress]);

  const maxHeight = height - 26;

  return (
    <Svg width={width} height={height}>
      {goal ? (
        <SvgText x={width - 4} y={8} fontSize="9" fill={colors.textMuted} textAnchor="end">
          goal {goal}
        </SvgText>
      ) : null}
      {data.map((d, i) => {
        const value = d[valueKey] ?? 0;
        const barH = (value / max) * maxHeight;
        const x = (width / data.length) * i + (width / data.length - barW) / 2;
        const y = height - 24 - barH;
        return <AnimatedBar key={d.date} x={x} y={y} height={barH} width={barW} color={color} progress={progress} />;
      })}
      {data.map((d, i) => {
        const cx = (width / data.length) * i + width / data.length / 2;
        return (
          <SvgText key={`l-${d.date}`} x={cx} y={height - 8} fontSize="9" fill={colors.textMuted} textAnchor="middle">
            {d.label.split(' ')[0]}
          </SvgText>
        );
      })}
    </Svg>
  );
}

function AnimatedBar({
  x, y, width, height, color, progress,
}: { x: number; y: number; width: number; height: number; color: string; progress: SharedValue<number> }) {
  const props = useAnimatedProps(() => ({
    height: Math.max(0, height * progress.value),
    y: y + height * (1 - progress.value),
  }));
  if (height < 1) return null;
  return <AnimatedRect x={x} y={y} width={width} rx={6} fill={color} animatedProps={props} />;
}