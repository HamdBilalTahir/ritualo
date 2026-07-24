import React, { useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useColors } from '../theme/ThemeContext';
import { radius, spacing } from '../theme/tokens';

export function CodeInput({ value, onChange, length = 6 }: { value: string; onChange: (v: string) => void; length?: number }) {
  const c = useColors();
  const ref = useRef<TextInput>(null);
  const chars = value.toUpperCase().split('');

  return (
    <View style={styles.row}>
      {Array.from({ length }).map((_, i) => {
        const filled = !!chars[i];
        return (
          <View
            key={i}
            style={[
              styles.box,
              {
                backgroundColor: filled ? '#FFFFFF' : c.surfaceSecondary,
                borderColor: filled ? c.brandPrimary : c.border,
              },
            ]}
          >
            <TextInput
              ref={i === chars.length ? ref : undefined}
              value={chars[i] ?? ''}
              maxLength={1}
              autoCapitalize="characters"
              style={[styles.char, { color: c.brandPrimary }]}
              onChangeText={(t) => {
                const clean = t.slice(-1).toUpperCase();
                const padded = value.padEnd(length, ' ');
                const next = (padded.slice(0, i) + (clean || ' ') + padded.slice(i + 1)).trimEnd();
                onChange(next);
              }}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace' && !chars[i]) {
                  onChange(value.slice(0, Math.max(0, i - 1)));
                }
              }}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  box: {
    width: 40,
    height: 50,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  char: {
    fontFamily: 'Fraunces_500Medium',
    fontSize: 20,
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
});
