import { useEffect } from 'react'
import type { GameState, BiomeName } from '../types'

export function useBiomeTimer(
  state: GameState,
  activateBiome: (biome: BiomeName) => void,
  deactivateBiome: () => void,
  addBonusAura: (auraId: string) => void
) {
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()

      // Expire active biome when its timer runs out
      if (state.activeBiome && state.biomeEndTime && state.biomeEndTime <= now) {
        deactivateBiome()
      }

      // Starlight biome passive trigger: 1/15,000 chance per second when no biome active
      if (!state.activeBiome && Math.random() < 1 / 15_000) {
        activateBiome('starlight')
      }

      // Gravitas passive award: 1/1,000,000 chance per second
      if (Math.random() < 1 / 1_000_000) {
        addBonusAura('gravitas')
      }
    }, 1_000)

    return () => clearInterval(interval)
  }, [state.activeBiome, state.biomeEndTime, activateBiome, deactivateBiome, addBonusAura])
}
