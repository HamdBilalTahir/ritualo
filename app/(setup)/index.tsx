import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../../src/theme/ThemeContext';
import { radius, spacing } from '../../src/theme/tokens';
import { Button } from '../../src/components/Button';

export default function SetupChoice() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const [choice, setChoice] = useState<'create' | 'join'>('create');

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: c.surface,
        paddingTop: insets.top + spacing.xxl,
        paddingBottom: insets.bottom + spacing.xl,
        paddingHorizontal: spacing.xl,
        alignItems: 'center',
      }}
    >
      <Text style={styles.critter}>🦔</Text>
      <Text style={[styles.h1, { color: c.onSurface }]}>Join a family forest</Text>
      <Text style={[styles.p, { color: c.onSurfaceSecondary }]}>
        Start a new one, or plant yourself in a forest that's already growing.
      </Text>

      <Pressable
        onPress={() => setChoice('create')}
        style={[
          styles.card,
          {
            borderColor: choice === 'create' ? c.brandPrimary : c.border,
            backgroundColor: choice === 'create' ? c.brandTertiary : '#FFFFFF',
          },
        ]}
      >
        <View style={[styles.ic, { backgroundColor: c.brand }]}>
          <Text style={{ fontSize: 18 }}>🌲</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardTitle, { color: c.onSurface }]}>Start a Forest</Text>
          <Text style={[styles.cardSub, { color: c.onSurfaceSecondary }]}>You'll invite your family next</Text>
        </View>
      </Pressable>

      <Pressable
        onPress={() => setChoice('join')}
        style={[
          styles.card,
          {
            borderColor: choice === 'join' ? c.brandPrimary : c.border,
            backgroundColor: choice === 'join' ? c.brandTertiary : '#FFFFFF',
          },
        ]}
      >
        <View style={[styles.ic, { backgroundColor: c.brandSecondary }]}>
          <Text style={{ fontSize: 18 }}>🔑</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardTitle, { color: c.onSurface }]}>Have an invite code?</Text>
          <Text style={[styles.cardSub, { color: c.onSurfaceSecondary }]}>Join a forest that's already growing</Text>
        </View>
      </Pressable>

      <View style={{ flex: 1 }} />

      <Button
        label="Continue"
        onPress={() => router.push(choice === 'create' ? '/(setup)/create' : '/(setup)/join')}
        style={{ width: '100%' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  critter: { fontSize: 44, marginBottom: spacing.sm },
  h1: { fontFamily: 'Fraunces_500Medium', fontSize: 22, marginBottom: spacing.xs, textAlign: 'center' },
  p: { fontFamily: 'Nunito_400Regular', fontSize: 13.5, textAlign: 'center', marginBottom: spacing.xl, lineHeight: 19 },
  card: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1.5,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  ic: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontFamily: 'Nunito_500Medium', fontSize: 15 },
  cardSub: { fontFamily: 'Nunito_400Regular', fontSize: 12, marginTop: 2 },
});
