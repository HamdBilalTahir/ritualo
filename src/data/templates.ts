export type GrowthType = 'mushroom' | 'firefly' | 'tree' | 'creature';

export interface HabitTemplate {
  id: string;
  label: string;
  emoji: string;
  growthLabel: string;
  growthType: GrowthType;
  stars: number;
}

export const kidHabitTemplates: HabitTemplate[] = [
  { id: 'brush-teeth', label: 'Brush teeth', emoji: '🦷', growthLabel: 'a firefly lit up the grove', growthType: 'firefly', stars: 10 },
  { id: 'read-20', label: 'Read 20 min', emoji: '📖', growthLabel: 'a mushroom sprouted', growthType: 'mushroom', stars: 10 },
  { id: 'tidy-room', label: 'Tidy room', emoji: '🧸', growthLabel: 'a woodland den appeared', growthType: 'creature', stars: 10 },
  { id: 'homework', label: 'Homework', emoji: '✏️', growthLabel: 'a new path opened', growthType: 'tree', stars: 10 },
  { id: 'no-screens', label: 'Screen-free hour', emoji: '🌤️', growthLabel: 'a clearing opened up', growthType: 'tree', stars: 10 },
  { id: 'kindness', label: 'One kind thing', emoji: '💛', growthLabel: 'a flower bloomed', growthType: 'mushroom', stars: 10 },
];

export const parentHabitTemplates: HabitTemplate[] = [
  { id: 'morning-walk', label: 'Morning walk', emoji: '🧘', growthLabel: 'a new pine tree appeared', growthType: 'tree', stars: 10 },
  { id: 'read-book', label: 'Read a book', emoji: '📚', growthLabel: 'a mushroom sprouted by the stream', growthType: 'mushroom', stars: 10 },
  { id: 'workout', label: 'Workout', emoji: '💪', growthLabel: 'a waterfall appeared', growthType: 'creature', stars: 10 },
  { id: 'sleep-on-time', label: 'Sleep on time', emoji: '🌙', growthLabel: 'stars lit up the sky', growthType: 'firefly', stars: 10 },
  { id: 'drink-water', label: 'Drink water', emoji: '💧', growthLabel: 'a pond filled with lilies', growthType: 'mushroom', stars: 10 },
  { id: 'meditate', label: 'Meditate', emoji: '🍃', growthLabel: 'moss grew soft and green', growthType: 'tree', stars: 10 },
];

export function templatesFor(role: 'parent' | 'kid') {
  return role === 'kid' ? kidHabitTemplates : parentHabitTemplates;
}

export const growthTypeOptions: { type: GrowthType; label: string; emoji: string }[] = [
  { type: 'mushroom', label: 'Mushroom', emoji: '🍄' },
  { type: 'firefly', label: 'Firefly', emoji: '✨' },
  { type: 'tree', label: 'Tree', emoji: '🌳' },
  { type: 'creature', label: 'Woodland friend', emoji: '🦊' },
];

const defaultGrowthLabels: Record<GrowthType, string> = {
  mushroom: 'a mushroom sprouted',
  firefly: 'a firefly lit up the grove',
  tree: 'a new tree grew',
  creature: 'a new woodland friend appeared',
};

export function defaultGrowthLabelFor(growthType: GrowthType) {
  return defaultGrowthLabels[growthType];
}
