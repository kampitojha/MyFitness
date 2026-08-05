import { useCallback, useRef, useState } from 'react';
import { Image, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ImagePlus, RotateCcw, ScanLine, Check } from 'lucide-react-native';

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
    if (!camRef.current) return;
    treatHaptic();
    const result = await camRef.current.takePictureAsync({ quality: 0.8, base64: false });
    if (result?.uri) {
      setImage(result.uri);
      setPhase('capturing');
    }
  }, [camRef, setImage, setPhase, treatHaptic]);

  const pickFromGallery = useCallback(async () => {
    treatHaptic();
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      setImage(result.assets[0].uri);
      setPhase('capturing');
    }
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
      router.replace('/');
    } catch {
      setSaving(false);
      setPhase('review');
    }
  }, [detectedFoods, imageUri, selectedMealType, saveMeal, reset, router, setPhase]);

  const total = sumScaledMacros(detectedFoods);

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      {/* CAMERA / CAPTURE PREVIEW / PROCESSING */}
      {(phase === 'idle' || phase === 'capturing' || phase === 'processing') && (
        <View className="flex-1" style={{ paddingTop: insets.top }}>
          {imageUri && phase !== 'idle' ? (
            <View className="flex-1 bg-black">
              <Image source={{ uri: imageUri }} resizeMode="cover" className="h-full w-full" />
              <ScannerOverlay scanning={phase === 'processing'} showFrame={phase === 'capturing'} />
            </View>
          ) : (
            <View className="flex-1 bg-black">
              <CameraView
                ref={camRef}
                facing={facing}
                className="flex-1"
              />
              <ScannerOverlay showFrame />
            </View>
          )}

          {/* Top bar */}
          <View className="absolute top-0 left-0 right-0 flex-row items-center justify-between px-5" style={{ paddingTop: insets.top + 8 }}>
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
              icon={<Text className="text-ink text-lg leading-none dark:text-white">×</Text>}
            />
            <Text variant="headline" weight="semibold" className="text-white">
              Scan meal
            </Text>
            <View className="w-11" />
          </View>

          {/* Bottom controls */}
          {phase === 'idle' ? (
            <View className="absolute bottom-0 left-0 right-0 items-center" style={{ paddingBottom: insets.bottom + 16 }}>
              <View className="flex-row items-center justify-center gap-10">
                <IconButton
                  variant="surface"
                  label="Choose from gallery"
                  onPress={() => {
                    if (!permission?.granted) requestPermission();
                    pickFromGallery();
                  }}
                  icon={<ImagePlus size={24} color={colors.text} />}
                />
                <View className="rounded-full border-4 border-white p-1">
                  <PressableScale
                    onPress={onCapture}
                    accessibilityRole="button"
                    accessibilityLabel="Take photo"
                    className="h-16 w-16 rounded-full bg-white"
                  />
                </View>
                <IconButton
                  variant="surface"
                  label="Flip camera"
                  onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
                  icon={<RotateCcw size={22} color={colors.text} />}
                />
              </View>
              {!permission?.granted ? (
                <PressableScale onPress={() => requestPermission()} className="mt-4">
                  <Text variant="footnote" weight="semibold" color="onPrimary">
                    Grant camera access
                  </Text>
                </PressableScale>
              ) : null}
            </View>
          ) : phase === 'capturing' ? (
            <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-center gap-3 px-6" style={{ paddingBottom: insets.bottom + 20 }}>
              <Button label="Retake" variant="secondary" onPress={() => { setImage(null); setPhase('idle'); }} className="flex-1" />
              <Button label="Analyze" variant="primary" onPress={onAnalyze} icon={<ScanLine size={18} color="#FFFFFF" />} className="flex-[2]" />
            </View>
          ) : phase === 'processing' ? (
            <View className="absolute bottom-0 left-0 right-0 items-center pb-10">
              <MotiPulse />
              <Text variant="headline" weight="semibold" className="text-white">
                Analyzing your meal…
              </Text>
              <Text variant="caption" color="muted" className="text-white/70">
                Estimating calories & macros
              </Text>
            </View>
          ) : null}
        </View>
      )}

      {/* REVIEW */}
      {phase === 'review' && (
        <Screen edges={['top']} contentContainerStyle={{ paddingBottom: 120 }}>
          <View className="mb-4 mt-2">
            <Text variant="title1" className="text-ink dark:text-neutral-50">
              Confirm your meal
            </Text>
            <Text variant="bodySmall" color="secondary">
              {detectedFoods.length} food{detectedFoods.length === 1 ? '' : 's'} detected
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
              <Image source={{ uri: imageUri }} className="h-40 w-full rounded-[20px]" resizeMode="cover" />
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

          <View className="mt-4 flex-row items-center justify-between rounded-2xl bg-primary-soft px-4 py-3 dark:bg-emerald-900">
            <Text variant="subhead" weight="semibold" className="text-primary-softText dark:text-emerald-200">
              Total
            </Text>
            <Text variant="subhead" weight="bold" className="text-primary-softText dark:text-emerald-200">
              {formatNumber(total.calories)} kcal · P {formatNumber(total.protein)} · C {formatNumber(total.carbs)} · F {formatNumber(total.fat)}
            </Text>
          </View>

          <Button
            label="Save meal"
            onPress={onSave}
            size="lg"
            fullWidth
            className="mt-4"
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
    <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-white/20">
      <View className="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white" />
    </View>
  );
}