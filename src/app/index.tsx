import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { Spinner } from '@/components/ui/spinner';
import { useHasCompletedOnboarding } from '@/hooks/use-profile';

export default function Index() {
  const { data: onboarded, isLoading } = useHasCompletedOnboarding();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size="large" />
      </View>
    );
  }

  if (onboarded) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(onboarding)" />;
}
