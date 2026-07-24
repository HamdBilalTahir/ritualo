import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthUser, Completion, Family, Habit, Member, ForestStageName } from '../data/types';
import { GrowthType } from '../data/templates';

const STORAGE_KEY = 'ritualo:v1';

interface PersistedState {
  authUser: AuthUser | null;
  family: Family | null;
  members: Member[];
  habits: Habit[];
  completions: Completion[];
  activeMemberId: string | null;
}

const initialState: PersistedState = {
  authUser: null,
  family: null,
  members: [],
  habits: [],
  completions: [],
  activeMemberId: null,
};

function genId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function genInviteCode() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 6; i++) out += letters[Math.floor(Math.random() * letters.length)];
  return out;
}

export const FOREST_STAGES: { name: ForestStageName; threshold: number }[] = [
  { name: 'Seed', threshold: 0 },
  { name: 'Sprout', threshold: 5 },
  { name: 'Sapling', threshold: 15 },
  { name: 'Grove', threshold: 30 },
  { name: 'Glowing Grove', threshold: 50 },
];

function stageFor(totalCompletions: number) {
  let current = FOREST_STAGES[0];
  for (const s of FOREST_STAGES) {
    if (totalCompletions >= s.threshold) current = s;
  }
  const idx = FOREST_STAGES.indexOf(current);
  const next = FOREST_STAGES[idx + 1];
  return {
    stage: current.name,
    next: next ?? null,
    toNext: next ? next.threshold - totalCompletions : 0,
  };
}

interface AppStateValue extends PersistedState {
  loading: boolean;
  isAuthenticated: boolean;
  hasFamily: boolean;
  activeMember: Member | null;
  forest: ReturnType<typeof stageFor>;
  signUp: (email: string, name: string) => Promise<void>;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  createFamily: (forestName: string, parentName: string, emoji: string) => Promise<void>;
  joinFamily: (code: string, memberName: string, role: 'parent' | 'kid', emoji: string) => Promise<void>;
  addMember: (name: string, role: 'parent' | 'kid', emoji: string) => Promise<void>;
  setActiveMember: (memberId: string) => void;
  addHabit: (
    memberId: string,
    label: string,
    emoji: string,
    growthLabel: string,
    growthType: GrowthType,
    stars: number
  ) => Promise<void>;
  completeHabit: (habitId: string) => Promise<void>;
  isCompletedToday: (habitId: string) => boolean;
  habitsFor: (memberId: string) => Habit[];
  reactToCompletion: (completionId: string, emoji: string) => Promise<void>;
  weeklyStats: () => { totalCompletions: number; mvpMemberId: string | null };
  streakFor: (habitId: string) => number;
  growthCounts: () => Record<GrowthType, number>;
  membersMissingHabits: () => Member[];
}

const AppStateContext = createContext<AppStateValue | null>(null);

function isToday(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
  );
}

function startOfWeek() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day;
  const start = new Date(now.setDate(diff));
  start.setHours(0, 0, 0, 0);
  return start;
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setState(JSON.parse(raw));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = useCallback((next: PersistedState) => {
    setState(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const signUp = useCallback(
    async (email: string, name: string) => {
      persist({ ...state, authUser: { email, name } });
    },
    [state, persist]
  );

  const signIn = useCallback(
    async (email: string) => {
      persist({ ...state, authUser: { email, name: state.authUser?.name ?? email.split('@')[0] } });
    },
    [state, persist]
  );

  const signOut = useCallback(async () => {
    persist(initialState);
  }, [persist]);

  const createFamily = useCallback(
    async (forestName: string, parentName: string, emoji: string) => {
      const family: Family = { id: genId('fam'), forestName, inviteCode: genInviteCode() };
      const member: Member = { id: genId('mem'), name: parentName, role: 'parent', emoji };
      persist({ ...state, family, members: [member], activeMemberId: member.id });
    },
    [state, persist]
  );

  const joinFamily = useCallback(
    async (code: string, memberName: string, role: 'parent' | 'kid', emoji: string) => {
      // Demo mode: any 6-char code creates/joins a locally-simulated shared family.
      const family: Family = state.family ?? { id: genId('fam'), forestName: 'The Family Forest', inviteCode: code.toUpperCase() };
      const member: Member = { id: genId('mem'), name: memberName, role, emoji };
      persist({ ...state, family, members: [...state.members, member], activeMemberId: member.id });
    },
    [state, persist]
  );

  const addMember = useCallback(
    async (name: string, role: 'parent' | 'kid', emoji: string) => {
      const member: Member = { id: genId('mem'), name, role, emoji };
      persist({ ...state, members: [...state.members, member] });
    },
    [state, persist]
  );

  const setActiveMember = useCallback(
    (memberId: string) => {
      persist({ ...state, activeMemberId: memberId });
    },
    [state, persist]
  );

  const addHabit = useCallback(
    async (
      memberId: string,
      label: string,
      emoji: string,
      growthLabel: string,
      growthType: GrowthType,
      stars: number
    ) => {
      const habit: Habit = { id: genId('habit'), memberId, label, emoji, growthLabel, growthType, stars };
      persist({ ...state, habits: [...state.habits, habit] });
    },
    [state, persist]
  );

  const isCompletedToday = useCallback(
    (habitId: string) => state.completions.some((c) => c.habitId === habitId && isToday(c.completedAt)),
    [state.completions]
  );

  const completeHabit = useCallback(
    async (habitId: string) => {
      const habit = state.habits.find((h) => h.id === habitId);
      if (!habit) return;
      if (isCompletedToday(habitId)) return;
      const completion: Completion = {
        id: genId('comp'),
        habitId,
        memberId: habit.memberId,
        completedAt: new Date().toISOString(),
        reactions: [],
      };
      persist({ ...state, completions: [completion, ...state.completions] });
    },
    [state, persist, isCompletedToday]
  );

  const reactToCompletion = useCallback(
    async (completionId: string, emoji: string) => {
      persist({
        ...state,
        completions: state.completions.map((c) =>
          c.id === completionId ? { ...c, reactions: [...c.reactions, emoji] } : c
        ),
      });
    },
    [state, persist]
  );

  const habitsFor = useCallback((memberId: string) => state.habits.filter((h) => h.memberId === memberId), [
    state.habits,
  ]);

  const weeklyStats = useCallback(() => {
    const start = startOfWeek();
    const inWeek = state.completions.filter((c) => new Date(c.completedAt) >= start);
    const counts: Record<string, number> = {};
    for (const c of inWeek) counts[c.memberId] = (counts[c.memberId] ?? 0) + 1;
    let mvpMemberId: string | null = null;
    let max = 0;
    for (const [memberId, count] of Object.entries(counts)) {
      if (count > max) {
        max = count;
        mvpMemberId = memberId;
      }
    }
    return { totalCompletions: inWeek.length, mvpMemberId };
  }, [state.completions]);

  const streakFor = useCallback(
    (habitId: string) => {
      const days = new Set(
        state.completions
          .filter((c) => c.habitId === habitId)
          .map((c) => {
            const d = new Date(c.completedAt);
            return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
          })
      );
      let streak = 0;
      const cursor = new Date();
      // A streak counts today only if already completed; otherwise starts checking from yesterday.
      if (!days.has(`${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`)) {
        cursor.setDate(cursor.getDate() - 1);
      }
      while (days.has(`${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`)) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
      }
      return streak;
    },
    [state.completions]
  );

  const growthCounts = useCallback((): Record<GrowthType, number> => {
    const counts: Record<GrowthType, number> = { mushroom: 0, firefly: 0, tree: 0, creature: 0 };
    for (const c of state.completions) {
      const habit = state.habits.find((h) => h.id === c.habitId);
      if (habit) counts[habit.growthType] += 1;
    }
    return counts;
  }, [state.completions, state.habits]);

  const membersMissingHabits = useCallback(
    () => state.members.filter((m) => !state.habits.some((h) => h.memberId === m.id)),
    [state.members, state.habits]
  );

  const activeMember = useMemo(
    () => state.members.find((m) => m.id === state.activeMemberId) ?? null,
    [state.members, state.activeMemberId]
  );

  const forest = useMemo(() => stageFor(state.completions.length), [state.completions.length]);

  const value: AppStateValue = {
    ...state,
    loading,
    isAuthenticated: !!state.authUser,
    hasFamily: !!state.family,
    activeMember,
    forest,
    signUp,
    signIn,
    signOut,
    createFamily,
    joinFamily,
    addMember,
    setActiveMember,
    addHabit,
    completeHabit,
    isCompletedToday,
    habitsFor,
    reactToCompletion,
    weeklyStats,
    streakFor,
    growthCounts,
    membersMissingHabits,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
