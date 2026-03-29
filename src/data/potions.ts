import type { Potion } from '../types'

export const BEGINNER_POTION: Potion = {
  id: 'beginner-potion',
  name: 'Beginner Potion',
  description: 'A gift for new rampagers. Grants 10,000× luck for 1 roll.',
  luckMultiplier: 10000,
  rollsRemaining: 1,
  type: 'luck',
}

// ─── Shop potions (available in tutorial / future shop) ──────────────────────

// Elixir of Wisdom is already in ALL_POTIONS below; these are the new additions.

// ─── Brewer-only potions (not available in shop, crafted via Brewer tab) ────
export const LOVE_POTION: Potion = {
  id: 'love-potion',
  name: 'Love Potion',
  description: 'Grants 50× luck for 100 rolls.',
  luckMultiplier: 50,
  rollsRemaining: 100,
  type: 'luck',
}

export const STARLIGHT_POTION: Potion = {
  id: 'starlight-potion',
  name: 'Starlight Potion',
  description: 'Grants 1,000× luck for 1 roll.',
  luckMultiplier: 1000,
  rollsRemaining: 1,
  type: 'luck',
}

export const ELIXIR_OF_INSANITY: Potion = {
  id: 'elixir-of-insanity',
  name: 'Elixir of Insanity',
  description: 'Skips 30,000 rolls, keeping the 10 rarest auras obtained.',
  luckMultiplier: 1,
  rollsRemaining: 1,
  type: 'supersonic',
  simulatedRolls: 30_000,
}

export const ELIXIR_OF_SONARIA: Potion = {
  id: 'elixir-of-sonaria',
  name: 'Elixir of Sonaria',
  description: 'Grants 1,000,000× luck for 1 roll.',
  luckMultiplier: 1_000_000,
  rollsRemaining: 1,
  type: 'luck',
}

export const ACCELERATION_POTION: Potion = {
  id: 'acceleration-potion',
  name: 'Acceleration Potion',
  description: 'Simulates 2,500 instant rolls. Keeps only the 10 rarest auras obtained.',
  luckMultiplier: 1,
  rollsRemaining: 1,
  type: 'supersonic',
  simulatedRolls: 2500,
}

export const ALL_POTIONS: Potion[] = [
  BEGINNER_POTION,
  {
    id: 'minor-luck-potion',
    name: 'Minor Luck Potion',
    description: 'Grants 10× luck for 5 rolls.',
    luckMultiplier: 10,
    rollsRemaining: 5,
    type: 'luck',
  },
  {
    id: 'angelic-potion',
    name: 'Angelic Potion',
    description: 'Grants 1,000× luck for 1 roll.',
    luckMultiplier: 1000,
    rollsRemaining: 1,
    type: 'luck',
  },
  {
    id: 'major-luck-potion',
    name: 'Major Luck Potion',
    description: 'Grants 1,000× luck for 3 rolls.',
    luckMultiplier: 1000,
    rollsRemaining: 3,
    type: 'luck',
  },
  {
    id: 'grand-luck-potion',
    name: 'Grand Luck Potion',
    description: 'Grants 100,000× luck for 1 roll.',
    luckMultiplier: 100000,
    rollsRemaining: 1,
    type: 'luck',
  },
  {
    id: 'supersonic-potion',
    name: 'Supersonic Potion',
    description: 'Simulates 25 rolls instantly. Keeps only the 10 rarest auras obtained.',
    luckMultiplier: 1,
    rollsRemaining: 1,
    type: 'supersonic',
    simulatedRolls: 25,
  },
  {
    id: 'portal-potion',
    name: 'Portal Potion',
    description: 'Simulates 1,000 rolls instantly. Keeps only the 10 rarest auras obtained.',
    luckMultiplier: 1,
    rollsRemaining: 1,
    type: 'portal',
    simulatedRolls: 1000,
  },
  {
    id: 'elixir-of-wisdom',
    name: 'Elixir of Wisdom',
    description: 'Grants 10,000× luck for 1 roll.',
    luckMultiplier: 10000,
    rollsRemaining: 1,
    type: 'luck',
  },
  {
    id: 'potion-of-enragement',
    name: 'Potion of Enragement',
    description: 'Multiplies roll speed by 75× for 3 minutes.',
    luckMultiplier: 1,
    rollsRemaining: 1,
    type: 'speed',
    speedMultiplier: 75,
    durationMs: 180_000,
  },
  {
    id: 'biome-changing-potion',
    name: 'Biome-Changing Potion',
    description: 'Activates a random biome (Starlight or Midnight) for 5 minutes, boosting certain aura drop rates.',
    luckMultiplier: 1,
    rollsRemaining: 1,
    type: 'biome',
  },
  {
    id: 'techno-potion',
    name: 'Techno Potion',
    description: '1,000× luck for 1 roll. May bonus-award Paranormal (1 in 100) or Absolute (1 in 2,000).',
    luckMultiplier: 1000,
    rollsRemaining: 1,
    type: 'techno',
    bonusAuraChances: [
      { auraId: 'paranormal', chance: 100 },
      { auraId: 'absolute',   chance: 2000 },
    ],
  },
]
