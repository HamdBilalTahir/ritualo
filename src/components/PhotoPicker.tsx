import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useColors } from '../theme/ThemeContext';
import { radius, spacing } from '../theme/tokens';

export function PhotoPicker({
  uri,
  onChange,
  size = 104,
  error,
}: {
  uri?: string;
  onChange: (uri: string) => void;
  size?: number;
  error?: string;
}) {
  const c = useColors();
  const [busy, setBusy] = useState(false);

  const pickFromLibrary = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    setBusy(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) onChange(result.assets[0].uri);
    } finally {
      setBusy(false);
    }
  };

  const takePhoto = async () => {
    if (Platform.OS === 'web') return pickFromLibrary();
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;
    setBusy(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) onChange(result.assets[0].uri);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: c.brandTertiary,
            borderColor: error ? c.error : c.border,
          },
        ]}
      >
        {uri ? (
          <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} contentFit="cover" />
        ) : (
          <Text style={{ fontSize: size * 0.32 }}>📷</Text>
        )}
      </View>

      <View style={styles.row}>
        <Pressable
          onPress={takePhoto}
          disabled={busy}
          style={[styles.chip, { backgroundColor: c.surfaceSecondary, opacity: busy ? 0.6 : 1 }]}
        >
          <Text style={[styles.chipLabel, { color: c.onSurface }]}>{Platform.OS === 'web' ? '🖼️ Choose photo' : '📷 Take photo'}</Text>
        </Pressable>
        {Platform.OS !== 'web' && (
          <Pressable
            onPress={pickFromLibrary}
            disabled={busy}
            style={[styles.chip, { backgroundColor: c.surfaceSecondary, opacity: busy ? 0.6 : 1 }]}
          >
            <Text style={[styles.chipLabel, { color: c.onSurface }]}>🖼️ Choose from library</Text>
          </Pressable>
        )}
      </View>

      {error ? <Text style={[styles.error, { color: c.error }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  row: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap', justifyContent: 'center' },
  chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.pill },
  chipLabel: { fontFamily: 'Nunito_500Medium', fontSize: 12.5 },
  error: { fontFamily: 'Nunito_400Regular', fontSize: 12, marginTop: spacing.sm },
});
