import { useMemo } from 'react'
import type { GameState } from '../types'
import { AURA_MAP, AURAS_DESC } from '../data/auras'

interface Props {
  state: GameState
}

function formatStat(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return n.toLocaleString()
}

// Sort order index (rarest = index 0)
const RARITY_ORDER = Object.fromEntries(AURAS_DESC.map((a, i) => [a.id, i]))

export function Inventory({ state }: Props) {
  // Group owned auras by definition ID and count them
  const grouped = useMemo(() => {
    const map = new Map<string, number>()
    for (const owned of state.inventory) {
      map.set(owned.definitionId, (map.get(owned.definitionId) ?? 0) + 1)
    }
    // Sort by rarity (rarest first)
    return [...map.entries()].sort(
      (a, b) => (RARITY_ORDER[a[0]] ?? 999) - (RARITY_ORDER[b[0]] ?? 999)
    )
  }, [state.inventory])

  if (grouped.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
        <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">
          Inventory
        </h2>
        <p className="text-gray-600 text-sm text-center py-6">No auras yet. Start rolling!</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
      <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">
        Inventory{' '}
        <span className="text-gray-600 font-normal normal-case">
          ({state.inventory.length} total, {grouped.length} unique)
        </span>
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-1">
        {grouped.map(([id, count]) => {
          const aura = AURA_MAP[id]
          if (!aura) return null
          return (
            <div
              key={id}
              className="rounded-xl p-3 border text-center"
              style={{
                borderColor: aura.color + '55',
                background: `linear-gradient(135deg, rgba(0,0,0,0.5), ${aura.color}12)`,
              }}
            >
              {/* Color orb */}
              <div
                className="w-5 h-5 rounded-full mx-auto mb-1"
                style={{
                  background: aura.color,
                  boxShadow: `0 0 8px ${aura.glowColor}`,
                }}
              />
              <p
                className="text-xs font-bold leading-tight truncate"
                style={{ color: aura.color }}
              >
                {aura.name}
              </p>
              <p className="text-gray-500 text-xs">1-in-{formatStat(aura.chance)}</p>
              {count > 1 && (
                <p className="text-gray-400 text-xs font-semibold mt-0.5">×{count}</p>
              )}
              <p className="text-xs mt-0.5" style={{ color: aura.color }}>
                +{formatStat(aura.chance * count)}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
