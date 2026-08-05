import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { Spinner } from '@/components/ui/spinner';
import { useHasCompletedOnboarding } from '@/hooks/use-profile';
import { useAuthStore } from '@/store/auth.store';

export default function Index() {
  const user = useAuthStore((s) => s.user);
  const authInitialized = useAuthStore((s) => s.initialized);
  const { data: onboarded, isLoading } = useHasCompletedOnboarding();

  if (!authInitialized || isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size="large" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  if (onboarded) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(onboarding)" />;
}
