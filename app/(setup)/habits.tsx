import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../../src/theme/ThemeContext';
import { radius, spacing } from '../../src/theme/tokens';
import { useAppState } from '../../src/context/AppStateContext';
import { templatesFor } from '../../src/data/templates';
import { Button } from '../../src/components/Button';

export default function HabitSetup() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { activeMember, addHabit } = useAppState();
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const templates = templatesFor(activeMember?.role ?? 'parent');

  const toggle = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const submit = async () => {
    if (!activeMember || selected.length === 0) return;
    setLoading(true);
    for (const id of selected) {
      const t = templates.find((x) => x.id === id)!;
      await addHabit(activeMember.id, t.label, t.emoji, t.growthLabel, t.stars);
    }
    setLoading(false);
    router.replace('/(app)/home');
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.surface }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + spacing.xl,
          paddingBottom: insets.bottom + spacing.xxl,
          paddingHorizontal: spacing.xl,
        }}
      >
        <Text style={styles.critter}>🌱</Text>
        <Text style={[styles.h1, { color: c.onSurface }]}>Let's plant some seeds, {activeMember?.name}</Text>
        <Text style={[styles.p, { color: c.onSurfaceSecondary }]}>Pick 1 to 3 daily rituals to start with.</Text>

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
                <Text style={{ fontSize: 26 }}>{t.emoji}</Text>
                <Text style={[styles.chipLabel, { color: c.onSurface }]}>{t.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: spacing.xl, paddingBottom: insets.bottom + spacing.lg }}>
        <Button
          label={selected.length === 0 ? 'Pick at least one' : `Start growing (${selected.length})`}
          onPress={submit}
          disabled={selected.length === 0}
          loading={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  critter: { fontSize: 40, marginBottom: spacing.md },
  h1: { fontFamily: 'Fraunces_500Medium', fontSize: 22, marginBottom: spacing.xs },
  p: { fontFamily: 'Nunito_400Regular', fontSize: 13.5, marginBottom: spacing.xl, lineHeight: 19 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  chip: {
    width: '47%',
    borderWidth: 1.5,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  chipLabel: { fontFamily: 'Nunito_500Medium', fontSize: 13, textAlign: 'center' },
});
