import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../theme/ThemeContext';
import { images, radius, spacing, touchTarget } from '../theme/tokens';
import { useAppState } from '../context/AppStateContext';
import { ScrimImage } from '../components/ScrimImage';
import { AvatarCircle } from '../components/AvatarCircle';

export default function HomeKid() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { activeMember, habitsFor, isCompletedToday, completions, habits } = useAppState();

  const myHabits = activeMember ? habitsFor(activeMember.id) : [];
  const totalStars = completions
    .filter((comp) => comp.memberId === activeMember?.id)
    .reduce((sum, comp) => sum + (habits.find((h) => h.id === comp.habitId)?.stars ?? 10), 0);

  return (
    <View style={{ flex: 1 }}>
      <ScrimImage source={images.magicalForestHero} strength="soft">
        <View style={[styles.topRow, { paddingTop: insets.top + spacing.md }]}>
          <AvatarCircle uri={activeMember?.avatarUri} emoji={activeMember?.emoji} size={40} ringColor="#fff" />
          <View style={styles.starsPill}>
            <Text style={styles.starsText}>⭐ {totalStars}</Text>
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[styles.bubbleWrap, { paddingBottom: insets.bottom + spacing.xl }]}
        >
          {myHabits.length === 0 && (
            <Text style={styles.emptyText}>Ask a grown-up to add your first ritual! 🌱</Text>
          )}
          {myHabits.map((h) => {
            const done = isCompletedToday(h.id);
            return (
              <Pressable
                key={h.id}
                disabled={done}
                onPress={() => router.push({ pathname: '/checkin/[habitId]', params: { habitId: h.id } })}
                style={[styles.bubble, done && styles.bubbleDone]}
              >
                <View style={[styles.emoji, { backgroundColor: done ? c.brandTertiary : c.brandSecondary }]}>
                  <Text style={{ fontSize: 26 }}>{h.emoji}</Text>
                </View>
                <Text style={styles.bubbleLabel}>{h.label}</Text>
                <View style={[styles.trailing, { backgroundColor: done ? c.brand : c.brandSecondary }]}>
                  <Text style={{ fontFamily: 'Nunito_500Medium', fontSize: 15, color: done ? '#fff' : '#333B31' }}>
                    {done ? '✓' : '→'}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </ScrimImage>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  starsPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  starsText: { fontFamily: 'Nunito_500Medium', fontSize: 14, color: '#333B31' },
  bubbleWrap: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, gap: spacing.md },
  emptyText: {
    color: '#fff',
    fontFamily: 'Nunito_500Medium',
    fontSize: 16,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
  bubble: {
    minHeight: touchTarget.kid,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg + 4,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  bubbleDone: { opacity: 0.55 },
  emoji: { width: 52, height: 52, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  bubbleLabel: { flex: 1, fontFamily: 'Fraunces_500Medium', fontSize: 17, color: '#333B31' },
  trailing: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
});
