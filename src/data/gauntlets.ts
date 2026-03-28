import type { GauntletDef } from '../types'

export const GAUNTLETS: GauntletDef[] = [
  {
    id: 'gauntlet-of-sparks',
    name: 'Gauntlet of Sparks',
    requiredAuras: [
      { auraId: 'ordinary', count: 10 },
      { auraId: 'surge', count: 5 },
    ],
    reward: {
      luckBonus: 0,
      speedBonus: 10,
      description: '+10% roll speed (while equipped)',
    },
  },
  {
    id: 'gauntlet-of-storms',
    name: 'Gauntlet of Storms',
    requiredAuras: [
      { auraId: 'ice', count: 5 },
      { auraId: 'neon', count: 2 },
    ],
    reward: {
      luckBonus: 50,
      speedBonus: 0,
      description: '+50% luck (while equipped)',
    },
  },
  {
    id: 'gauntlet-of-the-abyss',
    name: 'Gauntlet of the Abyss',
    requiredAuras: [
      { auraId: 'helix', count: 3 },
      { auraId: 'sky', count: 1 },
    ],
    reward: {
      luckBonus: 100,
      speedBonus: 25,
      description: '+100% luck + 25% roll speed (while equipped)',
    },
  },
  {
    id: 'gauntlet-of-hellfire',
    name: 'Gauntlet of Hellfire',
    requiredAuras: [
      { auraId: 'scorched', count: 3 },
      { auraId: 'nova', count: 1 },
    ],
    reward: {
      luckBonus: 200,
      speedBonus: 0,
      description: '+200% luck (while equipped)',
    },
  },
]
