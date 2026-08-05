import { Platform } from 'react-native';
import { useEffect, useState } from 'react';

export interface StepData {
  steps: number;
  distance: number; // meters
  supported: boolean;
}

/**
 * Live step counter using expo-sensors Pedometer.
 * Falls back gracefully on web or unsupported devices.
 */
export function useStepCounter(): StepData {
  const [steps, setSteps] = useState(0);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    let subscription: { remove(): void } | null = null;

    (async () => {
      try {
        const { Pedometer } = await import('expo-sensors');
        const available = await Pedometer.isAvailableAsync();
        setSupported(available);
        if (!available) return;

        const start = new Date();
        start.setHours(0, 0, 0, 0); // midnight of today
        const end = new Date();

        const { steps: todaySteps } = await Pedometer.getStepCountAsync(start, end);
        setSteps(todaySteps);

        subscription = Pedometer.watchStepCount((result) => {
          setSteps((prev) => prev + result.steps);
        });
      } catch {
        setSupported(false);
      }
    })();

    return () => {
      subscription?.remove();
    };
  }, []);

  // Average stride = 0.78m, adjust per user height later
  const distance = Math.round(steps * 0.78);

  return { steps, distance, supported };
}

export const STEP_GOAL = 10000;
export const STEP_COLORS = { low: '#F97316', mid: '#FBBF24', high: '#0284C7' };
