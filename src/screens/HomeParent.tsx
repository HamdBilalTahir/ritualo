import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../theme/ThemeContext';
import { images, radius, spacing } from '../theme/tokens';
import { useAppState, FOREST_STAGES } from '../context/AppStateContext';
import { ScrimImage } from '../components/ScrimImage';
import { AvatarCircle } from '../components/AvatarCircle';

export default function HomeParent() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { family, members, habits, isCompletedToday, forest, activeMember } = useAppState();

  const stageIndex = FOREST_STAGES.findIndex((s) => s.name === forest.stage);

  return (
    <View style={{ flex: 1, backgroundColor: c.surface }}>
      <View style={[styles.forestFrame, { paddingTop: insets.top }]}>
        <ScrimImage source={images.magicalForestHero} strength="strong">
          <View style={styles.topBar}>
            <View>
              <Text style={styles.greetSmall}>Good morning</Text>
              <Text style={styles.greetBig}>{family?.forestName}</Text>
            </View>
            <Pressable onPress={() => router.push('/(app)/profile')} style={styles.settingsBtn}>
              <Text style={{ fontSize: 16 }}>⚙️</Text>
            </Pressable>
          </View>
          <View style={styles.stageChip}>
            <Text style={styles.stageChipText}>
              🌿 {forest.stage} stage
              {forest.next ? ` · ${forest.toNext} to ${forest.next.name}` : ' · fully grown!'}
            </Text>
          </View>
        </ScrimImage>
      </View>

      <ScrollView
        style={styles.habitList}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl, paddingTop: spacing.lg }}
      >
        <Text style={[styles.sectionTitle, { color: c.onSurface }]}>Today's rituals</Text>
        {habits.length === 0 && (
          <Text style={{ color: c.onSurfaceSecondary, fontFamily: 'Nunito_400Regular', fontSize: 13.5 }}>
            No rituals yet. Add some from Profile → Habit Setup.
          </Text>
        )}
        {habits.map((h) => {
          const member = members.find((m) => m.id === h.memberId);
          const done = isCompletedToday(h.id);
          const canTap = h.memberId === activeMember?.id;
          return (
            <Pressable
              key={h.id}
              disabled={done || !canTap}
              onPress={() => router.push({ pathname: '/checkin/[habitId]', params: { habitId: h.id } })}
              style={[styles.habitRow, { backgroundColor: '#FFFFFF', borderColor: c.border }]}
            >
              <AvatarCircle emoji={member?.emoji} size={34} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.habitLabel, { color: c.onSurface }]}>
                  {member?.name} · {h.label}
                </Text>
                <Text style={[styles.habitSub, { color: c.onSurfaceSecondary }]}>
                  {done ? 'Completed today' : canTap ? 'Tap to check in' : 'Not yet today'}
                </Text>
              </View>
              <View
                style={[
                  styles.checkCircle,
                  done
                    ? { backgroundColor: c.brand }
                    : { borderWidth: 2, borderColor: c.borderStrong, backgroundColor: 'transparent' },
                ]}
              >
                {done && <Text style={{ color: '#fff', fontSize: 12, fontFamily: 'Nunito_500Medium' }}>✓</Text>}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  forestFrame: { height: '38%' },
  topBar: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetSmall: { color: '#E9E4D2', fontFamily: 'Nunito_400Regular', fontSize: 11.5, opacity: 0.9 },
  greetBig: { color: '#FFFFFF', fontFamily: 'Fraunces_500Medium', fontSize: 17, marginTop: 2 },
  settingsBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageChip: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  stageChipText: { color: '#FFFFFF', fontFamily: 'Nunito_500Medium', fontSize: 11.5 },
  habitList: { flex: 1, paddingHorizontal: spacing.lg },
  sectionTitle: { fontFamily: 'Fraunces_500Medium', fontSize: 17, marginBottom: spacing.md },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  habitLabel: { fontFamily: 'Nunito_500Medium', fontSize: 13.5 },
  habitSub: { fontFamily: 'Nunito_400Regular', fontSize: 11.5, marginTop: 2 },
  checkCircle: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
});
