import React from 'react';
import { View, Text, StyleSheet, Share } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../../src/theme/ThemeContext';
import { radius, spacing } from '../../src/theme/tokens';
import { useAppState } from '../../src/context/AppStateContext';
import { Button } from '../../src/components/Button';

export default function Invite() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { family } = useAppState();
  const code = family?.inviteCode ?? '------';

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
      <Text style={styles.critter}>🎉</Text>
      <Text style={[styles.h1, { color: c.onSurface }]}>{family?.forestName} is planted!</Text>
      <Text style={[styles.p, { color: c.onSurfaceSecondary }]}>
        Share this code so the rest of your family can join.
      </Text>

      <View style={styles.codeRow}>
        {code.split('').map((ch, i) => (
          <View key={i} style={[styles.codeBox, { backgroundColor: c.surfaceSecondary, borderColor: c.brandPrimary }]}>
            <Text style={[styles.codeChar, { color: c.brandPrimary }]}>{ch}</Text>
          </View>
        ))}
      </View>

      <View style={{ flex: 1 }} />

      <Button
        label="Share invite code"
        variant="secondary"
        onPress={() => Share.share({ message: `Join our family forest on Ritualo! Use code ${code}` })}
        style={{ width: '100%', marginBottom: spacing.md }}
      />
      <Button label="Set up my habits →" onPress={() => router.push('/(setup)/habits')} style={{ width: '100%' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  critter: { fontSize: 44, marginBottom: spacing.sm },
  h1: { fontFamily: 'Fraunces_500Medium', fontSize: 22, marginBottom: spacing.xs, textAlign: 'center' },
  p: { fontFamily: 'Nunito_400Regular', fontSize: 13.5, textAlign: 'center', marginBottom: spacing.xl, lineHeight: 19 },
  codeRow: { flexDirection: 'row', gap: spacing.sm },
  codeBox: {
    width: 40,
    height: 50,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeChar: { fontFamily: 'Fraunces_500Medium', fontSize: 20 },
});
