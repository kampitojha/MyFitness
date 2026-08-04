import { create } from 'zustand';
import type { DetectedFood } from '@/types/food';
import type { MealType } from '@/types/meals';

export type ScanPhase = 'idle' | 'capturing' | 'processing' | 'review' | 'saving' | 'error';

interface ScanState {
  phase: ScanPhase;
  imageUri: string | null;
  detectedFoods: DetectedFood[];
  selectedMealType: MealType;
  error: string | null;
  setPhase: (phase: ScanPhase) => void;
  setImage: (uri: string | null) => void;
  setDetectedFoods: (foods: DetectedFood[]) => void;
  updateFood: (id: string, patch: Partial<DetectedFood>) => void;
  removeFood: (id: string) => void;
  setMealType: (type: MealType) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useScanStore = create<ScanState>((set) => ({
  phase: 'idle',
  imageUri: null,
  detectedFoods: [],
  selectedMealType: 'breakfast',
  error: null,
  setPhase: (phase) => set({ phase }),
  setImage: (imageUri) => set({ imageUri }),
  setDetectedFoods: (detectedFoods) => set({ detectedFoods }),
  updateFood: (id, patch) =>
    set((state) => ({
      detectedFoods: state.detectedFoods.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    })),
  removeFood: (id) =>
    set((state) => ({
      detectedFoods: state.detectedFoods.filter((f) => f.id !== id),
    })),
  setMealType: (selectedMealType) => set({ selectedMealType }),
  setError: (error) => set({ error }),
  reset: () =>
    set({ phase: 'idle', imageUri: null, detectedFoods: [], selectedMealType: 'breakfast', error: null }),
}));