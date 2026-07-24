import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useColors } from '../theme/ThemeContext';
import { radius, spacing } from '../theme/tokens';

const OPTIONS = ['🦊', '🦔', '🐿️', '🦉', '🐻', '🦌', '🐰', '🦝'];

export function EmojiPicker({ value, onChange }: { value: string; onChange: (e: string) => void }) {
  const c = useColors();
  return (
    <View style={styles.row}>
      {OPTIONS.map((e) => (
        <Pressable
          key={e}
          onPress={() => onChange(e)}
          style={[
            styles.item,
            {
              backgroundColor: value === e ? c.brandTertiary : c.surfaceSecondary,
              borderColor: value === e ? c.brandPrimary : 'transparent',
            },
          ]}
        >
          <Text style={{ fontSize: 22 }}>{e}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  item: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
