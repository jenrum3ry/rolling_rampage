import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { AuraDefinition } from '../types'
import { AuraEffect } from './AuraEffect'

type Phase =
  | 'star-spin'    // spinning star buildup
  | 'reveal'       // aura card appears
  | 'hold'         // white-flash tier only: hold before cracks
  | 'crack1'
  | 'crack2'
  | 'done'

interface Props {
  aura: AuraDefinition
  onDone: () => void
}

export function CutsceneOverlay({ aura, onDone }: Props) {
  const isWhiteFlashTier = aura.chance >= 100_000
  const [phase, setPhase] = useState<Phase>('star-spin')

  useEffect(() => {
    // Phase timeline
    const timers: ReturnType<typeof setTimeout>[] = []

    timers.push(setTimeout(() => setPhase('reveal'), 2500))

    if (isWhiteFlashTier) {
      timers.push(setTimeout(() => setPhase('hold'), 4000))
      timers.push(setTimeout(() => setPhase('crack1'), 5000))
      timers.push(setTimeout(() => setPhase('crack2'), 5500))
      timers.push(setTimeout(() => setPhase('done'), 6200))
    } else {
      timers.push(setTimeout(() => setPhase('done'), 4200))
    }

    return () => timers.forEach(clearTimeout)
  }, [isWhiteFlashTier])

  useEffect(() => {
    if (phase === 'done') onDone()
  }, [phase, onDone])

  const rays = 12

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden cursor-pointer"
      style={{ background: 'rgba(0,0,0,0.92)' }}
      onClick={onDone}
    >
      {/* White flash screen (crack tier) */}
      <AnimatePresence>
        {(phase === 'hold' || phase === 'crack1' || phase === 'crack2') && (
          <motion.div
            className="absolute inset-0 bg-white z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'hold' ? 0.95 : 0.85 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Crack lines */}
      <AnimatePresence>
        {(phase === 'crack1' || phase === 'crack2') && (
          <>
            <CrackLine key="c1" angle={-35} delay={0} />
            {phase === 'crack2' && <CrackLine key="c2" angle={50} delay={0} />}
          </>
        )}
      </AnimatePresence>

      {/* Ground rays */}
      <AnimatePresence>
        {(phase === 'star-spin' || phase === 'reveal') && (
          <motion.div
            className="absolute bottom-0 left-1/2"
            style={{ transform: 'translateX(-50%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: rays }).map((_, i) => {
              const spread = ((i - rays / 2) / rays) * 120
              return (
                <motion.div
                  key={i}
                  className="absolute bottom-0 origin-bottom"
                  style={{
                    width: 3,
                    height: 280,
                    background: `linear-gradient(to top, ${aura.color}cc, transparent)`,
                    left: '50%',
                    marginLeft: -1.5,
                    transform: `rotate(${spread}deg)`,
                  }}
                  animate={{ scaleY: [0.8, 1.15, 0.8], opacity: [0.4, 0.85, 0.4] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.1 }}
                />
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spinning star */}
      <AnimatePresence>
        {(phase === 'star-spin' || phase === 'reveal') && (
          <motion.div
            className="absolute"
            initial={{ scale: 0, rotate: 0, opacity: 0 }}
            animate={{ scale: 1.6, rotate: 1080, opacity: phase === 'reveal' ? 0.2 : 1 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{
              scale: { duration: 2.5, ease: 'easeOut' },
              rotate: { duration: 2.5, ease: 'easeOut' },
              opacity: { duration: 0.4 },
            }}
            style={{ filter: `drop-shadow(0 0 16px ${aura.color}) drop-shadow(0 0 40px ${aura.color})` }}
          >
            <svg width="340" height="340" viewBox="-100 -100 200 200">
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * 360
                const r = (Math.PI / 180) * angle
                const tipX = Math.cos(r) * 95
                const tipY = Math.sin(r) * 95
                const lx = Math.cos(r + 0.22) * 38
                const ly = Math.sin(r + 0.22) * 38
                const rx = Math.cos(r - 0.22) * 38
                const ry = Math.sin(r - 0.22) * 38
                return (
                  <polygon
                    key={i}
                    points={`${tipX},${tipY} ${lx},${ly} 0,0 ${rx},${ry}`}
                    fill={aura.chance >= 960_000 ? 'white' : aura.color}
                    opacity={0.9}
                  />
                )
              })}
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aura reveal */}
      <AnimatePresence>
        {(phase === 'reveal' || phase === 'hold') && (
          <motion.div
            className="flex flex-col items-center gap-4 z-10"
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ type: 'spring', stiffness: 180, damping: 15 }}
          >
            <AuraEffect aura={aura} size={140} />
            <motion.div
              className="text-center px-8 py-4 rounded-2xl border"
              style={{
                background: 'rgba(0,0,0,0.7)',
                borderColor: aura.color,
                boxShadow: `0 0 24px ${aura.glowColor}`,
              }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: aura.color }}>
                1-in-{aura.chance.toLocaleString()}
              </p>
              <h2 className="text-3xl font-extrabold text-white mb-1">{aura.name}</h2>
              <p className="text-gray-300 text-sm mb-2">{aura.description}</p>
              <p className="text-lg font-semibold" style={{ color: aura.color }}>
                +{aura.chance.toLocaleString()} Stats
              </p>
            </motion.div>
            <p className="text-gray-500 text-xs">Click to skip</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CrackLine({ angle, delay }: { angle: number; delay: number }) {
  return (
    <motion.div
      className="absolute z-30"
      style={{
        width: '120vw',
        height: 4,
        background: 'linear-gradient(to right, transparent, #000, #000, transparent)',
        left: '50%',
        top: '50%',
        transformOrigin: 'center',
        transform: `translateX(-50%) translateY(-50%) rotate(${angle}deg)`,
      }}
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ duration: 0.15, delay }}
    />
  )
}
