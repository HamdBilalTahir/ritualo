import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../../src/theme/ThemeContext';
import { radius, spacing } from '../../src/theme/tokens';
import { useAppState } from '../../src/context/AppStateContext';
import { templatesFor } from '../../src/data/templates';
import { Button } from '../../src/components/Button';
import { AvatarCircle } from '../../src/components/AvatarCircle';

export default function HabitSetup() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { members, activeMember, addHabit, membersMissingHabits } = useAppState();
  const { memberId: memberIdParam } = useLocalSearchParams<{ memberId?: string }>();

  // Single-member mode (e.g. "Add a ritual" from Profile) vs. the full-family
  // setup wizard that runs right after creating/joining a forest.
  const wizardQueue = useMemo(() => {
    if (memberIdParam) {
      const m = members.find((x) => x.id === memberIdParam);
      return m ? [m] : [];
    }
    const missing = membersMissingHabits();
    return missing.length > 0 ? missing : activeMember ? [activeMember] : [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const member = wizardQueue[step];
  const isLast = step >= wizardQueue.length - 1;
  const nextMember = !isLast ? wizardQueue[step + 1] : null;
  const templates = templatesFor(member?.role ?? 'parent');

  const toggle = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const submit = async () => {
    if (!member || selected.length === 0) return;
    setLoading(true);
    for (const id of selected) {
      const t = templates.find((x) => x.id === id)!;
      await addHabit(member.id, t.label, t.emoji, t.growthLabel, t.growthType, t.stars);
    }
    setLoading(false);
    setSelected([]);
    if (isLast) {
      router.replace('/(app)/home');
    } else {
      setStep((s) => s + 1);
    }
  };

  if (!member) {
    return (
      <View style={{ flex: 1, backgroundColor: c.surface, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: c.onSurfaceSecondary, fontFamily: 'Nunito_400Regular' }}>Nothing to set up.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.surface }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + spacing.xl,
          paddingBottom: insets.bottom + spacing.xxl,
          paddingHorizontal: spacing.xl,
        }}
      >
        <View style={styles.header}>
          <AvatarCircle uri={member.avatarUri} emoji={member.emoji} size={44} />
          <View>
            <Text style={[styles.h1, { color: c.onSurface }]}>{member.name}'s rituals</Text>
            <Text style={[styles.p, { color: c.onSurfaceSecondary }]}>
              Member {step + 1} of {wizardQueue.length} · pick 1–3
            </Text>
          </View>
        </View>

        <View style={styles.grid}>
          {templates.map((t) => {
            const isSelected = selected.includes(t.id);
            return (
              <Pressable
                key={t.id}
                onPress={() => toggle(t.id)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isSelected ? c.brandTertiary : '#FFFFFF',
                    borderColor: isSelected ? c.brandPrimary : c.border,
                  },
                ]}
              >
                <Text style={{ fontSize: 20 }}>{t.emoji}</Text>
                <Text style={[styles.chipLabel, { color: c.onSurface }]}>{t.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: spacing.xl, paddingBottom: insets.bottom + spacing.lg }}>
        <Button
          label={
            selected.length === 0
              ? 'Pick at least one'
              : isLast
              ? `Start growing (${selected.length})`
              : `Next: ${nextMember?.name}`
          }
          onPress={submit}
          disabled={selected.length === 0}
          loading={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  h1: { fontFamily: 'Fraunces_500Medium', fontSize: 20 },
  p: { fontFamily: 'Nunito_400Regular', fontSize: 12.5, marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1.5,
    borderRadius: radius.pill,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  chipLabel: { fontFamily: 'Nunito_500Medium', fontSize: 13 },
});
