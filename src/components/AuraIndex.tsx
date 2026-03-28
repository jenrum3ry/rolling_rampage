import { useState, useMemo } from 'react'
import { AURAS_DESC } from '../data/auras'
import type { GameState } from '../types'
import { getAuraCategory, CATEGORY_COLORS } from '../utils/roll'

interface Props {
  state: GameState
}

function formatChance(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`
  return n.toLocaleString()
}

export function AuraIndex({ state }: Props) {
  const [search, setSearch] = useState('')
  const [sortRarest, setSortRarest] = useState(true)

  const discovered = new Set(state.discoveredAuras)

  const sorted = useMemo(() => {
    const list = [...AURAS_DESC]
    if (!sortRarest) list.reverse()
    if (!search.trim()) return list
    const q = search.toLowerCase()
    return list.filter((a) => a.name.toLowerCase().includes(q))
  }, [sortRarest, search])

  const total = AURAS_DESC.length
  const found = discovered.size

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            Aura Index
          </h2>
          <p className="text-xs text-gray-600 mt-0.5">
            {found} / {total} discovered
          </p>
        </div>
        <button
          onClick={() => setSortRarest(!sortRarest)}
          className="text-xs text-gray-400 hover:text-white bg-gray-800 px-3 py-1.5 rounded-lg transition-colors"
        >
          {sortRarest ? 'Rarest first' : 'Most common first'}
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-800 rounded-full h-1.5 mb-4">
        <div
          className="h-1.5 rounded-full bg-purple-500 transition-all"
          style={{ width: `${(found / total) * 100}%` }}
        />
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search auras..."
        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500 mb-4 transition-colors"
      />

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-96 overflow-y-auto pr-1">
        {sorted.map((aura) => {
          const isDiscovered = discovered.has(aura.id)
          return (
            <div
              key={aura.id}
              className="rounded-xl p-3 border text-center transition-all"
              style={
                isDiscovered
                  ? {
                      borderColor: aura.color + '55',
                      background: `linear-gradient(135deg, rgba(0,0,0,0.5), ${aura.color}18)`,
                      boxShadow: `0 0 8px ${aura.glowColor}`,
                    }
                  : {
                      borderColor: '#374151',
                      background: 'rgba(17,24,39,0.5)',
                      filter: 'grayscale(1)',
                    }
              }
            >
              {/* Color dot */}
              <div
                className="w-6 h-6 rounded-full mx-auto mb-1.5"
                style={{
                  background: isDiscovered ? aura.color : '#374151',
                  boxShadow: isDiscovered ? `0 0 8px ${aura.glowColor}` : 'none',
                }}
              />
              <p
                className="text-xs font-bold truncate"
                style={{ color: isDiscovered ? aura.color : '#4b5563' }}
              >
                {isDiscovered ? aura.name : '???'}
              </p>
              {isDiscovered && (
                <p
                  className="text-xs font-semibold"
                  style={{ color: CATEGORY_COLORS[getAuraCategory(aura.chance)] }}
                >
                  {getAuraCategory(aura.chance)}
                </p>
              )}
              <p className="text-gray-500 text-xs mt-0.5">
                {isDiscovered ? `1-in-${formatChance(aura.chance)}` : '1-in-???'}
              </p>
              {isDiscovered && (
                <p className="text-xs mt-0.5" style={{ color: aura.color }}>
                  +{formatChance(aura.chance)} stats
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
