import { useEffect, useRef, useState } from 'react';
import { Text, type TextProps } from 'react-native';
import { durations } from '@/theme';

export interface AnimatedNumberProps extends TextProps {
  value: number;
  duration?: number;
  format?: (value: number) => string;
  children?: React.ReactNode;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Counts from 0 to `value` with an ease-out curve. Formats via `format`
 * (defaults to a plain integer).
 */
export function AnimatedNumber({
  value,
  duration = durations.medium,
  format = (v) => Math.round(v).toLocaleString(),
  children,
  ...props
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number | null>(null);
  const fromRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    const delta = value - from;
    if (delta === 0) return;

    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const current = from + delta * easeOutCubic(t);
      fromRef.current = current;
      setDisplay(current);
      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = value;
        setDisplay(value);
      }
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
     
  }, [value, duration]);

  return (
    <Text {...props}>
      {children}
      {format(display)}
    </Text>
  );
}