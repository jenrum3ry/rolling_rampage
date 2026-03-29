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
  {
    id: 'gauntlet-of-history',
    name: 'Gauntlet of History',
    requiredAuras: [
      { auraId: 'flame',    count: 1 },
      { auraId: 'radiance', count: 1 },
      { auraId: 'bounded',  count: 1 },
    ],
    reward: {
      luckBonus: 150,
      speedBonus: 2400,
      description: '+150% luck + 25× roll speed (while equipped)',
    },
  },
  {
    id: 'gauntlet-of-purity',
    name: 'Gauntlet of Purity',
    requiredAuras: [
      { auraId: 'odd',        count: 1 },
      { auraId: 'reign',      count: 1 },
      { auraId: 'primordial', count: 1 },
    ],
    reward: {
      luckBonus: 250,
      speedBonus: 30,
      description: '+250% luck + 30% roll speed (while equipped)',
    },
  },
]
