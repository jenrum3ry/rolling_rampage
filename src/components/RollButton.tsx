import { motion } from 'framer-motion'
import { useState } from 'react'

interface Props {
  onRoll: () => void
  onQuickRoll: () => void
  effectiveLuck: number
  disabled?: boolean
}

function fmtLuck(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`
  return n.toString()
}

export function RollButton({ onRoll, onQuickRoll, effectiveLuck, disabled = false }: Props) {
  const [rolling, setRolling] = useState(false)

  function handleClick() {
    if (disabled || rolling) return
    setRolling(true)
    onRoll()
    setTimeout(() => setRolling(false), 350)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Main roll button */}
      <motion.button
        onClick={handleClick}
        disabled={disabled || rolling}
        className="relative w-44 h-44 rounded-full font-extrabold text-2xl text-white uppercase tracking-wider select-none focus:outline-none disabled:opacity-60"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #7c3aed, #4c1d95)',
          boxShadow: '0 0 30px rgba(124,58,237,0.7), 0 0 60px rgba(124,58,237,0.35)',
        }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.92 }}
        animate={rolling ? { scale: [1, 1.15, 0.95, 1], rotate: [0, 6, -6, 0] } : {}}
        transition={{ duration: 0.35 }}
      >
        <motion.span animate={rolling ? { opacity: [1, 0, 1] } : {}}>ROLL</motion.span>
        <span
          className="absolute inset-0 rounded-full border-4 border-purple-400 opacity-20"
          style={{ animation: 'spin 6s linear infinite' }}
        />
      </motion.button>

      {/* Quick roll button */}
      <motion.button
        onClick={onQuickRoll}
        disabled={disabled}
        className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 text-sm font-semibold px-6 py-2 rounded-xl transition-colors disabled:opacity-50"
        whileTap={{ scale: 0.95 }}
      >
        Quick Roll
      </motion.button>

      {effectiveLuck > 1 && (
        <div className="text-sm text-purple-300 font-semibold bg-purple-950 border border-purple-700 px-4 py-1.5 rounded-full">
          {fmtLuck(effectiveLuck)}× Luck Active
        </div>
      )}
    </div>
  )
}
