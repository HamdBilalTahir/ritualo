import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAppState } from '../../src/context/AppStateContext';
import { ModeProvider, useColors } from '../../src/theme/ThemeContext';
import { FoxCompanion, FoxMood } from '../../src/components/FoxCompanion';

function TabsInner() {
  const c = useColors();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.brandPrimary,
        tabBarInactiveTintColor: c.onSurfaceTertiary,
        tabBarStyle: { backgroundColor: c.surface, borderTopColor: c.border },
        tabBarLabelStyle: { fontFamily: 'Nunito_500Medium', fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ title: 'Forest', tabBarIcon: ({ color, size }) => <Feather name="home" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="feed"
        options={{ title: 'Feed', tabBarIcon: ({ color, size }) => <Feather name="users" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="recap"
        options={{ title: 'Recap', tabBarIcon: ({ color, size }) => <Feather name="award" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Feather name="user" color={color} size={size} /> }}
      />
    </Tabs>
  );
}

export default function AppLayout() {
  const { activeMember, completions } = useAppState();
  const mode = activeMember?.role === 'kid' ? 'kid' : 'parent';

  // The fox is our resident assistant: it celebrates whenever *anyone* in the
  // family completes a habit, from wherever in the app you happen to be.
  const [mood, setMood] = useState<FoxMood>('idle');
  const lastCount = useRef(completions.length);
  useEffect(() => {
    if (completions.length > lastCount.current) {
      setMood('celebrate');
      const t = setTimeout(() => setMood('idle'), 2600);
      lastCount.current = completions.length;
      return () => clearTimeout(t);
    }
    lastCount.current = completions.length;
  }, [completions.length]);

  return (
    <ModeProvider mode={mode}>
      <View style={{ flex: 1 }}>
        <TabsInner />
        <View style={styles.foxOverlay} pointerEvents="box-none">
          <FoxCompanion mood={mood} size={84} />
        </View>
      </View>
    </ModeProvider>
  );
}

const styles = StyleSheet.create({
  foxOverlay: {
    position: 'absolute',
    right: 12,
    bottom: 84,
    alignItems: 'flex-end',
  },
});
