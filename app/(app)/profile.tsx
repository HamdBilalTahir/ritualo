import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '../../src/theme/ThemeContext';
import { radius, spacing } from '../../src/theme/tokens';
import { useAppState } from '../../src/context/AppStateContext';
import { AvatarCircle } from '../../src/components/AvatarCircle';

function SettingsRow({ icon, label, onPress, color }: { icon: keyof typeof Feather.glyphMap; label: string; onPress: () => void; color: string }) {
  const c = useColors();
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <View style={[styles.rowIcon, { backgroundColor: c.brandTertiary }]}>
        <Feather name={icon} size={16} color={color} />
      </View>
      <Text style={[styles.rowLabel, { color: c.onSurface }]}>{label}</Text>
      <Feather name="chevron-right" size={16} color={c.onSurfaceTertiary} />
    </Pressable>
  );
}

export default function Profile() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { family, members, activeMember, habitsFor, signOut } = useAppState();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.surface }} contentContainerStyle={{ paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.xxl, paddingHorizontal: spacing.lg }}>
      <Text style={[styles.h1, { color: c.onSurface }]}>{family?.forestName}</Text>
      <Text style={[styles.sub, { color: c.onSurfaceSecondary }]}>Invite code: {family?.inviteCode}</Text>

      <Text style={[styles.sectionTitle, { color: c.onSurface }]}>Family</Text>
      {members.map((m) => (
        <View key={m.id} style={[styles.memberRow, { backgroundColor: '#FFFFFF', borderColor: c.border }]}>
          <AvatarCircle uri={m.avatarUri} emoji={m.emoji} size={40} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.memberName, { color: c.onSurface }]}>
              {m.name} {m.id === activeMember?.id ? '(you)' : ''}
            </Text>
            <Text style={[styles.memberSub, { color: c.onSurfaceSecondary }]}>
              {m.role === 'kid' ? 'Kid mode' : 'Parent'} · {habitsFor(m.id).length} rituals
            </Text>
          </View>
        </View>
      ))}

      <Text style={[styles.sectionTitle, { color: c.onSurface }]}>Settings</Text>
      <View style={[styles.card, { backgroundColor: '#FFFFFF', borderColor: c.border }]}>
        <SettingsRow
          icon="plus-circle"
          label="Add a ritual"
          color={c.brandPrimary}
          onPress={() =>
            activeMember && router.push({ pathname: '/(setup)/habits', params: { memberId: activeMember.id } })
          }
        />
        <SettingsRow icon="users" label="Switch family member" color={c.brandPrimary} onPress={() => router.push('/(setup)/who-is-this')} />
        <SettingsRow icon="user-plus" label="Invite a family member" color={c.brandPrimary} onPress={() => router.push('/(setup)/invite')} />
        <SettingsRow
          icon="log-out"
          label="Sign out"
          color={c.error}
          onPress={async () => {
            await signOut();
            router.replace('/');
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  h1: { fontFamily: 'Fraunces_500Medium', fontSize: 22 },
  sub: { fontFamily: 'Nunito_400Regular', fontSize: 12.5, marginTop: 2, marginBottom: spacing.xl },
  sectionTitle: { fontFamily: 'Nunito_500Medium', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.sm, marginTop: spacing.md },
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm },
  memberName: { fontFamily: 'Nunito_500Medium', fontSize: 14 },
  memberSub: { fontFamily: 'Nunito_400Regular', fontSize: 11.5, marginTop: 2 },
  card: { borderWidth: 1, borderRadius: radius.lg, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  rowIcon: { width: 32, height: 32, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, fontFamily: 'Nunito_500Medium', fontSize: 13.5 },
});
