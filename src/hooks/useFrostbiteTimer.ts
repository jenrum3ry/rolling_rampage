import { useEffect } from 'react'

export function useFrostbiteTimer(addBonusAura: (auraId: string) => void) {
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 1 / 50) {
        addBonusAura('frostbite')
      }
    }, 600_000) // every 10 minutes
    return () => clearInterval(interval)
  }, [addBonusAura])
}
