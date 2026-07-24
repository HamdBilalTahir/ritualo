import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../src/theme/ThemeContext';
import { spacing } from '../src/theme/tokens';
import { images } from '../src/theme/tokens';
import { ScrimImage } from '../src/components/ScrimImage';
import { Button } from '../src/components/Button';

export default function Onboarding() {
  const c = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: c.surfaceInverse }}>
      <ScrimImage source={images.magicalForestHero} style={StyleSheet.absoluteFill}>
        <View style={[styles.content, { paddingBottom: insets.bottom + spacing.xl, paddingTop: insets.top + spacing.xl }]}>
          <View style={{ flex: 1 }} />
          <Text style={styles.tag}>RITUALO</Text>
          <Text style={styles.h1}>Grow together.</Text>
          <Text style={styles.p}>
            A shared Magical Forest that grows every time your family shows up for each other — one small
            ritual at a time.
          </Text>
          <Button label="Begin the Journey →" onPress={() => router.push('/(auth)/auth')} />
          <Text style={styles.link} onPress={() => router.push({ pathname: '/(auth)/auth', params: { mode: 'login' } })}>
            Already have an account? Sign in
          </Text>
        </View>
      </ScrimImage>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  tag: {
    color: '#E9E4D2',
    fontFamily: 'Nunito_500Medium',
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  h1: {
    color: '#FFFFFF',
    fontFamily: 'Fraunces_500Medium',
    fontSize: 40,
    lineHeight: 44,
    marginBottom: spacing.md,
  },
  p: {
    color: '#E9E4D2',
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  link: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_500Medium',
    fontSize: 13,
    textAlign: 'center',
    marginTop: spacing.lg,
    textDecorationLine: 'underline',
  },
});
