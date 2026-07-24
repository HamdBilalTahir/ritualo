import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated';
import { ModeProvider, useColors } from '../../src/theme/ThemeContext';
import { radius, spacing } from '../../src/theme/tokens';
import { useAppState } from '../../src/context/AppStateContext';
import { ForestScene } from '../../src/components/ForestScene';

function CheckInContent() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { habitId } = useLocalSearchParams<{ habitId: string }>();
  const { habits, members, completions, completeHabit, isCompletedToday, loading } = useAppState();
  const [celebrating, setCelebrating] = useState(false);
  const scale = useSharedValue(1);

  const habit = habits.find((h) => h.id === habitId);
  const member = members.find((m) => m.id === habit?.memberId);
  const alreadyDone = habit ? isCompletedToday(habit.id) : true;
  const highlightId = celebrating ? completions.find((cm) => cm.habitId === habit?.id)?.id ?? null : null;

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  useEffect(() => {
    if (!loading && !habit) {
      router.replace('/');
    }
  }, [loading, habit]);

  const onDone = async () => {
    if (!habit || alreadyDone) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    scale.value = withSequence(withSpring(0.88, { damping: 6 }), withSpring(1.08, { damping: 5 }), withSpring(1, { damping: 6 }));
    setCelebrating(true);
    await completeHabit(habit.id);
    setTimeout(() => router.back(), 1100);
  };

  if (!habit) {
    return <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.xl }]} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <ForestScene completions={completions} habits={habits} highlightId={highlightId} interactive={!celebrating} />

      <Pressable
        onPress={() => router.back()}
        style={[styles.closeBtn, { top: insets.top + spacing.sm, backgroundColor: 'rgba(20,26,20,0.45)' }]}
      >
        <Text style={styles.closeLabel}>✕</Text>
      </Pressable>

      <View style={{ flex: 1 }} />
      <View style={[styles.sheet, { backgroundColor: '#FFFFFF', paddingBottom: insets.bottom + spacing.xl }]}>
        <View style={styles.grabber} />
        <View style={[styles.badge, { backgroundColor: c.brandTertiary }]}>
          <Text style={{ fontSize: 30 }}>{habit.emoji}</Text>
        </View>
        <Text style={[styles.h1, { color: c.onSurface }]}>{habit.label}</Text>
        <Text style={[styles.p, { color: c.onSurfaceSecondary }]}>
          {celebrating
            ? `${member?.name} just ${habit.growthLabel}! 🎉`
            : `Tap when you're done — pinch & drag to explore your growing forest.`}
        </Text>

        <Pressable onPress={onDone} disabled={alreadyDone || celebrating}>
          <View style={[styles.doneRing, { backgroundColor: c.brandTertiary }]}>
            <Animated.View
              style={[
                styles.doneBtn,
                animatedStyle,
                { backgroundColor: c.brandPrimary },
                (alreadyDone || celebrating) && { opacity: 0.6 },
              ]}
            >
              <Text style={styles.doneText}>{celebrating ? '🎉' : alreadyDone ? 'DONE' : 'DONE!'}</Text>
              <Text style={styles.doneSub}>+{habit.stars} stars</Text>
            </Animated.View>
          </View>
        </Pressable>

        <Text style={[styles.proof, { color: c.onSurfaceTertiary }]}>📸 Add a proof selfie (optional)</Text>
      </View>
    </View>
  );
}

export default function CheckIn() {
  const { habitId } = useLocalSearchParams<{ habitId: string }>();
  const { habits, members } = useAppState();
  const habit = habits.find((h) => h.id === habitId);
  const member = members.find((m) => m.id === habit?.memberId);
  const mode = member?.role === 'kid' ? 'kid' : 'parent';
  return (
    <ModeProvider mode={mode}>
      <CheckInContent />
    </ModeProvider>
  );
}

const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: radius.lg + 8,
    borderTopRightRadius: radius.lg + 8,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  grabber: { width: 36, height: 4, borderRadius: 4, backgroundColor: '#DFD7C4', marginBottom: spacing.lg },
  badge: { width: 64, height: 64, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  h1: { fontFamily: 'Fraunces_500Medium', fontSize: 22, marginBottom: spacing.xs, textAlign: 'center' },
  p: { fontFamily: 'Nunito_400Regular', fontSize: 13.5, textAlign: 'center', marginBottom: spacing.xl, lineHeight: 19 },
  doneRing: {
    width: 176,
    height: 176,
    borderRadius: 88,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  doneBtn: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  doneText: { fontFamily: 'Fraunces_500Medium', fontSize: 22, color: '#FFFFFF' },
  doneSub: { fontFamily: 'Nunito_500Medium', fontSize: 11, color: '#FFFFFF', opacity: 0.85, letterSpacing: 0.5, textTransform: 'uppercase' },
  proof: { fontFamily: 'Nunito_400Regular', fontSize: 11.5, marginTop: spacing.lg },
  closeBtn: {
    position: 'absolute',
    right: spacing.lg,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeLabel: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Nunito_500Medium' },
});
