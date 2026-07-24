import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../../src/theme/ThemeContext';
import { spacing } from '../../src/theme/tokens';
import { useAppState } from '../../src/context/AppStateContext';
import { TextField } from '../../src/components/TextField';
import { Button } from '../../src/components/Button';
import { EmojiPicker } from '../../src/components/EmojiPicker';
import { PhotoPicker } from '../../src/components/PhotoPicker';

export default function CreateFamily() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { createFamily, authUser } = useAppState();
  const [forestName, setForestName] = useState(authUser?.name || 'The Family Forest');
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🦊');
  const [avatarUri, setAvatarUri] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name.trim() || !forestName.trim()) return;
    if (!avatarUri) return setPhotoError('Add a photo to continue.');
    setPhotoError('');
    setLoading(true);
    await createFamily(forestName.trim(), name.trim(), emoji, avatarUri);
    setLoading(false);
    router.push('/(setup)/invite');
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
        <Text style={styles.critter}>🌲</Text>
        <Text style={[styles.h1, { color: c.onSurface }]}>Name your forest</Text>
        <Text style={[styles.p, { color: c.onSurfaceSecondary }]}>This is what your family will see grow together.</Text>

        <TextField label="Forest name" placeholder="The Family Forest" value={forestName} onChangeText={setForestName} />
        <TextField label="Your name" placeholder="Amara" value={name} onChangeText={setName} autoCapitalize="words" />

        <Text style={[styles.label, { color: c.onSurface }]}>Add your photo</Text>
        <View style={{ marginBottom: spacing.lg }}>
          <PhotoPicker uri={avatarUri} onChange={(uri) => { setAvatarUri(uri); setPhotoError(''); }} error={photoError} />
        </View>

        <Text style={[styles.label, { color: c.onSurface }]}>Pick a critter badge</Text>
        <View style={{ marginBottom: spacing.xl }}>
          <EmojiPicker value={emoji} onChange={setEmoji} />
        </View>

        <Button label="Grow this forest" onPress={submit} loading={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  critter: { fontSize: 40, marginBottom: spacing.md },
  h1: { fontFamily: 'Fraunces_500Medium', fontSize: 24, marginBottom: spacing.xs },
  p: { fontFamily: 'Nunito_400Regular', fontSize: 13.5, marginBottom: spacing.xl, lineHeight: 19 },
  label: { fontFamily: 'Nunito_500Medium', fontSize: 13, marginBottom: spacing.sm },
});
