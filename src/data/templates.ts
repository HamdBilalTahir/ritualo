export interface HabitTemplate {
  id: string;
  label: string;
  emoji: string;
  growthLabel: string;
  stars: number;
}

export const kidHabitTemplates: HabitTemplate[] = [
  { id: 'brush-teeth', label: 'Brush teeth', emoji: '🦷', growthLabel: 'a firefly lit up the grove', stars: 10 },
  { id: 'read-20', label: 'Read 20 min', emoji: '📖', growthLabel: 'a mushroom sprouted', stars: 10 },
  { id: 'tidy-room', label: 'Tidy room', emoji: '🧸', growthLabel: 'a woodland den appeared', stars: 10 },
  { id: 'homework', label: 'Homework', emoji: '✏️', growthLabel: 'a new path opened', stars: 10 },
  { id: 'no-screens', label: 'Screen-free hour', emoji: '🌤️', growthLabel: 'a clearing opened up', stars: 10 },
  { id: 'kindness', label: 'One kind thing', emoji: '💛', growthLabel: 'a flower bloomed', stars: 10 },
];

export const parentHabitTemplates: HabitTemplate[] = [
  { id: 'morning-walk', label: 'Morning walk', emoji: '🧘', growthLabel: 'a new pine tree appeared', stars: 10 },
  { id: 'read-book', label: 'Read a book', emoji: '📚', growthLabel: 'a mushroom sprouted by the stream', stars: 10 },
  { id: 'workout', label: 'Workout', emoji: '💪', growthLabel: 'a waterfall appeared', stars: 10 },
  { id: 'sleep-on-time', label: 'Sleep on time', emoji: '🌙', growthLabel: 'stars lit up the sky', stars: 10 },
  { id: 'drink-water', label: 'Drink water', emoji: '💧', growthLabel: 'a pond filled with lilies', stars: 10 },
  { id: 'meditate', label: 'Meditate', emoji: '🍃', growthLabel: 'moss grew soft and green', stars: 10 },
];

export function templatesFor(role: 'parent' | 'kid') {
  return role === 'kid' ? kidHabitTemplates : parentHabitTemplates;
}
