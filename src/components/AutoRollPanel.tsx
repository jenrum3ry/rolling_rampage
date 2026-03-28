import type { GameState, AutoRollSpeed } from '../types'
import {
  AUTO_ROLL_LABELS,
  AUTO_ROLL_REQUIREMENTS,
} from '../hooks/useAutoRoll'

interface Props {
  state: GameState
  onToggle: (enabled: boolean) => void
  onSpeedChange: (speed: AutoRollSpeed) => void
}

const SPEEDS: AutoRollSpeed[] = ['slow', 'normal', 'fast', 'very-fast', 'ultra']

export function AutoRollPanel({ state, onToggle, onSpeedChange }: Props) {
  const totalRolls = state.totalRolls

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Auto Roll</h2>
        {/* Toggle switch */}
        <button
          onClick={() => onToggle(!state.autoRollEnabled)}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            state.autoRollEnabled ? 'bg-purple-600' : 'bg-gray-700'
          }`}
        >
          <span
            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
              state.autoRollEnabled ? 'left-6' : 'left-0.5'
            }`}
          />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {SPEEDS.map((speed) => {
          const required = AUTO_ROLL_REQUIREMENTS[speed]
          const unlocked = totalRolls >= required
          const active = state.autoRollSpeed === speed

          return (
            <button
              key={speed}
              disabled={!unlocked}
              onClick={() => unlocked && onSpeedChange(speed)}
              className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                active && unlocked
                  ? 'bg-purple-700 text-white border border-purple-500'
                  : unlocked
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-transparent'
                  : 'bg-gray-900 text-gray-600 border border-transparent cursor-not-allowed'
              }`}
            >
              <span>{AUTO_ROLL_LABELS[speed]}</span>
              {required > 0 && !unlocked && (
                <span className="text-xs text-gray-600">
                  Req: {required.toLocaleString()} rolls
                </span>
              )}
              {required > 0 && unlocked && (
                <span className="text-xs text-green-500">Unlocked</span>
              )}
            </button>
          )
        })}
      </div>

      {state.autoRollEnabled && (
        <p className="text-purple-400 text-xs text-center mt-3 font-medium">
          Auto-rolling at {AUTO_ROLL_LABELS[state.autoRollSpeed]}
        </p>
      )}
    </div>
  )
}
