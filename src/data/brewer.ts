import type { Potion } from '../types'
import { LOVE_POTION, STARLIGHT_POTION, ACCELERATION_POTION } from './potions'

export interface BrewRecipe {
  id: string
  name: string
  description: string
  ingredients: { auraId: string; count: number }[]
  resultPotion: Potion
}

export const BREW_RECIPES: BrewRecipe[] = [
  {
    id: 'brew-love-potion',
    name: 'Love Potion',
    description: 'Grants 50× luck for 100 rolls.',
    ingredients: [
      { auraId: 'ordinary', count: 15 },
      { auraId: 'surge', count: 10 },
    ],
    resultPotion: LOVE_POTION,
  },
  {
    id: 'brew-starlight-potion',
    name: 'Starlight Potion',
    description: 'Grants 1,000× luck for 1 roll.',
    ingredients: [
      { auraId: 'ice', count: 5 },
      { auraId: 'neon', count: 3 },
    ],
    resultPotion: STARLIGHT_POTION,
  },
  {
    id: 'brew-acceleration-potion',
    name: 'Acceleration Potion',
    description: 'Simulate 2,500 instant rolls, keeping the 10 rarest.',
    ingredients: [
      { auraId: 'karma',    count: 2 },
      { auraId: 'scorched', count: 2 },
    ],
    resultPotion: ACCELERATION_POTION,
  },
]
