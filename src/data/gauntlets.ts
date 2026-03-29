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
    id: 'gauntlet-of-unknown-wisdom',
    name: 'Gauntlet of Unknown Wisdom',
    requiredAuras: [
      { auraId: 'voltage', count: 1 },
      { auraId: 'scarlet', count: 1 },
    ],
    reward: {
      luckBonus: 290,
      speedBonus: 30,
      description: '+290% luck + 30% roll speed (while equipped)',
    },
  },
  {
    id: 'gauntlet-of-absolute-zero',
    name: 'Gauntlet of Absolute Zero',
    requiredAuras: [
      { auraId: 'tundra',  count: 1 },
      { auraId: 'glacier', count: 1 },
      { auraId: 'arctic',  count: 1 },
    ],
    reward: {
      luckBonus: 300,
      speedBonus: 50,
      description: '+300% luck + 50% roll speed (while equipped)',
    },
  },
  {
    id: 'gauntlet-of-maternity',
    name: 'Gauntlet of Maternity',
    requiredAuras: [
      { auraId: 'solstice', count: 1 },
      { auraId: 'eternity', count: 1 },
    ],
    reward: {
      luckBonus: 400,
      speedBonus: 60,
      description: '+400% luck + 60% roll speed (while equipped)',
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
