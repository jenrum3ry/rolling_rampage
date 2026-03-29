import { useState, useCallback } from 'react'
import type { GameState, OwnedAura, AutoRollSpeed, BiomeName } from '../types'
import {
  rollAura,
  getEffectiveLuck,
  consumePotionRoll,
  simulateRolls,
} from '../utils/roll'
import { BEGINNER_POTION } from '../data/potions'
import { GAUNTLETS } from '../data/gauntlets'
import { BREW_RECIPES } from '../data/brewer'
import { AURA_MAP } from '../data/auras'
import { BIOME_AURA_OVERRIDES } from '../data/biomes'
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
    equippedAura: null,
    activeSpeedPotions: [],
    autoRollRareNotification: null,
    lastAutoRolledAura: null,
    activeBiome: null,
    biomeEndTime: null,
    blessingCooldownEndTime: null,
    blessingEndTime: null,
  }
}

function loadState(username: string): GameState {
  try {
    const raw = localStorage.getItem(saveStateKey(username))
    if (!raw) return createInitialState()
    const saved = JSON.parse(raw) as Partial<GameState>
    // Merge with initial state to handle new fields added in later versions
    return { ...createInitialState(), ...saved }
  } catch {
    return createInitialState()
  }
}

function saveState(username: string, state: GameState): void {
  localStorage.setItem(saveStateKey(username), JSON.stringify(state))
}

function getActiveBiomeOverrides(state: GameState): Record<string, number> | undefined {
  if (!state.activeBiome || !state.biomeEndTime || state.biomeEndTime <= Date.now()) return undefined
  return BIOME_AURA_OVERRIDES[state.activeBiome]
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
      const biomeOverrides = getActiveBiomeOverrides(prev)
      const aura = rollAura(effectiveLuck, biomeOverrides)
      const statBonus = aura.chance

      const owned: OwnedAura = {
        definitionId: aura.id,
        rolledAt: Date.now(),
      }

      let newInventory: OwnedAura[] = [...prev.inventory, owned]
      let newStats = prev.totalStats + statBonus
      const newDiscovered = prev.discoveredAuras.includes(aura.id)
        ? prev.discoveredAuras
        : [...prev.discoveredAuras, aura.id]

      // Check for active techno potion bonus auras
      const technoPotion = prev.activePotions.find((p) => p.type === 'techno')
      if (technoPotion?.bonusAuraChances) {
        for (const bonus of technoPotion.bonusAuraChances) {
          if (Math.random() < 1 / bonus.chance) {
            const bonusDef = AURA_MAP[bonus.auraId]
            if (bonusDef) {
              const bonusOwned: OwnedAura = { definitionId: bonus.auraId, rolledAt: Date.now() }
              newInventory = [...newInventory, bonusOwned]
              newStats += bonusDef.chance
              if (!newDiscovered.includes(bonus.auraId)) newDiscovered.push(bonus.auraId)
            }
          }
        }
      }

      const next: GameState = {
        ...prev,
        inventory: newInventory,
        totalStats: newStats,
        totalRolls: prev.totalRolls + 1,
        lastRolledAura: owned,
        activePotions: consumePotionRoll(prev),
        discoveredAuras: newDiscovered,
      }
      saveState(username, next)
      return next
    })
  }, [username])

  // ─── Quick roll (no overlay trigger) ────────────────────────────────────
  const quickRoll = useCallback(() => {
    setState((prev) => {
      const effectiveLuck = getEffectiveLuck(prev)
      const biomeOverrides = getActiveBiomeOverrides(prev)
      const aura = rollAura(effectiveLuck, biomeOverrides)
      const owned: OwnedAura = { definitionId: aura.id, rolledAt: Date.now() }
      const isRare = aura.chance >= 10_000
      const next: GameState = {
        ...prev,
        inventory: [...prev.inventory, owned],
        totalStats: prev.totalStats + aura.chance,
        totalRolls: prev.totalRolls + 1,
        lastRolledAura: null, // no overlay
        lastAutoRolledAura: owned,
        activePotions: consumePotionRoll(prev),
        discoveredAuras: prev.discoveredAuras.includes(aura.id)
          ? prev.discoveredAuras
          : [...prev.discoveredAuras, aura.id],
        autoRollRareNotification: isRare ? owned : prev.autoRollRareNotification,
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

        // Speed potion: record active speed boost with endTime
        if (potion.type === 'speed') {
          const endTime = Date.now() + (potion.durationMs ?? 180_000)
          const next: GameState = {
            ...prev,
            potionInventory: prev.potionInventory.filter((p) => p.id !== potionId),
            activeSpeedPotions: [
              ...prev.activeSpeedPotions,
              { endTime, speedMultiplier: potion.speedMultiplier ?? 75 },
            ],
          }
          saveState(username, next)
          return next
        }

        // Biome potion: activate a random biome for 5 minutes
        if (potion.type === 'biome') {
          const biome: BiomeName = Math.random() < 0.5 ? 'starlight' : 'midnight'
          const next: GameState = {
            ...prev,
            potionInventory: prev.potionInventory.filter((p) => p.id !== potionId),
            activeBiome: biome,
            biomeEndTime: Date.now() + 5 * 60_000,
          }
          saveState(username, next)
          return next
        }

        // Techno / Luck potion: move to activePotions
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

  // ─── Equippable aura ─────────────────────────────────────────────────────
  const equipAura = useCallback(
    (auraId: string) => {
      setState((prev) => {
        const next: GameState = { ...prev, equippedAura: auraId }
        saveState(username, next)
        return next
      })
    },
    [username]
  )

  const unequipAura = useCallback(() => {
    setState((prev) => {
      const next: GameState = { ...prev, equippedAura: null }
      saveState(username, next)
      return next
    })
  }, [username])

  // ─── Bonus aura (Frostbite / Gravitas / Techno special drops) ────────────
  const addBonusAura = useCallback(
    (auraId: string) => {
      setState((prev) => {
        const auraDef = AURA_MAP[auraId]
        if (!auraDef) return prev
        const owned: OwnedAura = { definitionId: auraId, rolledAt: Date.now() }
        const next: GameState = {
          ...prev,
          inventory: [...prev.inventory, owned],
          totalStats: prev.totalStats + auraDef.chance,
          discoveredAuras: prev.discoveredAuras.includes(auraId)
            ? prev.discoveredAuras
            : [...prev.discoveredAuras, auraId],
        }
        saveState(username, next)
        return next
      })
    },
    [username]
  )

  // ─── Dismiss auto-roll rare notification ─────────────────────────────────
  const dismissRareNotification = useCallback(() => {
    setState((prev) => {
      const next: GameState = { ...prev, autoRollRareNotification: null }
      saveState(username, next)
      return next
    })
  }, [username])

  // ─── Biome management ────────────────────────────────────────────────────
  const activateBiome = useCallback(
    (biome: BiomeName) => {
      setState((prev) => {
        const next: GameState = {
          ...prev,
          activeBiome: biome,
          biomeEndTime: Date.now() + 5 * 60_000,
        }
        saveState(username, next)
        return next
      })
    },
    [username]
  )

  const deactivateBiome = useCallback(() => {
    setState((prev) => {
      const next: GameState = { ...prev, activeBiome: null, biomeEndTime: null }
      saveState(username, next)
      return next
    })
  }, [username])

  // ─── Blessing Altar ───────────────────────────────────────────────────────
  const attemptBlessing = useCallback(() => {
    setState((prev) => {
      const now = Date.now()
      if (prev.blessingCooldownEndTime && prev.blessingCooldownEndTime > now) return prev

      const success = Math.random() < 0.5
      const next: GameState = success
        ? {
            ...prev,
            blessingEndTime: now + 5 * 60_000,
            blessingCooldownEndTime: now + 10 * 60_000,
          }
        : {
            ...prev,
            blessingCooldownEndTime: now + 10 * 60_000,
          }
      saveState(username, next)
      return next
    })
  }, [username])

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

  // ─── Brewer ──────────────────────────────────────────────────────────────
  const brewPotion = useCallback(
    (recipeId: string) => {
      setState((prev) => {
        const recipe = BREW_RECIPES.find((r) => r.id === recipeId)
        if (!recipe) return prev

        const counts = prev.inventory.reduce<Record<string, number>>(
          (acc, owned) => {
            acc[owned.definitionId] = (acc[owned.definitionId] ?? 0) + 1
            return acc
          },
          {}
        )

        const canBrew = recipe.ingredients.every(
          (ing) => (counts[ing.auraId] ?? 0) >= ing.count
        )
        if (!canBrew) return prev

        // Remove ingredient auras from inventory
        let newInventory = [...prev.inventory]
        let statLost = 0
        for (const ing of recipe.ingredients) {
          let toRemove = ing.count
          newInventory = newInventory.filter((owned) => {
            if (owned.definitionId === ing.auraId && toRemove > 0) {
              toRemove--
              statLost += AURA_MAP[owned.definitionId]?.chance ?? 0
              return false
            }
            return true
          })
        }

        const brewed = {
          ...recipe.resultPotion,
          id: `${recipe.resultPotion.id}-${Date.now()}`,
        }

        const next: GameState = {
          ...prev,
          inventory: newInventory,
          totalStats: Math.max(0, prev.totalStats - statLost),
          potionInventory: [...prev.potionInventory, brewed],
        }
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
    equipAura,
    unequipAura,
    addBonusAura,
    dismissRareNotification,
    activateBiome,
    deactivateBiome,
    attemptBlessing,
    setAutoRollEnabled,
    setAutoRollSpeed,
    resetGame,
    getInventoryCounts,
    canCraftGauntlet,
    brewPotion,
  }
}
