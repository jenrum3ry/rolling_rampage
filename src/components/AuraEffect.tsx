import { motion } from 'framer-motion'
import { useMemo } from 'react'
import type { AuraDefinition } from '../types'

interface Props {
  aura: AuraDefinition
  size?: number
}

// ─── Phantom: White/cyan starburst with arrow rays (inspired by Luminous) ──
function PhantomEffect({ aura, size }: { aura: AuraDefinition; size: number }) {
  const rays = 8
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size + aura.glowSize * 2, height: size + aura.glowSize * 2 }}
    >
      {/* Ground rays spreading outward */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 3,
            height: aura.glowSize * 0.9,
            background: `linear-gradient(to top, transparent, rgba(255,255,255,0.9))`,
            left: '50%',
            top: '50%',
            transformOrigin: '50% 100%',
            transform: `rotate(${i * 30}deg) translateX(-1.5px)`,
          }}
          animate={{ opacity: [0.4, 1, 0.4], scaleY: [0.9, 1.1, 0.9] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
      {/* Outer glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size + aura.glowSize * 1.8,
          height: size + aura.glowSize * 1.8,
          background: `radial-gradient(circle, rgba(255,255,255,0.15) 0%, ${aura.glowColor} 40%, transparent 70%)`,
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* SVG starburst — 8 sharp arrow rays matching aura color */}
      <motion.svg
        className="absolute"
        width={size + aura.glowSize * 1.4}
        height={size + aura.glowSize * 1.4}
        viewBox="-100 -100 200 200"
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        style={{ filter: `drop-shadow(0 0 8px ${aura.color}) drop-shadow(0 0 20px ${aura.color})` }}
      >
        {Array.from({ length: rays }).map((_, i) => {
          const angle = (i / rays) * 360
          const r = (Math.PI / 180) * angle
          const tipX = Math.cos(r) * 90
          const tipY = Math.sin(r) * 90
          const lx = Math.cos(r + 0.25) * 35
          const ly = Math.sin(r + 0.25) * 35
          const rx = Math.cos(r - 0.25) * 35
          const ry = Math.sin(r - 0.25) * 35
          return (
            <polygon
              key={i}
              points={`${tipX},${tipY} ${lx},${ly} 0,0 ${rx},${ry}`}
              fill="white"
              opacity={0.85}
            />
          )
        })}
        {/* Inner star ring */}
        {Array.from({ length: rays }).map((_, i) => {
          const angle = (i / rays) * 360 + 22.5
          const r = (Math.PI / 180) * angle
          const tipX = Math.cos(r) * 52
          const tipY = Math.sin(r) * 52
          const lx = Math.cos(r + 0.3) * 22
          const ly = Math.sin(r + 0.3) * 22
          const rx = Math.cos(r - 0.3) * 22
          const ry = Math.sin(r - 0.3) * 22
          return (
            <polygon
              key={`inner-${i}`}
              points={`${tipX},${tipY} ${lx},${ly} 0,0 ${rx},${ry}`}
              fill={aura.color}
              opacity={0.7}
            />
          )
        })}
      </motion.svg>
      {/* Orbiting spheres */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * 360
        const r = (Math.PI / 180) * angle
        const dist = size * 0.55
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 10,
              height: 10,
              background: `radial-gradient(circle, white 30%, ${aura.color})`,
              boxShadow: `0 0 8px white`,
              left: '50%',
              top: '50%',
              marginLeft: -5,
              marginTop: -5,
            }}
            animate={{
              x: [Math.cos(r) * dist, Math.cos(r + Math.PI) * dist * 0.9, Math.cos(r) * dist],
              y: [Math.sin(r) * dist, Math.sin(r + Math.PI) * dist * 0.9, Math.sin(r) * dist],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 0.6, ease: 'easeInOut' }}
          />
        )
      })}
      {/* Core orb */}
      <motion.div
        className="relative z-10 rounded-full"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle, #ffffff 0%, ${aura.color} 45%, rgba(14,116,144,0.8) 100%)`,
          boxShadow: `0 0 40px white, 0 0 80px ${aura.glowColor}, 0 0 160px ${aura.glowColor}`,
        }}
        animate={{ scale: [1, 1.06, 1], boxShadow: [
          `0 0 40px white, 0 0 80px ${aura.glowColor}`,
          `0 0 70px white, 0 0 140px ${aura.glowColor}`,
          `0 0 40px white, 0 0 80px ${aura.glowColor}`,
        ]}}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

// ─── Astral: Violet galaxy spiral with orbital rings ─────────────────────
function AstralEffect({ aura, size }: { aura: AuraDefinition; size: number }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size + aura.glowSize * 2, height: size + aura.glowSize * 2 }}
    >
      {/* Rotating rings */}
      {[1, 0.75, 0.55].map((scale, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2"
          style={{
            width: (size + aura.glowSize * 1.2) * scale,
            height: (size + aura.glowSize * 1.2) * scale,
            borderColor: aura.color,
            opacity: 0.5 + i * 0.15,
          }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 6 + i * 3, repeat: Infinity, ease: 'linear' }}
        />
      ))}
      {/* Galaxy particles */}
      {Array.from({ length: aura.particleCount }).map((_, i) => {
        const angle = (i / aura.particleCount) * Math.PI * 2
        const spiral = 0.3 + (i / aura.particleCount) * 0.7
        const dist = aura.glowSize * 0.5 * spiral
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 3 + (i % 3),
              height: 3 + (i % 3),
              backgroundColor: i % 3 === 0 ? '#ffffff' : aura.color,
              left: '50%', top: '50%',
            }}
            animate={{
              x: [Math.cos(angle) * dist, Math.cos(angle + 0.5) * dist * 1.1, Math.cos(angle) * dist],
              y: [Math.sin(angle) * dist, Math.sin(angle + 0.5) * dist * 1.1, Math.sin(angle) * dist],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.04, ease: 'easeInOut' }}
          />
        )
      })}
      <motion.div
        className="relative z-10 rounded-full"
        style={{
          width: size, height: size,
          background: `radial-gradient(circle, #ffffff 0%, ${aura.color} 50%, #1e1b4b 100%)`,
          boxShadow: `0 0 ${aura.glowSize * 0.5}px ${aura.glowColor}, 0 0 ${aura.glowSize}px ${aura.glowColor}`,
        }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

// ─── Radiation: Green pulsing radioactive halos ───────────────────────────
function RadiationEffect({ aura, size }: { aura: AuraDefinition; size: number }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size + aura.glowSize * 2, height: size + aura.glowSize * 2 }}
    >
      {/* Expanding pulse rings */}
      {[0, 0.6, 1.2].map((delay, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2"
          style={{ borderColor: aura.color, width: size * 0.6, height: size * 0.6 }}
          animate={{ scale: [1, 3.5], opacity: [0.8, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay, ease: 'easeOut' }}
        />
      ))}
      {/* Warning triangles as particles */}
      {Array.from({ length: 3 }).map((_, i) => {
        const angle = i * 120
        const r = (Math.PI / 180) * angle
        const dist = aura.glowSize * 0.45
        return (
          <motion.div
            key={i}
            className="absolute text-lg"
            style={{ left: '50%', top: '50%', color: aura.color }}
            animate={{
              x: Math.cos(r) * dist,
              y: Math.sin(r) * dist,
              rotate: [0, 360],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 1.2, ease: 'easeInOut' }}
          >
            ☢
          </motion.div>
        )
      })}
      {/* Jagged particle cloud */}
      {Array.from({ length: aura.particleCount }).map((_, i) => {
        const angle = (i / aura.particleCount) * Math.PI * 2
        const dist = aura.glowSize * (0.3 + (i % 5) * 0.07)
        return (
          <motion.div
            key={i}
            className="absolute rounded-sm"
            style={{
              width: 2 + (i % 4), height: 2 + (i % 4),
              backgroundColor: aura.color,
              left: '50%', top: '50%',
            }}
            animate={{
              x: [Math.cos(angle) * dist, Math.cos(angle + 0.3) * dist * 1.2, Math.cos(angle) * dist],
              y: [Math.sin(angle) * dist, Math.sin(angle + 0.3) * dist * 1.2, Math.sin(angle) * dist],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 1.5 + (i % 3) * 0.5, repeat: Infinity, delay: i * 0.03 }}
          />
        )
      })}
      <motion.div
        className="relative z-10 rounded-full"
        style={{
          width: size, height: size,
          background: `radial-gradient(circle, #ffffff 0%, ${aura.color} 45%, #14532d 100%)`,
          boxShadow: `0 0 ${aura.glowSize * 0.5}px ${aura.glowColor}, 0 0 ${aura.glowSize}px ${aura.glowColor}`,
        }}
        animate={{ scale: [1, 1.08, 0.97, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </div>
  )
}

// ─── Nova: Gold exploding starburst ──────────────────────────────────────
function NovaEffect({ aura, size }: { aura: AuraDefinition; size: number }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size + aura.glowSize * 2, height: size + aura.glowSize * 2 }}
    >
      {/* Explosion shards */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2
        const len = aura.glowSize * (0.4 + (i % 3) * 0.2)
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 2, height: len,
              background: `linear-gradient(to top, transparent, ${aura.color})`,
              left: '50%', top: '50%',
              transformOrigin: '50% 100%',
              transform: `rotate(${(angle * 180) / Math.PI}deg) translateX(-1px)`,
            }}
            animate={{ scaleY: [0.7, 1.2, 0.7], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1 + (i % 3) * 0.4, repeat: Infinity, delay: i * 0.06 }}
          />
        )
      })}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size + aura.glowSize,
          height: size + aura.glowSize,
          background: `radial-gradient(circle, ${aura.glowColor} 0%, transparent 65%)`,
        }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
      <motion.div
        className="relative z-10 rounded-full"
        style={{
          width: size, height: size,
          background: `radial-gradient(circle, #ffffff 0%, ${aura.color} 40%, #78350f 100%)`,
          boxShadow: `0 0 ${aura.glowSize * 0.4}px ${aura.glowColor}, 0 0 ${aura.glowSize}px ${aura.glowColor}`,
        }}
        animate={{ scale: [1, 1.07, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </div>
  )
}

// ─── Helix: Red double-helix spiral ──────────────────────────────────────
function HelixEffect({ aura, size }: { aura: AuraDefinition; size: number }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size + aura.glowSize * 2, height: size + aura.glowSize * 2 }}
    >
      {Array.from({ length: aura.particleCount }).map((_, i) => {
        const t = i / aura.particleCount
        const helix1Angle = t * Math.PI * 6
        const helix2Angle = helix1Angle + Math.PI
        const r = aura.glowSize * 0.4
        return (
          <>
            <motion.div
              key={`h1-${i}`}
              className="absolute rounded-full"
              style={{
                width: 4, height: 4,
                backgroundColor: aura.color,
                left: '50%', top: '50%',
                marginLeft: -2, marginTop: -2,
              }}
              animate={{
                x: [Math.cos(helix1Angle) * r, Math.cos(helix1Angle + 0.5) * r],
                y: [Math.sin(helix1Angle) * r, Math.sin(helix1Angle + 0.5) * r],
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.5, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: t * 2 }}
            />
            <motion.div
              key={`h2-${i}`}
              className="absolute rounded-full"
              style={{
                width: 4, height: 4,
                backgroundColor: '#ff9999',
                left: '50%', top: '50%',
                marginLeft: -2, marginTop: -2,
              }}
              animate={{
                x: [Math.cos(helix2Angle) * r, Math.cos(helix2Angle + 0.5) * r],
                y: [Math.sin(helix2Angle) * r, Math.sin(helix2Angle + 0.5) * r],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: t * 2 + 0.1 }}
            />
          </>
        )
      })}
      <motion.div
        className="relative z-10 rounded-full"
        style={{
          width: size, height: size,
          background: `radial-gradient(circle, #fff 0%, ${aura.color} 50%, #450a0a 100%)`,
          boxShadow: `0 0 ${aura.glowSize * 0.5}px ${aura.glowColor}, 0 0 ${aura.glowSize}px ${aura.glowColor}`,
        }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  )
}

// ─── Odd: Amber glitching / distortion effect ─────────────────────────────
function OddEffect({ aura, size }: { aura: AuraDefinition; size: number }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size + aura.glowSize * 2, height: size + aura.glowSize * 2 }}
    >
      {/* Glitch offset copies */}
      {[-6, 6].map((offset, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: size * 0.9,
            height: size * 0.9,
            background: `radial-gradient(circle, ${i === 0 ? '#00ffff' : '#ff00ff'} 0%, transparent 60%)`,
            opacity: 0.3,
          }}
          animate={{ x: [0, offset, 0], opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 0.3, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
      {Array.from({ length: aura.particleCount }).map((_, i) => {
        const angle = (i / aura.particleCount) * Math.PI * 2
        const dist = aura.glowSize * (0.25 + (i % 5) * 0.08)
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: 3, height: 6,
              backgroundColor: aura.color,
              left: '50%', top: '50%',
              transform: `rotate(${i * 15}deg)`,
            }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              opacity: [0, 1, 0],
              scaleY: [1, 2, 1],
            }}
            transition={{ duration: 0.8 + (i % 3) * 0.3, repeat: Infinity, delay: i * 0.04 }}
          />
        )
      })}
      <motion.div
        className="relative z-10 rounded-full"
        style={{
          width: size, height: size,
          background: `radial-gradient(circle, #ffffff 0%, ${aura.color} 45%, #78350f 100%)`,
          boxShadow: `0 0 ${aura.glowSize * 0.5}px ${aura.glowColor}, 0 0 ${aura.glowSize}px ${aura.glowColor}`,
        }}
        animate={{ scale: [1, 1.05, 0.98, 1.03, 1], x: [0, -2, 2, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
    </div>
  )
}

// ─── Generic effect for all other auras ──────────────────────────────────
function GenericEffect({ aura, size }: { aura: AuraDefinition; size: number }) {
  const particles = useMemo(() => {
    return Array.from({ length: aura.particleCount }, (_, i) => ({
      id: i,
      angle: (i / aura.particleCount) * 360 + Math.random() * 15,
      dist: aura.glowSize * (0.3 + Math.random() * 0.35),
      delay: Math.random() * 2,
      dur: 1.5 + Math.random() * 2,
      sz: 3 + Math.floor(Math.random() * 3),
    }))
  }, [aura])

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size + aura.glowSize * 2, height: size + aura.glowSize * 2 }}
    >
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size + aura.glowSize * 1.4,
          height: size + aura.glowSize * 1.4,
          background: `radial-gradient(circle, ${aura.glowColor} 0%, transparent 70%)`,
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180
        const x = Math.cos(rad) * p.dist
        const y = Math.sin(rad) * p.dist
        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.sz, height: p.sz,
              backgroundColor: aura.color,
              left: '50%', top: '50%',
              marginLeft: -p.sz / 2, marginTop: -p.sz / 2,
            }}
            animate={{
              x: [x * 0.7, x, x * 0.85, x * 0.7],
              y: [y * 0.7, y, y * 0.85, y * 0.7],
              opacity: [0.4, 1, 0.6, 0.4],
              scale: [0.8, 1.2, 0.9, 0.8],
            }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          />
        )
      })}
      <motion.div
        className="relative z-10 rounded-full"
        style={{
          width: size, height: size,
          background: `radial-gradient(circle, #ffffff 0%, ${aura.color} 50%, ${aura.glowColor} 100%)`,
          boxShadow: `0 0 ${aura.glowSize * 0.5}px ${aura.glowColor}, 0 0 ${aura.glowSize}px ${aura.glowColor}`,
        }}
        animate={{
          boxShadow: [
            `0 0 ${aura.glowSize * 0.5}px ${aura.glowColor}, 0 0 ${aura.glowSize}px ${aura.glowColor}`,
            `0 0 ${aura.glowSize * 0.8}px ${aura.glowColor}, 0 0 ${aura.glowSize * 1.5}px ${aura.glowColor}`,
            `0 0 ${aura.glowSize * 0.5}px ${aura.glowColor}, 0 0 ${aura.glowSize}px ${aura.glowColor}`,
          ],
          scale: [1, 1.04, 1],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

// ─── Route to correct effect based on aura ID ────────────────────────────
export function AuraEffect({ aura, size = 100 }: Props) {
  switch (aura.id) {
    case 'phantom':
      return <PhantomEffect aura={aura} size={size} />
    case 'astral':
      return <AstralEffect aura={aura} size={size} />
    case 'radiation':
      return <RadiationEffect aura={aura} size={size} />
    case 'nova':
    case 'aureate-storm':
    case 'gilded-wrath':
      return <NovaEffect aura={aura} size={size} />
    case 'helix':
    case 'blood-tempest':
    case 'chaos-scar':
    case 'rage-corona':
      return <HelixEffect aura={aura} size={size} />
    case 'odd':
    case 'catalyst':
      return <OddEffect aura={aura} size={size} />
    default:
      return <GenericEffect aura={aura} size={size} />
  }
}
