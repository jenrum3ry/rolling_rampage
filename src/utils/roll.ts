import type { AuraDefinition, GameState } from '../types'
import { AURAS_DESC } from '../data/auras'
import { GAUNTLETS } from '../data/gauntlets'

/**
 * Compute effective luck multiplier.
 * Combines base luck, active potions, and equipped gauntlet bonuses.
 */
export function getEffectiveLuck(state: GameState): number {
  // Active potion luck (multiplicative)
  const potionLuck = state.activePotions
    .filter((p) => p.type === 'luck')
    .reduce((acc, p) => acc * p.luckMultiplier, state.luckMultiplier)

  // Equipped gauntlet luck bonus (additive percentages → multiplicative)
  const equippedLuckBonus = state.equippedGauntlets.reduce((acc, gId) => {
    const g = GAUNTLETS.find((g) => g.id === gId)
    return acc + (g?.reward.luckBonus ?? 0)
  }, 0)

  return potionLuck * (1 + equippedLuckBonus / 100)
}

/**
 * Get effective roll speed multiplier from equipped gauntlets.
 * Returns a number > 1 meaning intervals are divided by this.
 */
export function getEffectiveSpeedMultiplier(state: GameState): number {
  const bonus = state.equippedGauntlets.reduce((acc, gId) => {
    const g = GAUNTLETS.find((g) => g.id === gId)
    return acc + (g?.reward.speedBonus ?? 0)
  }, 0)
  return 1 + bonus / 100
}

/**
 * Roll a single aura given an effective luck multiplier.
 *
 * Algorithm: iterate rarities from rarest → most common.
 * For each aura with 1-in-N chance:
 *   probability = min(1, effectiveLuck / N)
 * First aura whose probability check passes is awarded.
 */
export function rollAura(effectiveLuck: number): AuraDefinition {
  for (const aura of AURAS_DESC) {
    const probability = Math.min(1, effectiveLuck / aura.chance)
    if (Math.random() < probability) {
      return aura
    }
  }
  // Fallback to most common aura (floating point safety)
  return AURAS_DESC[AURAS_DESC.length - 1]
}

/**
 * Simulate N rolls and return the top K rarest results.
 * Used by Portal Potion and Supersonic Potion.
 */
export function simulateRolls(
  count: number,
  effectiveLuck: number,
  topK = 10
): AuraDefinition[] {
  const results: AuraDefinition[] = []
  for (let i = 0; i < count; i++) {
    results.push(rollAura(effectiveLuck))
  }
  // Sort rarest first (highest chance = most common, so sort descending)
  results.sort((a, b) => b.chance - a.chance)
  return results.slice(0, topK)
}

/**
 * Decrement active potions' rollsRemaining by 1. Remove depleted ones.
 */
export function consumePotionRoll(
  state: GameState
): GameState['activePotions'] {
  return state.activePotions
    .map((p) => ({ ...p, rollsRemaining: p.rollsRemaining - 1 }))
    .filter((p) => p.rollsRemaining > 0)
}
