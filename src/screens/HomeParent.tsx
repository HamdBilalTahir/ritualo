import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../theme/ThemeContext';
import { radius, spacing } from '../theme/tokens';
import { useAppState } from '../context/AppStateContext';
import { ForestScene } from '../components/ForestScene';
import { AvatarCircle } from '../components/AvatarCircle';

export default function HomeParent() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { family, members, habits, completions, isCompletedToday, forest, activeMember, streakFor } =
    useAppState();

  return (
    <View style={{ flex: 1, backgroundColor: c.surface }}>
      <View style={[styles.forestFrame, { paddingTop: insets.top }]}>
        <ForestScene completions={completions} habits={habits} interactive />
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
        <View style={styles.hintChip} pointerEvents="none">
          <Text style={styles.hintChipText}>Pinch & drag to explore</Text>
        </View>
      </View>

      <ScrollView
        style={styles.habitList}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl, paddingTop: spacing.md }}
      >
        <Text style={[styles.sectionTitle, { color: c.onSurface }]}>Today's rituals</Text>
        {habits.length === 0 && (
          <Text style={{ color: c.onSurfaceSecondary, fontFamily: 'Nunito_400Regular', fontSize: 13.5 }}>
            No rituals yet. Add some from Profile → Add a ritual.
          </Text>
        )}
        {members.map((member) => {
          const memberHabits = habits.filter((h) => h.memberId === member.id);
          if (memberHabits.length === 0) return null;
          return (
            <View key={member.id} style={{ marginBottom: spacing.md }}>
              <View style={styles.memberHeader}>
                <AvatarCircle emoji={member.emoji} uri={member.avatarUri} size={22} />
                <Text style={[styles.memberName, { color: c.onSurface }]}>{member.name}</Text>
              </View>
              {memberHabits.map((h) => {
                const done = isCompletedToday(h.id);
                const canTap = h.memberId === activeMember?.id;
                const streak = streakFor(h.id);
                return (
                  <Pressable
                    key={h.id}
                    disabled={done || !canTap}
                    onPress={() => router.push({ pathname: '/checkin/[habitId]', params: { habitId: h.id } })}
                    style={[styles.habitRow, { backgroundColor: '#FFFFFF', borderColor: c.border }]}
                  >
                    <Text style={{ fontSize: 18 }}>{h.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.habitLabel, { color: c.onSurface }]}>{h.label}</Text>
                      <Text style={[styles.habitSub, { color: c.onSurfaceSecondary }]}>
                        {streak > 0 ? `${streak}-day streak` : canTap ? 'Tap to check in' : 'Not yet today'}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusPill,
                        { backgroundColor: done ? c.brand : canTap ? c.brandPrimary : c.surfaceSecondary },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusPillText,
                          { color: done || canTap ? '#FFFFFF' : c.onSurfaceTertiary },
                        ]}
                      >
                        {done ? 'Done ✓' : canTap ? 'DONE' : 'Waiting'}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  forestFrame: { height: '42%' },
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
  hintChip: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  hintChipText: { color: 'rgba(255,255,255,0.85)', fontFamily: 'Nunito_400Regular', fontSize: 10.5 },
  habitList: { flex: 1, paddingHorizontal: spacing.lg },
  sectionTitle: { fontFamily: 'Fraunces_500Medium', fontSize: 17, marginBottom: spacing.md },
  memberHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xs },
  memberName: { fontFamily: 'Nunito_500Medium', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.4 },
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
  statusPill: { borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  statusPillText: { fontFamily: 'Nunito_500Medium', fontSize: 11 },
});
