import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, StyleProp, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useColors, useMode } from '../theme/ThemeContext';
import { radius, spacing, touchTarget } from '../theme/tokens';

type Variant = 'primary' | 'ghost' | 'secondary';

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  icon,
}: {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
}) {
  const c = useColors();
  const mode = useMode();
  const minHeight = mode === 'kid' ? touchTarget.kid : touchTarget.parent;

  const bg =
    variant === 'primary' ? c.brandPrimary : variant === 'secondary' ? c.brandTertiary : 'transparent';
  const fg =
    variant === 'primary' ? c.onBrandPrimary : variant === 'secondary' ? c.onBrandTertiary : c.onSurfaceInverse;
  const borderColor = variant === 'ghost' ? 'rgba(255,255,255,0.6)' : 'transparent';

  return (
    <Pressable
      disabled={disabled || loading}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: bg,
          borderColor,
          borderWidth: variant === 'ghost' ? 1 : 0,
          minHeight,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {icon}
          <Text style={[styles.label, { color: fg }]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  label: {
    fontFamily: 'Nunito_500Medium',
    fontSize: 15,
    letterSpacing: 0.2,
  },
});
