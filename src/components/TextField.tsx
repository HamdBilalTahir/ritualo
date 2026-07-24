import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useColors } from '../theme/ThemeContext';
import { radius, spacing } from '../theme/tokens';

export function TextField({
  label,
  error,
  ...props
}: TextInputProps & { label: string; error?: string }) {
  const c = useColors();
  return (
    <View style={{ marginBottom: spacing.lg }}>
      <Text style={[styles.label, { color: c.onSurface }]}>{label}</Text>
      <TextInput
        placeholderTextColor={c.onSurfaceTertiary}
        style={[
          styles.input,
          {
            backgroundColor: c.surfaceSecondary,
            color: c.onSurface,
            borderColor: error ? c.error : 'transparent',
          },
        ]}
        {...props}
      />
      {!!error && <Text style={[styles.error, { color: c.error }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: 'Nunito_500Medium',
    fontSize: 13,
    marginBottom: spacing.xs,
  },
  input: {
    borderRadius: radius.pill,
    borderWidth: 1.5,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
  },
  error: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    marginTop: spacing.xs,
    marginLeft: spacing.sm,
  },
});
