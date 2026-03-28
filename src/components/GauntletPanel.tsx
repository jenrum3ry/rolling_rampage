import { GAUNTLETS } from '../data/gauntlets'
import { AURA_MAP } from '../data/auras'
import type { GameState } from '../types'

interface Props {
  state: GameState
  onCraft: (id: string) => void
  onEquip: (id: string) => void
  onUnequip: (id: string) => void
  canCraft: (id: string) => boolean
  inventoryCounts: Record<string, number>
}

export function GauntletPanel({
  state,
  onCraft,
  onEquip,
  onUnequip,
  canCraft,
  inventoryCounts,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      {/* Equipped banner */}
      {state.equippedGauntlets.length > 0 && (
        <div className="bg-purple-950 border border-purple-700 rounded-2xl px-4 py-3">
          <p className="text-purple-300 text-xs font-bold uppercase tracking-widest mb-2">
            Equipped ({state.equippedGauntlets.length}/2)
          </p>
          <div className="flex flex-wrap gap-2">
            {state.equippedGauntlets.map((id) => {
              const g = GAUNTLETS.find((g) => g.id === id)
              if (!g) return null
              return (
                <div
                  key={id}
                  className="flex items-center gap-2 bg-purple-900 rounded-xl px-3 py-1.5"
                >
                  <span className="text-white text-sm font-semibold">{g.name}</span>
                  <span className="text-purple-300 text-xs">{g.reward.description}</span>
                  <button
                    onClick={() => onUnequip(id)}
                    className="text-xs text-purple-400 hover:text-red-400 ml-1 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Gauntlet cards */}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
        <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">
          Gauntlets
        </h2>

        <div className="flex flex-col gap-3">
          {GAUNTLETS.map((g) => {
            const crafted = state.completedGauntlets.includes(g.id)
            const equipped = state.equippedGauntlets.includes(g.id)
            const craftable = canCraft(g.id)
            const atCap = state.equippedGauntlets.length >= 2 && !equipped

            return (
              <div
                key={g.id}
                className={`rounded-xl border p-4 transition-colors ${
                  equipped
                    ? 'border-purple-500 bg-purple-950'
                    : crafted
                    ? 'border-green-700 bg-gray-800'
                    : craftable
                    ? 'border-yellow-600 bg-gray-800'
                    : 'border-gray-700 bg-gray-800'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white font-bold text-sm">{g.name}</p>
                  {equipped && (
                    <span className="text-xs bg-purple-700 text-white px-2 py-0.5 rounded-full">
                      Equipped
                    </span>
                  )}
                  {crafted && !equipped && (
                    <span className="text-xs bg-green-800 text-green-300 px-2 py-0.5 rounded-full">
                      Crafted
                    </span>
                  )}
                  {!crafted && (
                    <span className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">
                      Locked
                    </span>
                  )}
                </div>

                {/* Requirements */}
                {!crafted && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {g.requiredAuras.map((req) => {
                      const aura = AURA_MAP[req.auraId]
                      const have = inventoryCounts[req.auraId] ?? 0
                      const met = have >= req.count
                      return (
                        <span
                          key={req.auraId}
                          className={`text-xs px-2 py-0.5 rounded-full border ${
                            met
                              ? 'border-green-600 text-green-400 bg-green-950'
                              : 'border-gray-600 text-gray-400 bg-gray-900'
                          }`}
                          style={aura ? { borderColor: met ? undefined : aura.color + '55' } : undefined}
                        >
                          {have}/{req.count} {aura?.name ?? req.auraId}
                        </span>
                      )
                    })}
                  </div>
                )}

                {/* Reward */}
                <p className="text-gray-400 text-xs mb-3">
                  Reward: <span className="text-purple-300">{g.reward.description}</span>
                </p>

                {/* Action button */}
                {!crafted && (
                  <button
                    onClick={() => craftable && onCraft(g.id)}
                    disabled={!craftable}
                    className={`w-full py-2 rounded-lg text-sm font-bold transition-colors ${
                      craftable
                        ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {craftable ? 'Craft' : 'Requirements not met'}
                  </button>
                )}

                {crafted && !equipped && (
                  <button
                    onClick={() => !atCap && onEquip(g.id)}
                    disabled={atCap}
                    className={`w-full py-2 rounded-lg text-sm font-bold transition-colors ${
                      atCap
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-green-700 hover:bg-green-600 text-white'
                    }`}
                  >
                    {atCap ? 'Unequip one to equip this' : 'Equip'}
                  </button>
                )}

                {equipped && (
                  <button
                    onClick={() => onUnequip(g.id)}
                    className="w-full py-2 rounded-lg text-sm font-bold bg-gray-700 hover:bg-red-900 text-gray-300 hover:text-red-300 transition-colors"
                  >
                    Unequip
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
