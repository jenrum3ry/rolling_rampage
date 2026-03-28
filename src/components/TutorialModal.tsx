import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AURAS_DESC } from '../data/auras'
import { AuraEffect } from './AuraEffect'
import { rollAura } from '../utils/roll'
import type { AuraDefinition } from '../types'

interface Props {
  onComplete: () => void
}

export function TutorialModal({ onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [trialAura, setTrialAura] = useState<AuraDefinition | null>(null)

  function handleTrialRoll() {
    setTrialAura(rollAura(1))
  }

  const steps = [
    <StepWelcome key="welcome" onNext={() => setStep(1)} />,
    <StepRarities key="rarities" onNext={() => setStep(2)} />,
    <StepTryRoll key="try" onRoll={handleTrialRoll} result={trialAura} onFinish={onComplete} />,
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.88)' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-900 border border-gray-700 rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl"
        >
          {/* Progress dots */}
          <div className="flex gap-1 mb-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-purple-500' : 'bg-gray-700'}`}
              />
            ))}
          </div>
          {steps[step]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function StepWelcome({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center">
      <div className="text-5xl mb-4">⚡</div>
      <h1 className="text-3xl font-extrabold text-white mb-3">Welcome to Rolling Rampage</h1>
      <p className="text-gray-400 mb-6">
        Roll to collect auras. Each aura is its own unique rarity — from Dusty Wisp (1-in-2) all the way to Phantom (1-in-1,000,000). The rarer the aura, the bigger the stat bonus and the cooler the effect.
      </p>
      <button onClick={onNext} className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-8 py-3 rounded-xl transition-colors w-full">
        Let's Go
      </button>
    </div>
  )
}

function StepRarities({ onNext }: { onNext: () => void }) {
  // Show a sample of auras (every ~5th to keep the list manageable)
  const sample = AURAS_DESC.filter((_, i) => i % 5 === 0)
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4 text-center">Aura Rarities</h2>
      <p className="text-gray-400 text-sm text-center mb-4">
        Every aura has its own unique rarity. Higher chance = rarer = bigger stat bonus.
      </p>
      <div className="space-y-1.5 mb-6 max-h-64 overflow-y-auto">
        {sample.map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between rounded-lg px-3 py-2"
            style={{ background: `${a.color}15`, borderLeft: `3px solid ${a.color}` }}
          >
            <span className="font-bold text-sm" style={{ color: a.color }}>{a.name}</span>
            <span className="text-gray-400 text-xs">
              1-in-{a.chance >= 1000 ? `${(a.chance / 1000).toFixed(0)}k` : a.chance.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
      <button onClick={onNext} className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-8 py-3 rounded-xl transition-colors w-full">
        Got It
      </button>
    </div>
  )
}

function StepTryRoll({
  onRoll,
  result,
  onFinish,
}: {
  onRoll: () => void
  result: AuraDefinition | null
  onFinish: () => void
}) {
  return (
    <div className="text-center">
      <h2 className="text-xl font-bold text-white mb-2">Try a Roll</h2>
      <p className="text-gray-400 text-sm mb-6">Hit the button to roll a practice aura. Then claim your Beginner Potion (10,000× luck for 1 roll)!</p>

      {!result ? (
        <button
          onClick={onRoll}
          className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold px-10 py-4 rounded-2xl text-xl transition-colors mb-6 w-full"
        >
          ROLL
        </button>
      ) : (
        <div className="flex flex-col items-center gap-3 mb-6">
          <AuraEffect aura={result} size={80} />
          <p style={{ color: result.color }} className="font-bold text-sm">
            1-in-{result.chance.toLocaleString()}
          </p>
          <p className="text-white font-bold text-lg">{result.name}</p>
          <p className="text-gray-400 text-sm">{result.description}</p>
        </div>
      )}

      {result && (
        <button
          onClick={onFinish}
          className="bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-3 rounded-xl transition-colors w-full"
        >
          Start Playing — Claim Beginner Potion!
        </button>
      )}
    </div>
  )
}
