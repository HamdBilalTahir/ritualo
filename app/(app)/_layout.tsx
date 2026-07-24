import React from 'react';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAppState } from '../../src/context/AppStateContext';
import { ModeProvider, useColors } from '../../src/theme/ThemeContext';

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
  const { activeMember } = useAppState();
  const mode = activeMember?.role === 'kid' ? 'kid' : 'parent';
  return (
    <ModeProvider mode={mode}>
      <TabsInner />
    </ModeProvider>
  );
}
