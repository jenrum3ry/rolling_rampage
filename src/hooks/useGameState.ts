import { useState, useCallback } from 'react'
import type { GameState, OwnedAura, AutoRollSpeed } from '../types'
import {
  rollAura,
  getEffectiveLuck,
  consumePotionRoll,
  simulateRolls,
} from '../utils/roll'
import { BEGINNER_POTION } from '../data/potions'
import { GAUNTLETS } from '../data/gauntlets'
import { saveStateKey } from './useAuth'

function createInitialState(): GameState {
  return {
    inventory: [],
    totalStats: 0,
    luckMultiplier: 1,
    activePotions: [],
    potionInventory: [],
    totalRolls: 0,
    tutorialComplete: false,
    lastRolledAura: null,
    equippedGauntlets: [],
    completedGauntlets: [],
    autoRollEnabled: false,
    autoRollSpeed: 'slow',
    discoveredAuras: [],
  }
}

function loadState(username: string): GameState {
  try {
    const raw = localStorage.getItem(saveStateKey(username))
    if (!raw) return createInitialState()
    const saved = JSON.parse(raw) as Partial<GameState>
    // Merge with initial state to handle new fields added in v2
    return { ...createInitialState(), ...saved }
  } catch {
    return createInitialState()
  }
}

function saveState(username: string, state: GameState): void {
  localStorage.setItem(saveStateKey(username), JSON.stringify(state))
}

export function useGameState(username: string) {
  const [state, setState] = useState<GameState>(() => loadState(username))

  const persist = useCallback(
    (next: GameState) => {
      saveState(username, next)
      setState(next)
    },
    [username]
  )

  // ─── Core roll ───────────────────────────────────────────────────────────
  const roll = useCallback(() => {
    setState((prev) => {
      const effectiveLuck = getEffectiveLuck(prev)
      const aura = rollAura(effectiveLuck)
      const statBonus = aura.chance

      const owned: OwnedAura = {
        definitionId: aura.id,
        rolledAt: Date.now(),
      }

      const next: GameState = {
        ...prev,
        inventory: [...prev.inventory, owned],
        totalStats: prev.totalStats + statBonus,
        totalRolls: prev.totalRolls + 1,
        lastRolledAura: owned,
        activePotions: consumePotionRoll(prev),
        discoveredAuras: prev.discoveredAuras.includes(aura.id)
          ? prev.discoveredAuras
          : [...prev.discoveredAuras, aura.id],
      }
      saveState(username, next)
      return next
    })
  }, [username])

  // ─── Quick roll (no overlay trigger) ────────────────────────────────────
  const quickRoll = useCallback(() => {
    setState((prev) => {
      const effectiveLuck = getEffectiveLuck(prev)
      const aura = rollAura(effectiveLuck)
      const owned: OwnedAura = { definitionId: aura.id, rolledAt: Date.now() }
      const next: GameState = {
        ...prev,
        inventory: [...prev.inventory, owned],
        totalStats: prev.totalStats + aura.chance,
        totalRolls: prev.totalRolls + 1,
        lastRolledAura: null, // no overlay
        activePotions: consumePotionRoll(prev),
        discoveredAuras: prev.discoveredAuras.includes(aura.id)
          ? prev.discoveredAuras
          : [...prev.discoveredAuras, aura.id],
      }
      saveState(username, next)
      return next
    })
  }, [username])

  // ─── Potions ─────────────────────────────────────────────────────────────
  const usePotion = useCallback(
    (potionId: string) => {
      setState((prev) => {
        const potion = prev.potionInventory.find((p) => p.id === potionId)
        if (!potion) return prev

        // Portal / Supersonic: simulate rolls immediately
        if (potion.type === 'portal' || potion.type === 'supersonic') {
          const count = potion.simulatedRolls ?? 25
          const effectiveLuck = getEffectiveLuck(prev)
          const top10 = simulateRolls(count, effectiveLuck, 10)
          const newOwned: OwnedAura[] = top10.map((a) => ({
            definitionId: a.id,
            rolledAt: Date.now(),
          }))
          const statGain = top10.reduce((s, a) => s + a.chance, 0)
          const newDiscovered = [...prev.discoveredAuras]
          for (const a of top10) {
            if (!newDiscovered.includes(a.id)) newDiscovered.push(a.id)
          }
          const next: GameState = {
            ...prev,
            potionInventory: prev.potionInventory.filter((p) => p.id !== potionId),
            inventory: [...prev.inventory, ...newOwned],
            totalStats: prev.totalStats + statGain,
            totalRolls: prev.totalRolls + count,
            discoveredAuras: newDiscovered,
            lastRolledAura: newOwned[0] ?? prev.lastRolledAura,
          }
          saveState(username, next)
          return next
        }

        // Luck potion: move to activePotions
        const next: GameState = {
          ...prev,
          potionInventory: prev.potionInventory.filter((p) => p.id !== potionId),
          activePotions: [...prev.activePotions, { ...potion }],
        }
        saveState(username, next)
        return next
      })
    },
    [username]
  )

  // ─── Tutorial ────────────────────────────────────────────────────────────
  const completeTutorial = useCallback(() => {
    setState((prev) => {
      const next: GameState = {
        ...prev,
        tutorialComplete: true,
        potionInventory: [
          ...prev.potionInventory,
          { ...BEGINNER_POTION, id: `beginner-${Date.now()}` },
        ],
      }
      saveState(username, next)
      return next
    })
  }, [username])

  // ─── Gauntlets ───────────────────────────────────────────────────────────
  const craftGauntlet = useCallback(
    (gauntletId: string) => {
      setState((prev) => {
        if (prev.completedGauntlets.includes(gauntletId)) return prev
        const gauntlet = GAUNTLETS.find((g) => g.id === gauntletId)
        if (!gauntlet) return prev

        // Check requirements
        const counts = prev.inventory.reduce<Record<string, number>>(
          (acc, owned) => {
            acc[owned.definitionId] = (acc[owned.definitionId] ?? 0) + 1
            return acc
          },
          {}
        )
        const met = gauntlet.requiredAuras.every(
          (req) => (counts[req.auraId] ?? 0) >= req.count
        )
        if (!met) return prev

        const next: GameState = {
          ...prev,
          completedGauntlets: [...prev.completedGauntlets, gauntletId],
        }
        saveState(username, next)
        return next
      })
    },
    [username]
  )

  const equipGauntlet = useCallback(
    (gauntletId: string) => {
      setState((prev) => {
        if (prev.equippedGauntlets.includes(gauntletId)) return prev
        if (prev.equippedGauntlets.length >= 2) return prev
        const next: GameState = {
          ...prev,
          equippedGauntlets: [...prev.equippedGauntlets, gauntletId],
        }
        saveState(username, next)
        return next
      })
    },
    [username]
  )

  const unequipGauntlet = useCallback(
    (gauntletId: string) => {
      setState((prev) => {
        const next: GameState = {
          ...prev,
          equippedGauntlets: prev.equippedGauntlets.filter((id) => id !== gauntletId),
        }
        saveState(username, next)
        return next
      })
    },
    [username]
  )

  // ─── Auto-roll ───────────────────────────────────────────────────────────
  const setAutoRollEnabled = useCallback(
    (enabled: boolean) => {
      setState((prev) => {
        const next: GameState = { ...prev, autoRollEnabled: enabled }
        saveState(username, next)
        return next
      })
    },
    [username]
  )

  const setAutoRollSpeed = useCallback(
    (speed: AutoRollSpeed) => {
      setState((prev) => {
        const next: GameState = { ...prev, autoRollSpeed: speed }
        saveState(username, next)
        return next
      })
    },
    [username]
  )

  // ─── Reset ───────────────────────────────────────────────────────────────
  const resetGame = useCallback(() => {
    const fresh = createInitialState()
    persist(fresh)
  }, [persist])

  // ─── Helpers ─────────────────────────────────────────────────────────────
  function getInventoryCounts(): Record<string, number> {
    return state.inventory.reduce<Record<string, number>>((acc, owned) => {
      acc[owned.definitionId] = (acc[owned.definitionId] ?? 0) + 1
      return acc
    }, {})
  }

  function canCraftGauntlet(gauntletId: string): boolean {
    if (state.completedGauntlets.includes(gauntletId)) return false
    const gauntlet = GAUNTLETS.find((g) => g.id === gauntletId)
    if (!gauntlet) return false
    const counts = getInventoryCounts()
    return gauntlet.requiredAuras.every(
      (req) => (counts[req.auraId] ?? 0) >= req.count
    )
  }

  return {
    state,
    roll,
    quickRoll,
    usePotion,
    completeTutorial,
    craftGauntlet,
    equipGauntlet,
    unequipGauntlet,
    setAutoRollEnabled,
    setAutoRollSpeed,
    resetGame,
    getInventoryCounts,
    canCraftGauntlet,
  }
}
