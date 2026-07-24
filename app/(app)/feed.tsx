import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../../src/theme/ThemeContext';
import { radius, spacing } from '../../src/theme/tokens';
import { useAppState } from '../../src/context/AppStateContext';
import { AvatarCircle } from '../../src/components/AvatarCircle';
import { timeAgo } from '../../src/utils/time';

const REACTIONS = ['🙌', '❤️', '🎉'];

export default function Feed() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { completions, habits, members, reactToCompletion } = useAppState();

  return (
    <View style={{ flex: 1, backgroundColor: c.surface }}>
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: insets.top + spacing.lg }}>
        <Text style={[styles.h1, { color: c.onSurface }]}>The Grove</Text>
        <Text style={[styles.sub, { color: c.onSurfaceSecondary }]}>This week's rituals</Text>
      </View>

      {completions.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ fontSize: 40, marginBottom: spacing.sm }}>🌙</Text>
          <Text style={[styles.emptyText, { color: c.onSurfaceSecondary }]}>
            The forest is quiet today. Complete a habit to light it up!
          </Text>
        </View>
      ) : (
        <FlatList
          data={completions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: insets.bottom + spacing.xxl }}
          renderItem={({ item, index }) => {
            const habit = habits.find((h) => h.id === item.habitId);
            const member = members.find((m) => m.id === item.memberId);
            if (!habit || !member) return null;
            return (
              <View
                style={[
                  styles.card,
                  { backgroundColor: '#FFFFFF', borderColor: c.border, transform: [{ rotate: index % 2 === 0 ? '-0.6deg' : '0.5deg' }] },
                ]}
              >
                <AvatarCircle uri={member.avatarUri} emoji={member.emoji} size={36} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardTitle, { color: c.onSurface }]}>
                    {member.name} {member.role === 'kid' ? '' : 'finished'} {habit.label}
                  </Text>
                  <Text style={[styles.cardSub, { color: c.onSurfaceSecondary }]}>
                    +{habit.stars} stars · {habit.growthLabel}
                  </Text>
                  <View style={styles.reacts}>
                    {REACTIONS.map((r) => (
                      <Pressable
                        key={r}
                        onPress={() => reactToCompletion(item.id, r)}
                        style={[styles.reactChip, { backgroundColor: c.surfaceSecondary }]}
                      >
                        <Text style={{ fontSize: 11 }}>
                          {r} {item.reactions.filter((x) => x === r).length || ''}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
                <Text style={[styles.time, { color: c.onSurfaceTertiary }]}>{timeAgo(item.completedAt)}</Text>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  h1: { fontFamily: 'Fraunces_500Medium', fontSize: 22 },
  sub: { fontFamily: 'Nunito_400Regular', fontSize: 12.5, marginTop: 2, marginBottom: spacing.sm },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl },
  emptyText: { fontFamily: 'Nunito_400Regular', fontSize: 14, textAlign: 'center', lineHeight: 20 },
  card: {
    flexDirection: 'row',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardTitle: { fontFamily: 'Nunito_500Medium', fontSize: 13 },
  cardSub: { fontFamily: 'Nunito_400Regular', fontSize: 11.5, marginTop: 2, marginBottom: spacing.sm, lineHeight: 16 },
  reacts: { flexDirection: 'row', gap: spacing.xs },
  reactChip: { borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  time: { fontFamily: 'Nunito_400Regular', fontSize: 10 },
});
