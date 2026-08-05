import { useCallback, useRef, useState } from 'react';
import { Image, View, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ImagePlus, RotateCcw, ScanLine, Check, Camera, Sparkles, X, Flashlight } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Button, IconButton } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Screen } from '@/components/ui/screen';
import { ScannerOverlay } from '@/features/scan/components/scanner-overlay';
import { DetectedFoodCard } from '@/features/scan/components/detected-food-card';
import { useScanStore } from '@/store/scan.store';
import { useSettingsStore } from '@/store/settings.store';
import { analyzeFoodImage } from '@/services/scan.service';
import { useSaveMeal } from '@/hooks/use-meals';
import { MEAL_TYPES, MEAL_TYPE_LABELS, sumScaledMacros } from '@/types/meals';
import { useTheme } from '@/hooks/use-theme';
import { formatNumber } from '@/utils/number';
import { cn } from '@/utils/cn';

// Sample high-quality food image URLs for instant demo testing
const DEMO_PRESETS = [
  { id: '1', label: '🥗 Fitness Salad', uri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800' },
  { id: '2', label: '🍳 Protein Eggs', uri: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800' },
  { id: '3', label: '🍛 Indian Thali', uri: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?q=80&w=800' },
  { id: '4', label: '🍗 Chicken Rice', uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800' },
];

export default function ScanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const camRef = useRef<CameraView>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [saving, setSaving] = useState(false);

  const phase = useScanStore((s) => s.phase);
  const imageUri = useScanStore((s) => s.imageUri);
  const detectedFoods = useScanStore((s) => s.detectedFoods);
  const selectedMealType = useScanStore((s) => s.selectedMealType);
  const { setPhase, setImage, setDetectedFoods, updateFood, removeFood, setMealType, reset } = useScanStore();
  const hapticsEnabled = useSettingsStore((s) => s.hapticsEnabled);

  const saveMeal = useSaveMeal();

  const treatHaptic = useCallback(() => {
    if (hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
  }, [hapticsEnabled]);

  const onCapture = useCallback(async () => {
    treatHaptic();

    // Direct Expo CameraView capture
    if (camRef.current) {
      try {
        const result = await camRef.current.takePictureAsync({ quality: 0.85, base64: false });
        if (result?.uri) {
          setImage(result.uri);
          setPhase('capturing');
          return;
        }
      } catch {
        // Fallback to ImagePicker Camera launch
      }
    }

    // Camera launch fallback via ImagePicker
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.85,
      });
      if (!result.canceled && result.assets[0]?.uri) {
        setImage(result.assets[0].uri);
        setPhase('capturing');
      }
    } catch {
      // Fallback demo preset if camera device unavailable
      setImage(DEMO_PRESETS[0].uri);
      setPhase('capturing');
    }
  }, [camRef, setImage, setPhase, treatHaptic]);

  const pickFromGallery = useCallback(async () => {
    treatHaptic();
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.85,
      });
      if (!result.canceled && result.assets[0]?.uri) {
        setImage(result.assets[0].uri);
        setPhase('capturing');
      }
    } catch {
      setImage(DEMO_PRESETS[0].uri);
      setPhase('capturing');
    }
  }, [setImage, setPhase, treatHaptic]);

  const selectDemoPreset = useCallback((uri: string) => {
    treatHaptic();
    setImage(uri);
    setPhase('capturing');
  }, [setImage, setPhase, treatHaptic]);

  const onAnalyze = useCallback(async () => {
    if (!imageUri) return;
    setPhase('processing');
    try {
      const result = await analyzeFoodImage({ uri: imageUri });
      setDetectedFoods(result.foods);
      setPhase('review');
    } catch {
      setPhase('idle');
      setImage(null);
    }
  }, [imageUri, setPhase, setDetectedFoods, setImage]);

  const onSave = useCallback(async () => {
    if (detectedFoods.length === 0 || !imageUri) return;
    setSaving(true);
    try {
      const draft = {
        type: selectedMealType,
        name: detectedFoods[0]?.name ?? 'Scanned meal',
        items: detectedFoods,
        imageUri,
      };
      await saveMeal.mutateAsync({ draft });
      setSaving(false);
      reset();
      router.replace('/(tabs)');
    } catch {
      setSaving(false);
      setPhase('review');
    }
  }, [detectedFoods, imageUri, selectedMealType, saveMeal, reset, router, setPhase]);

  const total = sumScaledMacros(detectedFoods);

  return (
    <View className="flex-1 bg-black">
      {/* SCANNING & CAMERA VIEW */}
      {(phase === 'idle' || phase === 'capturing' || phase === 'processing') && (
        <View className="flex-1">
          {imageUri && phase !== 'idle' ? (
            <View className="flex-1 bg-black">
              <Image source={{ uri: imageUri }} resizeMode="cover" className="h-full w-full" />
              <ScannerOverlay scanning={phase === 'processing'} showFrame={phase === 'capturing'} />
            </View>
          ) : (
            <View className="flex-1 bg-neutral-950">
              {permission?.granted ? (
                <CameraView
                  ref={camRef}
                  facing={facing}
                  className="flex-1"
                />
              ) : (
                <View className="flex-1 items-center justify-center px-8 bg-neutral-900">
                  <View className="h-20 w-20 items-center justify-center rounded-3xl bg-primary-500/20 mb-4 border border-primary-500/30">
                    <Camera size={36} color="#10B981" />
                  </View>
                  <Text variant="title2" weight="bold" className="text-white text-center mb-2">
                    AI Food Vision Camera
                  </Text>
                  <Text variant="caption" className="text-neutral-400 text-center mb-6">
                    Allow camera access to capture meals directly, or select a photo from your gallery.
                  </Text>
                  <PressableScale
                    onPress={() => requestPermission()}
                    className="px-6 py-3.5 rounded-full bg-primary-600 dark:bg-emerald-500 shadow-lg shadow-emerald-500/30"
                  >
                    <Text variant="subhead" weight="bold" className="text-white">
                      Grant Camera Permission
                    </Text>
                  </PressableScale>
                </View>
              )}
              <ScannerOverlay showFrame={phase === 'idle'} />
            </View>
          )}

          {/* Aesthetic Top Navigation Bar */}
          <View
            className="absolute top-0 left-0 right-0 z-30 flex-row items-center justify-between px-5"
            style={{ paddingTop: insets.top + 8 }}
          >
            <IconButton
              variant="surface"
              label="Close scanner"
              onPress={() => {
                reset();
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace('/(tabs)');
                }
              }}
              className="h-10 w-10 bg-black/40 border border-white/20 backdrop-blur-md"
              icon={<X size={20} color="#FFFFFF" />}
            />

            <View className="flex-row items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 border border-white/20 backdrop-blur-md">
              <Sparkles size={16} color="#10B981" />
              <Text variant="subhead" weight="bold" className="text-white">
                Scan AI Vision
              </Text>
            </View>

            <IconButton
              variant="surface"
              label="Flip camera"
              onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
              className="h-10 w-10 bg-black/40 border border-white/20 backdrop-blur-md"
              icon={<RotateCcw size={18} color="#FFFFFF" />}
            />
          </View>

          {/* Preset Demo Food Selector Bar */}
          {phase === 'idle' && (
            <View className="absolute left-0 right-0 z-20" style={{ bottom: insets.bottom + 110 }}>
              <Text variant="caption2" className="text-center text-white/80 font-medium mb-2">
                ⚡ Try Demo Food Scan
              </Text>
              <View className="flex-row justify-center gap-2 px-4 flex-wrap">
                {DEMO_PRESETS.map((preset) => (
                  <PressableScale
                    key={preset.id}
                    onPress={() => selectDemoPreset(preset.uri)}
                    className="px-3 py-1.5 rounded-full bg-black/60 border border-white/30 backdrop-blur-md"
                  >
                    <Text variant="caption2" weight="semibold" className="text-white">
                      {preset.label}
                    </Text>
                  </PressableScale>
                ))}
              </View>
            </View>
          )}

          {/* Bottom Capture Controls Dashboard */}
          {phase === 'idle' ? (
            <View
              className="absolute bottom-0 left-0 right-0 z-30 items-center bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-6"
              style={{ paddingBottom: insets.bottom + 16 }}
            >
              <View className="flex-row items-center justify-around w-full px-8">
                {/* Gallery Button */}
                <PressableScale
                  onPress={pickFromGallery}
                  className="items-center justify-center h-12 w-12 rounded-full bg-neutral-900/90 border border-white/30 shadow-lg"
                >
                  <ImagePlus size={22} color="#FFFFFF" />
                </PressableScale>

                {/* Main Glowing Shutter Capture Button */}
                <PressableScale
                  onPress={onCapture}
                  accessibilityRole="button"
                  accessibilityLabel="Click Photo"
                  className="h-20 w-20 items-center justify-center rounded-full bg-primary-500/20 border-4 border-white shadow-2xl ring-4 ring-emerald-500/40"
                >
                  <View className="h-16 w-16 rounded-full bg-white items-center justify-center shadow-inner">
                    <Camera size={26} color="#0E7A4A" />
                  </View>
                </PressableScale>

                {/* Camera Flip Button */}
                <PressableScale
                  onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
                  className="items-center justify-center h-12 w-12 rounded-full bg-neutral-900/90 border border-white/30 shadow-lg"
                >
                  <RotateCcw size={20} color="#FFFFFF" />
                </PressableScale>
              </View>
            </View>
          ) : phase === 'capturing' ? (
            <View
              className="absolute bottom-0 left-0 right-0 z-30 flex-row items-center justify-center gap-3 px-6 bg-black/80 py-5 backdrop-blur-lg"
              style={{ paddingBottom: insets.bottom + 16 }}
            >
              <Button
                label="Retake Photo"
                variant="secondary"
                onPress={() => { setImage(null); setPhase('idle'); }}
                className="flex-1 border border-white/20 bg-neutral-800"
              />
              <Button
                label="Analyze Food AI"
                variant="primary"
                onPress={onAnalyze}
                icon={<ScanLine size={18} color="#FFFFFF" />}
                className="flex-[2] bg-primary-600 dark:bg-emerald-500"
              />
            </View>
          ) : phase === 'processing' ? (
            <View className="absolute bottom-0 left-0 right-0 z-30 items-center pb-12 bg-black/80 pt-6 backdrop-blur-lg">
              <MotiPulse />
              <Text variant="headline" weight="bold" className="text-white">
                Analyzing Meal with AI…
              </Text>
              <Text variant="caption" color="muted" className="text-white/70 mt-1">
                Detecting food items, weight portions & macros
              </Text>
            </View>
          ) : null}
        </View>
      )}

      {/* CONFIRM / REVIEW MEAL MACROS */}
      {phase === 'review' && (
        <Screen edges={['top']} contentContainerStyle={{ paddingBottom: 120 }}>
          <View className="mb-4 mt-2">
            <Text variant="title1" className="text-ink dark:text-neutral-50 font-bold">
              Confirm Scanned Meal
            </Text>
            <Text variant="bodySmall" color="secondary">
              {detectedFoods.length} item{detectedFoods.length === 1 ? '' : 's'} identified by AI
            </Text>
          </View>

          <View className="mb-4 flex-row flex-wrap gap-2">
            {MEAL_TYPES.map((type) => (
              <Chip
                key={type}
                label={MEAL_TYPE_LABELS[type]}
                selected={selectedMealType === type}
                onPress={() => setMealType(type)}
              />
            ))}
          </View>

          <View className={cn('gap-3', imageUri ? 'mb-4' : '')}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} className="h-44 w-full rounded-[24px] border border-border/80" resizeMode="cover" />
            ) : null}
            {detectedFoods.map((food) => (
              <DetectedFoodCard
                key={food.id}
                food={food}
                onUpdateQuantity={(q) => updateFood(food.id, { quantity: q })}
                onRemove={() => removeFood(food.id)}
              />
            ))}
          </View>

          <View className="mt-4 flex-row items-center justify-between rounded-2xl bg-primary-soft px-4 py-3.5 dark:bg-emerald-900/80 border border-primary-500/20">
            <Text variant="subhead" weight="bold" className="text-primary-softText dark:text-emerald-200">
              Total Macros
            </Text>
            <Text variant="subhead" weight="bold" className="text-primary-softText dark:text-emerald-200">
              {formatNumber(total.calories)} kcal · P {formatNumber(total.protein)}g · C {formatNumber(total.carbs)}g · F {formatNumber(total.fat)}g
            </Text>
          </View>

          <Button
            label="Save Meal to Log"
            onPress={onSave}
            size="lg"
            fullWidth
            className="mt-5 bg-primary-600 dark:bg-emerald-500"
            loading={saving}
            icon={<Check size={18} color="#FFFFFF" />}
            disabled={detectedFoods.length === 0}
          />
        </Screen>
      )}
    </View>
  );
}

function MotiPulse() {
  return (
    <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40">
      <View className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-400/30 border-t-emerald-400" />
    </View>
  );
}