import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../../src/theme/ThemeContext';
import { radius, spacing } from '../../src/theme/tokens';
import { useAppState } from '../../src/context/AppStateContext';

export default function WhoIsThis() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { members, setActiveMember, family } = useAppState();

  const pick = (id: string) => {
    setActiveMember(id);
    router.replace('/(app)/home');
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: c.surface,
        paddingTop: insets.top + spacing.xxl,
        paddingHorizontal: spacing.xl,
        alignItems: 'center',
      }}
    >
      <Text style={styles.critter}>👋</Text>
      <Text style={[styles.h1, { color: c.onSurface }]}>Who's this?</Text>
      <Text style={[styles.p, { color: c.onSurfaceSecondary }]}>Tap your avatar to jump into {family?.forestName}.</Text>

      <ScrollView contentContainerStyle={styles.grid}>
        {members.map((m) => (
          <Pressable key={m.id} onPress={() => pick(m.id)} style={[styles.card, { backgroundColor: c.surfaceSecondary, borderColor: c.border }]}>
            <View style={[styles.avatar, { backgroundColor: c.brandTertiary }]}>
              <Text style={{ fontSize: 30 }}>{m.emoji}</Text>
            </View>
            <Text style={[styles.name, { color: c.onSurface }]}>{m.name}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  critter: { fontSize: 44, marginBottom: spacing.sm },
  h1: { fontFamily: 'Fraunces_500Medium', fontSize: 22, marginBottom: spacing.xs, textAlign: 'center' },
  p: { fontFamily: 'Nunito_400Regular', fontSize: 13.5, textAlign: 'center', marginBottom: spacing.xl, lineHeight: 19 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'center' },
  card: { width: 110, borderWidth: 1.5, borderRadius: radius.lg, padding: spacing.md, alignItems: 'center', gap: spacing.sm },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  name: { fontFamily: 'Nunito_500Medium', fontSize: 13 },
});
