import React from 'react';
import { StyleSheet, ImageStyle, StyleProp } from 'react-native';
import { ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

// Mandated 3-stop vertical scrim: transparent -> 20% surfaceInverse -> 80% surfaceInverse,
// guaranteeing legible text over the magical-forest photography.
export function ScrimImage({
  source,
  children,
  style,
  strength = 'default',
}: {
  source: string;
  children?: React.ReactNode;
  style?: StyleProp<ImageStyle>;
  strength?: 'default' | 'strong' | 'soft';
}) {
  const stops: Record<string, [string, string, string]> = {
    default: ['rgba(51,59,49,0)', 'rgba(51,59,49,0.55)', 'rgba(51,59,49,0.92)'],
    strong: ['rgba(51,59,49,0.15)', 'rgba(51,59,49,0.7)', 'rgba(51,59,49,0.96)'],
    soft: ['rgba(51,59,49,0)', 'rgba(51,59,49,0.35)', 'rgba(51,59,49,0.75)'],
  };
  return (
    <ImageBackground source={{ uri: source }} style={[StyleSheet.absoluteFill, style]} contentFit="cover">
      <LinearGradient
        colors={stops[strength]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </ImageBackground>
  );
}
