import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mail, Lock, UserRound, ArrowLeft } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button, IconButton } from '@/components/ui/button';
import { userService } from '@/services/user.service';
import { useTheme } from '@/hooks/use-theme';

const schema = z
  .object({
    name: z.string().min(2, 'Enter your name'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    path: ['confirm'],
    message: 'Passwords do not match',
  });

type FormValues = z.infer<typeof schema>;

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useTheme();
  const { control, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', confirm: '' },
  });

  const onSubmit = async (values: FormValues) => {
    await userService.upsert({ name: values.name, email: values.email, onboardingCompleted: true });
    await userService.setOnboarded(true);
    router.replace('/(tabs)');
  };

  return (
    <View className="flex-1 bg-background px-6 dark:bg-background-dark" style={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 }}>
      <IconButton
        label="Go back"
        onPress={() => router.back()}
        variant="surface"
        icon={<ArrowLeft size={20} color={colors.text} />}
      />
      <View className="mt-8 flex-1">
        <Text variant="title1" className="text-ink dark:text-neutral-50">
          Create account
        </Text>
        <Text variant="bodySmall" color="secondary" className="mt-1 mb-8">
          Start tracking smarter in under a minute.
        </Text>

        <View className="gap-4">
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <Input
                label="Full name"
                leftIcon={<UserRound size={18} color={colors.textMuted} />}
                placeholder="Your name"
                autoCapitalize="words"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <Input
                label="Email"
                leftIcon={<Mail size={18} color={colors.textMuted} />}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <Input
                label="Password"
                leftIcon={<Lock size={18} color={colors.textMuted} />}
                placeholder="••••••••"
                secureTextEntry
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="confirm"
            render={({ field, fieldState }) => (
              <Input
                label="Confirm password"
                leftIcon={<Lock size={18} color={colors.textMuted} />}
                placeholder="••••••••"
                secureTextEntry
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />

          <Button
            label="Create account"
            onPress={handleSubmit(onSubmit)}
            disabled={!formState.isValid}
            loading={formState.isSubmitting}
            fullWidth
            size="lg"
            className="mt-2"
          />
        </View>

        <View className="mt-8 flex-row justify-center gap-1">
          <Text variant="bodySmall" color="secondary">
            Already have an account?
          </Text>
          <Text variant="bodySmall" weight="semibold" color="primary" onPress={() => router.push('/(auth)/login')}>
            Log in
          </Text>
        </View>
      </View>
    </View>
  );
}