import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useColors } from '../theme/ThemeContext';
import { radius, spacing } from '../theme/tokens';

export function Card({
  children,
  style,
  tint,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  tint?: string;
}) {
  const c = useColors();
  return (
    <View
      style={[
        styles.base,
        { backgroundColor: tint ?? '#FFFFFF', borderColor: c.border },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
  },
});
