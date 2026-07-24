import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../../src/theme/ThemeContext';
import { spacing } from '../../src/theme/tokens';
import { useAppState } from '../../src/context/AppStateContext';
import { TextField } from '../../src/components/TextField';
import { Button } from '../../src/components/Button';

export default function SignIn() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { signIn } = useAppState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('That email doesn’t look right.');
    if (password.length < 6) return setError('Check your password and try again.');
    setError('');
    setLoading(true);
    await signIn(email.trim());
    setLoading(false);
    router.replace('/');
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
        <Text style={styles.critter}>🦉</Text>
        <Text style={[styles.h1, { color: c.onSurface }]}>Welcome back</Text>
        <Text style={[styles.p, { color: c.onSurfaceSecondary }]}>Your forest missed you.</Text>

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
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={error || undefined}
        />

        <Button label="Sign in" onPress={submit} loading={loading} style={{ marginTop: spacing.sm }} />
        <Text style={[styles.link, { color: c.onSurfaceSecondary }]} onPress={() => router.push('/(auth)/sign-up')}>
          New here? <Text style={{ color: c.brandPrimary }}>Create an account</Text>
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
