import React from 'react';
import { View, Text, StyleSheet, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../../src/theme/ThemeContext';
import { images, radius, spacing } from '../../src/theme/tokens';
import { useAppState, FOREST_STAGES } from '../../src/context/AppStateContext';
import { ScrimImage } from '../../src/components/ScrimImage';
import { AvatarCircle } from '../../src/components/AvatarCircle';
import { Button } from '../../src/components/Button';

function weekLabel() {
  const now = new Date();
  const day = now.getDay();
  const start = new Date(now);
  start.setDate(now.getDate() - day);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return `${fmt(start)} – ${fmt(end)}`;
}

export default function Recap() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { weeklyStats, members, completions, forest } = useAppState();
  const stats = weeklyStats();
  const mvp = members.find((m) => m.id === stats.mvpMemberId);
  const stageIndex = FOREST_STAGES.findIndex((s) => s.name === forest.stage);
  const newGrowth = Math.max(0, stageIndex);

  if (completions.length === 0) {
    return (
      <View style={[styles.emptyWrap, { backgroundColor: c.surface, paddingTop: insets.top + spacing.xxl }]}>
        <Text style={{ fontSize: 40, marginBottom: spacing.sm }}>🌦️</Text>
        <Text style={[styles.emptyText, { color: c.onSurfaceSecondary }]}>
          Not enough data yet — complete a few rituals this week to unlock your first recap.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.surfaceInverse }}>
      <ScrimImage source={images.magicalForestHero} strength="strong" style={StyleSheet.absoluteFill}>
        <View style={[styles.poster, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl }]}>
          <View style={{ flex: 1 }} />
          <Text style={styles.eyebrow}>Week of {weekLabel()}</Text>
          <Text style={styles.h1}>Your forest bloomed!</Text>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statN}>{stats.totalCompletions}</Text>
              <Text style={styles.statL}>Rituals done</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statN}>{newGrowth}</Text>
              <Text style={styles.statL}>New growth</Text>
            </View>
          </View>

          {mvp && (
            <View style={styles.mvpRow}>
              <AvatarCircle uri={mvp.avatarUri} emoji={mvp.emoji} size={26} ringColor="#fff" />
              <Text style={styles.mvpText}>MVP of the week: {mvp.name} 🏆</Text>
            </View>
          )}

          <Button
            label="Share this card"
            variant="ghost"
            onPress={() =>
              Share.share({
                message: `Our family completed ${stats.totalCompletions} rituals this week and our Ritualo forest is now in the ${forest.stage} stage! 🌲`,
              })
            }
          />
        </View>
      </ScrimImage>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyWrap: { flex: 1, alignItems: 'center', paddingHorizontal: spacing.xxl },
  emptyText: { fontFamily: 'Nunito_400Regular', fontSize: 14, textAlign: 'center', lineHeight: 20 },
  poster: { flex: 1, paddingHorizontal: spacing.xl },
  eyebrow: { color: '#E9E4D2', fontFamily: 'Nunito_500Medium', fontSize: 11, letterSpacing: 1.5, marginBottom: spacing.xs, textTransform: 'uppercase' },
  h1: { color: '#FFFFFF', fontFamily: 'Fraunces_500Medium', fontSize: 30, marginBottom: spacing.lg },
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  statN: { color: '#FFFFFF', fontFamily: 'Fraunces_500Medium', fontSize: 28 },
  statL: { color: '#E9E4D2', fontFamily: 'Nunito_400Regular', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },
  mvpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    borderRadius: radius.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingRight: spacing.md,
    marginBottom: spacing.lg,
  },
  mvpText: { color: '#FFFFFF', fontFamily: 'Nunito_500Medium', fontSize: 12 },
});
