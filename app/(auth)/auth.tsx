import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../../src/theme/ThemeContext';
import { radius, spacing } from '../../src/theme/tokens';
import { useAppState } from '../../src/context/AppStateContext';
import { TextField } from '../../src/components/TextField';
import { Button } from '../../src/components/Button';

type Mode = 'signup' | 'login';

export default function Auth() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { signUp, signIn } = useAppState();
  const { mode: modeParam } = useLocalSearchParams<{ mode?: string }>();
  const [mode, setMode] = useState<Mode>(modeParam === 'login' ? 'login' : 'signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (mode === 'signup' && !name.trim()) return setError('Tell us your family name first.');
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('That email doesn’t look right.');
    if (password.length < 6) return setError('Password needs at least 6 characters.');
    setError('');
    setLoading(true);
    if (mode === 'signup') {
      await signUp(email.trim(), name.trim());
    } else {
      await signIn(email.trim());
    }
    setLoading(false);
    router.replace('/');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.surface }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + spacing.xxl,
          paddingBottom: insets.bottom + spacing.xl,
          paddingHorizontal: spacing.xl,
        }}
      >
        <Text style={[styles.h1, { color: c.onSurface }]}>Welcome home.</Text>
        <Text style={[styles.p, { color: c.onSurfaceSecondary }]}>Sign in to tend your family's forest.</Text>

        <View style={[styles.segment, { backgroundColor: c.surfaceSecondary }]}>
          <Pressable
            onPress={() => setMode('login')}
            style={[styles.segmentBtn, mode === 'login' && { backgroundColor: '#FFFFFF' }]}
          >
            <Text style={[styles.segmentLabel, { color: c.onSurface }]}>Log In</Text>
          </Pressable>
          <Pressable
            onPress={() => setMode('signup')}
            style={[styles.segmentBtn, mode === 'signup' && { backgroundColor: c.brandPrimary }]}
          >
            <Text style={[styles.segmentLabel, { color: mode === 'signup' ? c.onBrandPrimary : c.onSurface }]}>
              Sign Up
            </Text>
          </Pressable>
        </View>

        {mode === 'signup' && (
          <TextField label="Family name" placeholder="The Oak Family" value={name} onChangeText={setName} autoCapitalize="words" />
        )}
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

        <Button label="Continue" onPress={submit} loading={loading} style={{ marginTop: spacing.sm }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  h1: { fontFamily: 'Fraunces_500Medium', fontSize: 28, marginBottom: spacing.xs },
  p: { fontFamily: 'Nunito_400Regular', fontSize: 14, marginBottom: spacing.xl, lineHeight: 20 },
  segment: {
    flexDirection: 'row',
    borderRadius: radius.pill,
    padding: 4,
    marginBottom: spacing.xl,
  },
  segmentBtn: {
    flex: 1,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  segmentLabel: { fontFamily: 'Nunito_500Medium', fontSize: 14 },
});
