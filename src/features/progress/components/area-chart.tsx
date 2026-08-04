import { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Line, Text as SvgText } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import { durations, easings } from '@/theme';
import { useTheme } from '@/hooks/use-theme';
import type { TrendDatum } from '@/hooks/use-trends';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export interface AreaChartProps {
  data: TrendDatum[];
  width: number;
  height: number;
  valueKey: keyof Pick<TrendDatum, 'calories' | 'protein' | 'waterMl' | 'weightKg'>;
  color: string;
  strokeWidth?: number;
  showLabels?: boolean;
  valueLabel?: (value: number) => string;
}

/**
 * Smooth line/area chart with an animated reveal stroke.
 */
export function AreaChart({
  data,
  width,
  height,
  valueKey,
  color,
  strokeWidth = 3,
  showLabels = true,
  valueLabel,
}: AreaChartProps) {
  const { colors } = useTheme();
  const padX = 8;
  const padY = 12;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;
  const progress = useSharedValue(0);

  const values = data.map((d) => d[valueKey] ?? 0);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const rangeVal = max - min || 1;

  const points = data.map((d, i) => {
    const x = padX + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
    const v = (d[valueKey] ?? 0);
    const y = padY + innerH - ((v - min) / rangeVal) * innerH;
    return { x, y };
  });

  const linePath = points.length
    ? points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    : '';
  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x} ${height - padY} L ${points[0].x} ${height - padY} Z`
    : '';

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, { duration: durations.medium, easing: easings.standard });
  }, [linePath, progress]);

  const lineProps = useAnimatedProps(() => ({
    strokeDashoffset: 1100 * (1 - progress.value),
  }));

  if (!points.length) {
    return (
      <View style={{ width, height }} className="items-center justify-center">
        <SvgText fill={colors.textMuted} fontSize={12}>No data yet</SvgText>
      </View>
    );
  }

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity={0.28} />
          <Stop offset="1" stopColor={color} stopOpacity={0.02} />
        </LinearGradient>
      </Defs>

      <Path d={areaPath} fill="url(#areaFill)" />

      <AnimatedPath
        d={linePath}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={1100}
        animatedProps={lineProps}
      />

      {showLabels &&
        [0, Math.floor(points.length / 2), points.length - 1].filter((i, idx, arr) => arr.indexOf(i) === idx).map((i) => (
          <Line
            key={`gl-${i}`}
            x1={points[i].x}
            y1={padY}
            x2={points[i].x}
            y2={height - padY}
            stroke={colors.border}
            strokeWidth={1}
            strokeDasharray="4 4"
            opacity={0.7}
          />
        ))}

      {showLabels &&
        points.map((p, i) =>
          p.y > padY && p.y < height - padY ? (
            <SvgText
              key={`label-${i}`}
              x={p.x}
              y={p.y - 8}
              fontSize="10"
              fill={colors.textSecondary}
              textAnchor="middle"
            >
              {valueLabel ? valueLabel(data[i][valueKey] ?? 0) : Math.round(data[i][valueKey] ?? 0)}
            </SvgText>
          ) : null,
        )}
    </Svg>
  );
}