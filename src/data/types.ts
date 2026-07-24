import { GrowthType } from './templates';

export type Role = 'parent' | 'kid';

export interface Member {
  id: string;
  name: string;
  role: Role;
  emoji: string;
  avatarUri?: string;
}

export interface Habit {
  id: string;
  memberId: string;
  label: string;
  emoji: string;
  growthLabel: string; // e.g. "a new pine tree appeared"
  growthType: GrowthType;
  stars: number;
}

export interface Completion {
  id: string;
  habitId: string;
  memberId: string;
  completedAt: string; // ISO
  reactions: string[]; // emoji reactions from other members
}

export interface Family {
  id: string;
  forestName: string;
  inviteCode: string;
}

export type ForestStageName = 'Seed' | 'Sprout' | 'Sapling' | 'Grove' | 'Glowing Grove';

export interface AuthUser {
  email: string;
  name: string;
}
