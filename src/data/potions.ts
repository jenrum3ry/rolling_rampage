import type { Potion } from '../types'

export const BEGINNER_POTION: Potion = {
  id: 'beginner-potion',
  name: 'Beginner Potion',
  description: 'A gift for new rampagers. Grants 10,000× luck for 1 roll.',
  luckMultiplier: 10000,
  rollsRemaining: 1,
  type: 'luck',
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
]
