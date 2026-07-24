import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAppState } from '../src/context/AppStateContext';
import { colorsFor } from '../src/theme/tokens';

export default function Gate() {
  const { loading, isAuthenticated, hasFamily, members, activeMember } = useAppState();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.replace('/onboarding');
    } else if (!hasFamily) {
      router.replace('/(setup)');
    } else if (members.length > 0 && !activeMember) {
      router.replace('/(setup)/who-is-this');
    } else {
      router.replace('/(app)/home');
    }
  }, [loading, isAuthenticated, hasFamily, members.length, activeMember]);

  const c = colorsFor('parent');
  return (
    <View style={{ flex: 1, backgroundColor: c.surface, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color={c.brandPrimary} />
    </View>
  );
}
