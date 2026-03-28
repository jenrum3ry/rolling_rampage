import { useEffect, useRef } from 'react'
import type { GameState, AutoRollSpeed } from '../types'
import { getEffectiveSpeedMultiplier } from '../utils/roll'

export const AUTO_ROLL_SPEEDS: Record<AutoRollSpeed, number> = {
  slow: 5000,
  normal: 2000,
  fast: 500,
  'very-fast': 200,
  ultra: 75,
}

export const AUTO_ROLL_REQUIREMENTS: Record<AutoRollSpeed, number> = {
  slow: 0,
  normal: 100,
  fast: 1000,
  'very-fast': 25000,
  ultra: 600000,
}

export const AUTO_ROLL_LABELS: Record<AutoRollSpeed, string> = {
  slow: 'Slow (5s)',
  normal: 'Normal (2s)',
  fast: 'Fast (0.5s)',
  'very-fast': 'Very Fast (0.2s)',
  ultra: 'Ultra (0.075s)',
}

export function useAutoRoll(
  state: GameState,
  rollFn: () => void,
  paused: boolean
) {
  const rollRef = useRef(rollFn)
  rollRef.current = rollFn

  useEffect(() => {
    if (!state.autoRollEnabled || paused) return

    const baseInterval = AUTO_ROLL_SPEEDS[state.autoRollSpeed]
    const speedMult = getEffectiveSpeedMultiplier(state)
    const interval = Math.max(50, Math.floor(baseInterval / speedMult))

    const id = setInterval(() => {
      rollRef.current()
    }, interval)

    return () => clearInterval(id)
  }, [
    state.autoRollEnabled,
    state.autoRollSpeed,
    state.equippedGauntlets,
    paused,
  ])
}
