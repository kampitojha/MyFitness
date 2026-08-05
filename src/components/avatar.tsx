import { Image } from 'expo-image';
import { View } from 'react-native';
import { UserRound } from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';
import { Text } from '@/components/ui/text';

export interface AvatarProps {
  uri?: string | null;
  size?: number;
  name?: string;
}

const AVATAR_COLORS = ['#0284C7', '#0369A1', '#38BDF8', '#0C4A6E'];

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function Avatar({ uri, size = 56, name }: AvatarProps) {
  const { colors } = useTheme();
  const circle = { width: size, height: size, borderRadius: size / 2 };

  if (uri) {
    return <Image source={{ uri }} style={circle} contentFit="cover" transition={200} />;
  }

  const bg = AVATAR_COLORS[(name?.length ?? 0) % AVATAR_COLORS.length];
  return (
    <View style={[circle, { backgroundColor: bg }]} className="items-center justify-center">
      {name ? (
        <Text style={{ color: colors.onPrimary, fontSize: size * 0.38, fontWeight: '700' }}>
          {initials(name)}
        </Text>
      ) : (
        <UserRound size={size * 0.45} color={colors.onPrimary} />
      )}
    </View>
  );
}