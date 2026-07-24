import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../../src/theme/ThemeContext';
import { radius, spacing } from '../../src/theme/tokens';

export default function SetupChoice() {
  const c = useColors();
  const insets = useSafeAreaInsets();

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
      <Text style={[styles.h1, { color: c.onSurface }]}>Let's find your family.</Text>

      <Pressable
        onPress={() => router.push('/(setup)/create')}
        style={[styles.card, { borderColor: c.border, backgroundColor: c.brandTertiary }]}
      >
        <View style={[styles.ic, { backgroundColor: c.brand }]}>
          <Text style={{ fontSize: 18, color: '#FFFFFF' }}>+</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardTitle, { color: c.onSurface }]}>Start a Forest</Text>
          <Text style={[styles.cardSub, { color: c.onSurfaceSecondary }]}>Create a new family & invite code</Text>
        </View>
      </Pressable>

      <Pressable
        onPress={() => router.push('/(setup)/join')}
        style={[styles.card, { borderColor: c.border, backgroundColor: c.surfaceSecondary }]}
      >
        <View style={[styles.ic, { backgroundColor: c.surfaceTertiary }]}>
          <Text style={{ fontSize: 18 }}>🔒</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardTitle, { color: c.onSurface }]}>Have an Invite Code?</Text>
          <Text style={[styles.cardSub, { color: c.onSurfaceSecondary }]}>Join a family already growing a forest</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  h1: { fontFamily: 'Fraunces_500Medium', fontSize: 24, marginBottom: spacing.xl, alignSelf: 'flex-start' },
  card: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1.5,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  ic: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontFamily: 'Fraunces_500Medium', fontSize: 16 },
  cardSub: { fontFamily: 'Nunito_400Regular', fontSize: 12, marginTop: 2 },
});
