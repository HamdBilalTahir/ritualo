import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useColors } from '../theme/ThemeContext';

export function AvatarCircle({
  uri,
  emoji,
  size = 36,
  ringColor,
}: {
  uri?: string;
  emoji?: string;
  size?: number;
  ringColor?: string;
}) {
  const c = useColors();
  const ring = ringColor ?? c.brandTertiary;
  return (
    <View
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: ring,
          backgroundColor: c.brandTertiary,
        },
      ]}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} contentFit="cover" />
      ) : (
        <Text style={{ fontSize: size * 0.5 }}>{emoji ?? '🙂'}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
