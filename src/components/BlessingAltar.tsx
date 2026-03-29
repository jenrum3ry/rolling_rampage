import { useState, useEffect } from 'react'
import type { GameState } from '../types'

interface Props {
  state: GameState
  onAttempt: () => void
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return '0:00'
  const totalSec = Math.ceil(ms / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  return `${min}:${sec.toString().padStart(2, '0')}`
}

export function BlessingAltar({ state, onAttempt }: Props) {
  const [now, setNow] = useState(Date.now())

  // Tick every second for live countdowns
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const blessingActive = !!(state.blessingEndTime && state.blessingEndTime > now)
  const onCooldown = !!(state.blessingCooldownEndTime && state.blessingCooldownEndTime > now)
  const canAttempt = !onCooldown

  const blessingRemaining = blessingActive ? state.blessingEndTime! - now : 0
  const cooldownRemaining = onCooldown ? state.blessingCooldownEndTime! - now : 0

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="text-yellow-400 text-lg">✦</span>
        <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest">
          Blessing Altar
        </h2>
      </div>

      <p className="text-gray-500 text-sm leading-relaxed">
        Invoke the altar for a chance at divine fortune. On success, gain{' '}
        <span className="text-yellow-300 font-semibold">+100% luck</span> for 5 minutes.
        On failure, try again in 10 minutes.
      </p>

      {/* Active blessing banner */}
      {blessingActive && (
        <div
          className="rounded-xl px-4 py-3 flex items-center justify-between"
          style={{
            background: 'linear-gradient(135deg, rgba(234,179,8,0.15), rgba(234,179,8,0.05))',
            border: '1px solid rgba(234,179,8,0.4)',
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-base">✦</span>
            <div>
              <p className="text-yellow-300 text-sm font-bold">Blessing Active</p>
              <p className="text-yellow-500 text-xs">+100% luck multiplier</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-yellow-400 text-lg font-mono font-bold">
              {formatCountdown(blessingRemaining)}
            </p>
            <p className="text-yellow-600 text-xs">remaining</p>
          </div>
        </div>
      )}

      {/* Cooldown display */}
      {onCooldown && !blessingActive && (
        <div
          className="rounded-xl px-4 py-3 flex items-center justify-between"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div>
            <p className="text-gray-400 text-sm font-semibold">Next blessing in</p>
            <p className="text-gray-600 text-xs">The altar is recharging</p>
          </div>
          <p className="text-gray-300 text-2xl font-mono font-bold">
            {formatCountdown(cooldownRemaining)}
          </p>
        </div>
      )}

      {/* Cooldown while blessing is also active (shows next attempt timer) */}
      {onCooldown && blessingActive && (
        <div
          className="rounded-lg px-3 py-2 flex items-center justify-between"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-gray-600 text-xs">Next attempt in</p>
          <p className="text-gray-500 text-sm font-mono">{formatCountdown(cooldownRemaining)}</p>
        </div>
      )}

      {/* Attempt button */}
      <button
        onClick={onAttempt}
        disabled={!canAttempt}
        className="w-full py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        style={
          canAttempt
            ? {
                background: 'linear-gradient(135deg, #b45309, #92400e)',
                boxShadow: '0 0 20px rgba(180,83,9,0.5)',
                color: '#fef3c7',
                border: '1px solid rgba(251,191,36,0.4)',
              }
            : {
                background: 'rgba(255,255,255,0.05)',
                color: '#6b7280',
                border: '1px solid rgba(255,255,255,0.08)',
              }
        }
      >
        {canAttempt ? '✦ Attempt Blessing' : 'Altar Recharging…'}
      </button>

      <p className="text-gray-700 text-xs text-center">
        50% success · 5 min blessing · 5 min wait after success · 10 min wait on failure
      </p>
    </div>
  )
}
