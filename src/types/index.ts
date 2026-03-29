export interface AuraDefinition {
  id: string
  name: string
  chance: number        // 1-in-N (stat bonus = this value)
  color: string         // hex
  glowColor: string     // rgba CSS
  particleCount: number
  glowSize: number      // px
  description: string
}

export interface OwnedAura {
  definitionId: string
  rolledAt: number
}

export type AutoRollSpeed = 'slow' | 'normal' | 'fast' | 'very-fast' | 'ultra'

export type BiomeName = 'starlight' | 'midnight'

export interface BonusAuraChance {
  auraId: string
  chance: number
}

export interface Potion {
  id: string
  name: string
  description: string
  luckMultiplier: number
  rollsRemaining: number
  type: 'luck' | 'portal' | 'supersonic' | 'speed' | 'techno' | 'biome'
  simulatedRolls?: number
  speedMultiplier?: number
  durationMs?: number
  bonusAuraChances?: BonusAuraChance[]
}

export interface GauntletReward {
  luckBonus: number    // percent (+50 = 1.5× effective luck)
  speedBonus: number   // percent (+10 = 10% faster rolls)
  description: string
}

export interface GauntletDef {
  id: string
  name: string
  requiredAuras: { auraId: string; count: number }[]
  reward: GauntletReward
}

export interface ActiveSpeedPotion {
  endTime: number
  speedMultiplier: number
}

export interface GameState {
  inventory: OwnedAura[]
  totalStats: number
  luckMultiplier: number
  activePotions: Potion[]
  potionInventory: Potion[]
  totalRolls: number
  tutorialComplete: boolean
  lastRolledAura: OwnedAura | null
  equippedGauntlets: string[]
  completedGauntlets: string[]
  autoRollEnabled: boolean
  autoRollSpeed: AutoRollSpeed
  discoveredAuras: string[]
  equippedAura: string | null
  activeSpeedPotions: ActiveSpeedPotion[]
  autoRollRareNotification: OwnedAura | null
  lastAutoRolledAura: OwnedAura | null
  activeBiome: BiomeName | null
  biomeEndTime: number | null
  blessingCooldownEndTime: number | null
  blessingEndTime: number | null
}
