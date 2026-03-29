import { useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { GameState, AuraDefinition, OwnedAura } from '../types'
import { AURA_MAP } from '../data/auras'
import { BIOME_DISPLAY_NAMES, BIOME_COLORS } from '../data/biomes'
import { getAuraCategory, CATEGORY_COLORS } from '../utils/roll'
import { PlayerCharacter } from './PlayerCharacter'
import { usePlayerMovement } from '../hooks/usePlayerMovement'

interface Props {
  state: GameState
  onRoll: () => void
  onQuickRoll: () => void
  effectiveLuck: number
  equippedAura: string | null
  autoRollRareNotification: OwnedAura | null
  onDismissRareNotification: () => void
}

const WORLD_W = 640
const WORLD_H = 280

function formatLuck(luck: number): string {
  if (luck >= 1_000_000) return `${(luck / 1_000_000).toFixed(1)}M×`
  if (luck >= 1_000) return `${(luck / 1_000).toFixed(1)}K×`
  return `${luck.toFixed(1)}×`
}

export function GameWorld({
  state,
  onRoll,
  onQuickRoll,
  effectiveLuck,
  equippedAura,
  autoRollRareNotification,
  onDismissRareNotification,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { playerState } = usePlayerMovement(WORLD_W, WORLD_H)

  // Auto-dismiss rare notification after 4 seconds
  useEffect(() => {
    if (!autoRollRareNotification) return
    const timer = setTimeout(onDismissRareNotification, 4000)
    return () => clearTimeout(timer)
  }, [autoRollRareNotification, onDismissRareNotification])

  // Character display: equipped aura > lastRolledAura
  const displayAuraId = equippedAura ?? state.lastRolledAura?.definitionId ?? null
  const displayAura: AuraDefinition | null = displayAuraId ? (AURA_MAP[displayAuraId] ?? null) : null

  const lastAura: AuraDefinition | null = state.lastRolledAura
    ? (AURA_MAP[state.lastRolledAura.definitionId] ?? null)
    : null

  const category = lastAura ? getAuraCategory(lastAura.chance) : null
  const categoryColor = category ? (CATEGORY_COLORS[category] ?? '#9ca3af') : '#9ca3af'

  const charX = WORLD_W / 2 + playerState.x - 60
  const charY = WORLD_H / 2 + playerState.y - 60

  // Rare notification aura def
  const rareNotifAura = autoRollRareNotification
    ? (AURA_MAP[autoRollRareNotification.definitionId] ?? null)
    : null
  const rareCategory = rareNotifAura ? getAuraCategory(rareNotifAura.chance) : null
  const rareCategoryColor = rareCategory ? (CATEGORY_COLORS[rareCategory] ?? '#9ca3af') : '#9ca3af'

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Game viewport */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-xl border border-gray-700 select-none"
        style={{
          width: '100%',
          maxWidth: WORLD_W,
          height: WORLD_H,
          background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0d0d14 70%, #050508 100%)',
          backgroundImage: `
            radial-gradient(ellipse at center, #1a1a2e 0%, #0d0d14 70%, #050508 100%),
            linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 40px 40px, 40px 40px',
        }}
      >
        {/* Ground plane */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: 40,
            background: 'linear-gradient(to top, rgba(139,92,246,0.1), transparent)',
            borderTop: '1px solid rgba(139,92,246,0.2)',
          }}
        />

        {/* Character */}
        <div
          className="absolute"
          style={{ left: charX, top: charY }}
        >
          <PlayerCharacter
            aura={displayAura}
            facingLeft={playerState.facingLeft}
            jumping={playerState.jumping}
          />
        </div>

        {/* Rare drop notification banner */}
        <AnimatePresence>
          {rareNotifAura && (
            <motion.div
              key="rare-notif"
              initial={{ y: -60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -60, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
              style={{
                background: 'rgba(0,0,0,0.85)',
                border: `1px solid ${rareNotifAura.color}`,
                boxShadow: `0 0 16px ${rareNotifAura.color}66`,
                color: rareNotifAura.color,
                whiteSpace: 'nowrap',
              }}
              onClick={onDismissRareNotification}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: rareNotifAura.color, boxShadow: `0 0 6px ${rareNotifAura.color}` }}
              />
              <span style={{ color: rareCategoryColor }}>{rareCategory}</span>
              <span>{rareNotifAura.name}</span>
              <span className="opacity-50 ml-1">auto-rolled!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HUD — top left: current aura */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {lastAura ? (
            <div
              className="px-2 py-1 rounded-lg text-xs font-bold"
              style={{
                background: 'rgba(0,0,0,0.65)',
                border: `1px solid ${lastAura.color}`,
                color: lastAura.color,
              }}
            >
              <span className="opacity-60 mr-1" style={{ color: categoryColor }}>
                {category}
              </span>
              {lastAura.name}
            </div>
          ) : (
            <div className="px-2 py-1 rounded-lg text-xs text-gray-500 font-medium"
              style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              No aura yet
            </div>
          )}
          <div
            className="px-2 py-0.5 rounded text-xs text-gray-400"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          >
            {state.totalRolls.toLocaleString()} rolls
          </div>
        </div>

        {/* HUD — top right: luck + active biome */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
          {effectiveLuck > 1 && (
            <div
              className="px-2 py-1 rounded-lg text-xs font-bold text-yellow-300"
              style={{ background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(251,191,36,0.4)' }}
            >
              {formatLuck(effectiveLuck)} luck
            </div>
          )}
          {state.activeBiome && (
            <div
              className="px-2 py-1 rounded-lg text-xs font-bold"
              style={{
                background: 'rgba(0,0,0,0.65)',
                border: `1px solid ${BIOME_COLORS[state.activeBiome]}66`,
                color: BIOME_COLORS[state.activeBiome],
              }}
            >
              {BIOME_DISPLAY_NAMES[state.activeBiome]}
            </div>
          )}
        </div>

        {/* Roll button — bottom center */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <button
            onClick={onRoll}
            className="px-5 py-2 rounded-xl font-extrabold text-sm uppercase tracking-widest transition-all active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              boxShadow: '0 0 20px rgba(124,58,237,0.6)',
              color: '#fff',
              border: '1px solid rgba(167,139,250,0.5)',
            }}
          >
            Roll <span className="opacity-60 text-xs normal-case">[Space]</span>
          </button>
          <button
            onClick={onQuickRoll}
            className="px-3 py-2 rounded-lg text-xs font-medium text-gray-400 transition-all active:scale-95 hover:text-white"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            Quick [Q]
          </button>
        </div>

        {/* Controls hint — bottom left */}
        <div
          className="absolute bottom-3 left-3 text-xs text-gray-600"
          style={{ lineHeight: 1.4 }}
        >
          WASD / ↑↓←→ move · Space roll/jump
        </div>
      </div>
    </div>
  )
}
