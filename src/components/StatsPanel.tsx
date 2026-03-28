import type { GameState } from '../types'
import { getEffectiveLuck } from '../utils/roll'
import { AURAS } from '../data/auras'
import { GAUNTLETS } from '../data/gauntlets'

interface Props {
  state: GameState
}

function fmt(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return n.toLocaleString()
}

export function StatsPanel({ state }: Props) {
  const effectiveLuck = getEffectiveLuck(state)
  const total = AURAS.length
  const discovered = state.discoveredAuras.length

  const equippedBonuses = state.equippedGauntlets.reduce(
    (acc, gId) => {
      const g = GAUNTLETS.find((g) => g.id === gId)
      if (!g) return acc
      return { luck: acc.luck + g.reward.luckBonus, speed: acc.speed + g.reward.speedBonus }
    },
    { luck: 0, speed: 0 }
  )

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 flex flex-col gap-4">
      <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Stats</h2>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="Total Stats" value={fmt(state.totalStats)} color="text-purple-400" />
        <Stat label="Total Rolls" value={state.totalRolls.toLocaleString()} color="text-blue-400" />
        <Stat label="Base Luck" value={`${state.luckMultiplier}×`} color="text-green-400" />
        <Stat label="Effective Luck" value={`${fmt(effectiveLuck)}×`} color="text-yellow-400" />
      </div>

      {/* Aura index progress */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Aura Index</span>
          <span>{discovered} / {total}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full bg-purple-500 transition-all"
            style={{ width: `${(discovered / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Equipped gauntlet bonuses */}
      {state.equippedGauntlets.length > 0 && (
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">Gauntlet Bonuses</p>
          {equippedBonuses.luck > 0 && (
            <p className="text-xs text-purple-300">+{equippedBonuses.luck}% luck from gauntlets</p>
          )}
          {equippedBonuses.speed > 0 && (
            <p className="text-xs text-blue-300">+{equippedBonuses.speed}% roll speed from gauntlets</p>
          )}
        </div>
      )}

      {/* Active potions */}
      {state.activePotions.length > 0 && (
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">Active Potions</p>
          {state.activePotions.map((p, i) => (
            <div
              key={i}
              className="flex justify-between text-sm text-gray-300 py-1 border-b border-gray-800 last:border-0"
            >
              <span>{p.name}</span>
              <span className="text-purple-300">
                {p.rollsRemaining} roll{p.rollsRemaining !== 1 ? 's' : ''} left
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-gray-800 rounded-xl p-3">
      <p className="text-gray-500 text-xs mb-1">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
    </div>
  )
}
