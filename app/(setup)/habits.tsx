import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../../src/theme/ThemeContext';
import { radius, spacing } from '../../src/theme/tokens';
import { useAppState } from '../../src/context/AppStateContext';
import { templatesFor, growthTypeOptions, defaultGrowthLabelFor, GrowthType } from '../../src/data/templates';
import { Button } from '../../src/components/Button';
import { AvatarCircle } from '../../src/components/AvatarCircle';
import { TextField } from '../../src/components/TextField';
import { EmojiPicker } from '../../src/components/EmojiPicker';

const MAX_HABITS = 3;

interface Draft {
  key: string;
  label: string;
  emoji: string;
  growthLabel: string;
  growthType: GrowthType;
  stars: number;
}

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
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(false);

  const [customOpen, setCustomOpen] = useState(false);
  const [customLabel, setCustomLabel] = useState('');
  const [customEmoji, setCustomEmoji] = useState('🌟');
  const [customGrowthType, setCustomGrowthType] = useState<GrowthType>('mushroom');

  const member = wizardQueue[step];
  const isLast = step >= wizardQueue.length - 1;
  const nextMember = !isLast ? wizardQueue[step + 1] : null;
  const templates = templatesFor(member?.role ?? 'parent');
  const atCap = drafts.length >= MAX_HABITS;

  const resetCustomForm = () => {
    setCustomLabel('');
    setCustomEmoji('🌟');
    setCustomGrowthType('mushroom');
    setCustomOpen(false);
  };

  const toggleTemplate = (id: string) => {
    setDrafts((prev) => {
      if (prev.some((d) => d.key === id)) return prev.filter((d) => d.key !== id);
      if (prev.length >= MAX_HABITS) return prev;
      const t = templates.find((x) => x.id === id)!;
      return [...prev, { key: t.id, label: t.label, emoji: t.emoji, growthLabel: t.growthLabel, growthType: t.growthType, stars: t.stars }];
    });
  };

  const addCustom = () => {
    if (!customLabel.trim() || atCap) return;
    setDrafts((prev) => [
      ...prev,
      {
        key: `custom_${Date.now()}`,
        label: customLabel.trim(),
        emoji: customEmoji,
        growthLabel: defaultGrowthLabelFor(customGrowthType),
        growthType: customGrowthType,
        stars: 10,
      },
    ]);
    resetCustomForm();
  };

  const removeDraft = (key: string) => setDrafts((prev) => prev.filter((d) => d.key !== key));

  const submit = async () => {
    if (!member || drafts.length === 0) return;
    setLoading(true);
    for (const d of drafts) {
      await addHabit(member.id, d.label, d.emoji, d.growthLabel, d.growthType, d.stars);
    }
    setLoading(false);
    setDrafts([]);
    resetCustomForm();
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
              Member {step + 1} of {wizardQueue.length} · pick 1–{MAX_HABITS}
            </Text>
          </View>
        </View>

        {drafts.length > 0 && (
          <View style={styles.selectedRow}>
            {drafts.map((d) => (
              <Pressable
                key={d.key}
                onPress={() => removeDraft(d.key)}
                style={[styles.selectedChip, { backgroundColor: c.brandTertiary, borderColor: c.brandPrimary }]}
              >
                <Text style={{ fontSize: 16 }}>{d.emoji}</Text>
                <Text style={[styles.chipLabel, { color: c.onSurface }]}>{d.label}</Text>
                <Text style={{ color: c.onSurfaceSecondary, fontSize: 13 }}>✕</Text>
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.grid}>
          {templates.map((t) => {
            const isSelected = drafts.some((d) => d.key === t.id);
            return (
              <Pressable
                key={t.id}
                onPress={() => toggleTemplate(t.id)}
                disabled={!isSelected && atCap}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isSelected ? c.brandTertiary : '#FFFFFF',
                    borderColor: isSelected ? c.brandPrimary : c.border,
                    opacity: !isSelected && atCap ? 0.4 : 1,
                  },
                ]}
              >
                <Text style={{ fontSize: 20 }}>{t.emoji}</Text>
                <Text style={[styles.chipLabel, { color: c.onSurface }]}>{t.label}</Text>
              </Pressable>
            );
          })}

          <Pressable
            onPress={() => !atCap && setCustomOpen((v) => !v)}
            disabled={atCap}
            style={[
              styles.chip,
              styles.customChip,
              { borderColor: c.brandPrimary, opacity: atCap ? 0.4 : 1 },
            ]}
          >
            <Text style={{ fontSize: 20 }}>➕</Text>
            <Text style={[styles.chipLabel, { color: c.brandPrimary }]}>Create your own</Text>
          </Pressable>
        </View>

        {customOpen && (
          <View style={[styles.customPanel, { backgroundColor: c.surfaceSecondary, borderColor: c.border }]}>
            <TextField
              label="Ritual name"
              placeholder="e.g. Practice piano"
              value={customLabel}
              onChangeText={setCustomLabel}
              autoCapitalize="sentences"
            />

            <Text style={[styles.label, { color: c.onSurface }]}>Icon</Text>
            <View style={{ marginBottom: spacing.lg }}>
              <EmojiPicker value={customEmoji} onChange={setCustomEmoji} />
            </View>

            <Text style={[styles.label, { color: c.onSurface }]}>What grows in the forest?</Text>
            <View style={styles.growthRow}>
              {growthTypeOptions.map((g) => (
                <Pressable
                  key={g.type}
                  onPress={() => setCustomGrowthType(g.type)}
                  style={[
                    styles.growthPill,
                    {
                      backgroundColor: customGrowthType === g.type ? c.brandTertiary : '#FFFFFF',
                      borderColor: customGrowthType === g.type ? c.brandPrimary : c.border,
                    },
                  ]}
                >
                  <Text style={{ fontSize: 16 }}>{g.emoji}</Text>
                  <Text style={[styles.chipLabel, { color: c.onSurface }]}>{g.label}</Text>
                </Pressable>
              ))}
            </View>

            <Button label="Add ritual" onPress={addCustom} disabled={!customLabel.trim()} style={{ marginTop: spacing.md }} />
          </View>
        )}
      </ScrollView>

      <View style={{ paddingHorizontal: spacing.xl, paddingBottom: insets.bottom + spacing.lg }}>
        <Button
          label={
            drafts.length === 0
              ? 'Pick at least one'
              : isLast
              ? `Start growing (${drafts.length})`
              : `Next: ${nextMember?.name}`
          }
          onPress={submit}
          disabled={drafts.length === 0}
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
  selectedRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1.5,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
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
  customChip: { borderStyle: 'dashed', backgroundColor: 'transparent' },
  chipLabel: { fontFamily: 'Nunito_500Medium', fontSize: 13 },
  customPanel: { borderWidth: 1.5, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.lg },
  label: { fontFamily: 'Nunito_500Medium', fontSize: 13, marginBottom: spacing.sm },
  growthRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  growthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1.5,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
});
