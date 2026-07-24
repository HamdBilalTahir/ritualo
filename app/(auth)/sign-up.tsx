import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../../src/theme/ThemeContext';
import { spacing } from '../../src/theme/tokens';
import { useAppState } from '../../src/context/AppStateContext';
import { TextField } from '../../src/components/TextField';
import { Button } from '../../src/components/Button';

export default function SignUp() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { signUp } = useAppState();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name.trim()) return setError('Tell us your name first.');
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('That email doesn’t look right.');
    if (password.length < 6) return setError('Password needs at least 6 characters.');
    setError('');
    setLoading(true);
    await signUp(email.trim(), name.trim());
    setLoading(false);
    router.replace('/(setup)');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: c.surface }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + spacing.xxl,
          paddingBottom: insets.bottom + spacing.xl,
          paddingHorizontal: spacing.xl,
        }}
      >
        <Text style={styles.critter}>🌲</Text>
        <Text style={[styles.h1, { color: c.onSurface }]}>Plant your family's account</Text>
        <Text style={[styles.p, { color: c.onSurfaceSecondary }]}>
          You'll invite the rest of your family right after this.
        </Text>

        <TextField label="Your name" placeholder="Amara" value={name} onChangeText={setName} autoCapitalize="words" />
        <TextField
          label="Email"
          placeholder="you@family.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextField
          label="Password"
          placeholder="At least 6 characters"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={error || undefined}
        />

        <Button label="Create account" onPress={submit} loading={loading} style={{ marginTop: spacing.sm }} />
        <Text style={[styles.link, { color: c.onSurfaceSecondary }]} onPress={() => router.push('/(auth)/sign-in')}>
          Already have an account? <Text style={{ color: c.brandPrimary }}>Sign in</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  critter: { fontSize: 40, marginBottom: spacing.md },
  h1: { fontFamily: 'Fraunces_500Medium', fontSize: 26, marginBottom: spacing.xs },
  p: { fontFamily: 'Nunito_400Regular', fontSize: 14, marginBottom: spacing.xl, lineHeight: 20 },
  link: { fontFamily: 'Nunito_400Regular', fontSize: 13, textAlign: 'center', marginTop: spacing.lg },
});
