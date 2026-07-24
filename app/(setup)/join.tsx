import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../../src/theme/ThemeContext';
import { radius, spacing } from '../../src/theme/tokens';
import { useAppState } from '../../src/context/AppStateContext';
import { TextField } from '../../src/components/TextField';
import { Button } from '../../src/components/Button';
import { EmojiPicker } from '../../src/components/EmojiPicker';
import { PhotoPicker } from '../../src/components/PhotoPicker';
import { CodeInput } from '../../src/components/CodeInput';

export default function JoinFamily() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { joinFamily } = useAppState();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'parent' | 'kid'>('kid');
  const [emoji, setEmoji] = useState('🐰');
  const [avatarUri, setAvatarUri] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (code.trim().length < 6 || !name.trim()) return;
    if (!avatarUri) return setPhotoError('Add a photo to continue.');
    setPhotoError('');
    setLoading(true);
    await joinFamily(code.trim(), name.trim(), role, emoji, avatarUri);
    setLoading(false);
    router.push('/(setup)/habits');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.surface }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + spacing.xl,
          paddingBottom: insets.bottom + spacing.xl,
          paddingHorizontal: spacing.xl,
        }}
      >
        <Text style={styles.critter}>🔑</Text>
        <Text style={[styles.h1, { color: c.onSurface }]}>Enter your invite code</Text>
        <Text style={[styles.p, { color: c.onSurfaceSecondary }]}>Ask a parent for the 6-character code.</Text>

        <View style={{ marginBottom: spacing.xl }}>
          <CodeInput value={code} onChange={setCode} />
        </View>

        <TextField label="Your name" placeholder="Aarav" value={name} onChangeText={setName} autoCapitalize="words" />

        <Text style={[styles.label, { color: c.onSurface }]}>I am a...</Text>
        <View style={styles.roleRow}>
          <Pressable
            onPress={() => setRole('kid')}
            style={[styles.roleBtn, { borderColor: role === 'kid' ? c.brandPrimary : c.border, backgroundColor: role === 'kid' ? c.brandTertiary : '#fff' }]}
          >
            <Text style={{ color: c.onSurface, fontFamily: 'Nunito_500Medium' }}>🧒 Kid</Text>
          </Pressable>
          <Pressable
            onPress={() => setRole('parent')}
            style={[styles.roleBtn, { borderColor: role === 'parent' ? c.brandPrimary : c.border, backgroundColor: role === 'parent' ? c.brandTertiary : '#fff' }]}
          >
            <Text style={{ color: c.onSurface, fontFamily: 'Nunito_500Medium' }}>🧑 Parent</Text>
          </Pressable>
        </View>

        <Text style={[styles.label, { color: c.onSurface, marginTop: spacing.lg }]}>Add your photo</Text>
        <View style={{ marginBottom: spacing.lg }}>
          <PhotoPicker uri={avatarUri} onChange={(uri) => { setAvatarUri(uri); setPhotoError(''); }} error={photoError} />
        </View>

        <Text style={[styles.label, { color: c.onSurface }]}>Pick a critter badge</Text>
        <View style={{ marginBottom: spacing.xl }}>
          <EmojiPicker value={emoji} onChange={setEmoji} />
        </View>

        <Button label="Join the forest" onPress={submit} loading={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  critter: { fontSize: 40, marginBottom: spacing.md },
  h1: { fontFamily: 'Fraunces_500Medium', fontSize: 24, marginBottom: spacing.xs },
  p: { fontFamily: 'Nunito_400Regular', fontSize: 13.5, marginBottom: spacing.xl, lineHeight: 19 },
  label: { fontFamily: 'Nunito_500Medium', fontSize: 13, marginBottom: spacing.sm },
  roleRow: { flexDirection: 'row', gap: spacing.sm },
  roleBtn: { flex: 1, borderWidth: 1.5, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center' },
});
