import { motion, AnimatePresence } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import type { AuraDefinition } from '../types'
import { AuraEffect } from './AuraEffect'
import { CutsceneOverlay } from './CutsceneOverlay'
import { getAuraCategory, CATEGORY_COLORS } from '../utils/roll'

interface Props {
  aura: AuraDefinition | null
  onDismiss: () => void
}

export function AuraDisplay({ aura, onDismiss }: Props) {
  const [visible, setVisible] = useState(false)
  const [useCutscene, setUseCutscene] = useState(false)

  useEffect(() => {
    if (aura) {
      setUseCutscene(aura.chance >= 10_000)
      setVisible(true)

      // Standard overlay auto-dismisses after 3.5s; cutscene manages its own timer
      if (aura.chance < 10_000) {
        const timer = setTimeout(() => {
          setVisible(false)
          onDismiss()
        }, 3500)
        return () => clearTimeout(timer)
      }
    }
  }, [aura, onDismiss])

  const handleDismiss = useCallback(() => {
    setVisible(false)
    onDismiss()
  }, [onDismiss])

  if (!visible || !aura) return null

  // Rare drop cutscene
  if (useCutscene) {
    return <CutsceneOverlay aura={aura} onDone={handleDismiss} />
  }

  // Standard overlay
  return (
    <AnimatePresence>
      <motion.div
        key={`display-${aura.id}`}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer"
        style={{ background: 'rgba(0,0,0,0.78)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleDismiss}
      >
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.2, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          className="flex flex-col items-center gap-5"
        >
          <AuraEffect aura={aura} size={120} />

          <motion.div
            className="text-center px-8 py-4 rounded-2xl border"
            style={{
              background: 'rgba(0,0,0,0.65)',
              borderColor: aura.color,
              boxShadow: `0 0 20px ${aura.glowColor}`,
            }}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {(() => {
              const category = getAuraCategory(aura.chance)
              return (
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-1"
                  style={{ color: CATEGORY_COLORS[category] }}
                >
                  {category} · 1-in-{aura.chance.toLocaleString()}
                </p>
              )
            })()}
            <h2 className="text-3xl font-bold text-white mb-1">{aura.name}</h2>
            <p className="text-gray-300 text-sm mb-3">{aura.description}</p>
            <p className="text-lg font-semibold" style={{ color: aura.color }}>
              +{aura.chance.toLocaleString()} Stats
            </p>
          </motion.div>

          <p className="text-gray-500 text-sm">Click anywhere to dismiss</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
