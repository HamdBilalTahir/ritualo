import { Completion, Habit } from './types';
import { GrowthType } from './templates';

export const FOREST_WORLD = { width: 2200, height: 1400 };

const CREATURE_SPRITES = ['🦊', '🦉', '🐿️', '🦔'];

const SPRITE_FOR: Record<GrowthType, string | null> = {
  mushroom: '🍄',
  firefly: '✨',
  tree: '🌳',
  creature: null, // picked per-item from CREATURE_SPRITES
};

// Rough vertical "cross-section of the forest" bands, top to bottom:
// sky (fireflies) -> canopy (trees) -> ground (creatures) -> pond edge (mushrooms).
const BANDS: Record<GrowthType, { yMin: number; yMax: number }> = {
  firefly: { yMin: 0.04, yMax: 0.32 },
  tree: { yMin: 0.16, yMax: 0.5 },
  creature: { yMin: 0.42, yMax: 0.72 },
  mushroom: { yMin: 0.62, yMax: 0.94 },
};

function hashString(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function frac(n: number) {
  return n - Math.floor(n);
}

/** Deterministic pseudo-random in [0, 1), stable for a given (seed, salt) pair. */
function rand(seed: string, salt: number) {
  return frac(Math.sin(hashString(seed) + salt * 999.123) * 43758.5453);
}

export interface ForestItem {
  id: string;
  habitId: string;
  growthType: GrowthType;
  sprite: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

/**
 * Every completion gets one permanently-placed sprite. Position is a pure
 * function of (completion id, its index among same-growth-type items in
 * completion order), so existing items never move as new ones are added —
 * the forest only ever grows, it doesn't reshuffle.
 */
export function layoutForest(completions: Completion[], habits: Habit[]): ForestItem[] {
  const ordered = [...completions].sort((a, b) => a.completedAt.localeCompare(b.completedAt));
  const perTypeIndex: Record<GrowthType, number> = { mushroom: 0, firefly: 0, tree: 0, creature: 0 };
  const items: ForestItem[] = [];

  for (const c of ordered) {
    const habit = habits.find((h) => h.id === c.habitId);
    if (!habit) continue;
    const type = habit.growthType;
    const i = perTypeIndex[type]++;
    const band = BANDS[type];

    const xFrac = frac(i * 0.6180339887 + rand(c.id, 1) * 0.12);
    const yFrac = band.yMin + rand(c.id, 2) * (band.yMax - band.yMin);

    const sprite = SPRITE_FOR[type] ?? CREATURE_SPRITES[Math.floor(rand(c.id, 3) * CREATURE_SPRITES.length)];

    items.push({
      id: c.id,
      habitId: c.habitId,
      growthType: type,
      sprite,
      x: 0.04 * FOREST_WORLD.width + xFrac * 0.92 * FOREST_WORLD.width,
      y: yFrac * FOREST_WORLD.height,
      scale: 0.85 + rand(c.id, 4) * 0.4,
      rotation: -8 + rand(c.id, 5) * 16,
    });
  }

  return items;
}
