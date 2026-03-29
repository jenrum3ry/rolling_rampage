import type { BiomeName } from '../types'

export const BIOME_DISPLAY_NAMES: Record<BiomeName, string> = {
  starlight: '✦ Starlight',
  midnight: '🌑 Midnight',
}

export const BIOME_COLORS: Record<BiomeName, string> = {
  starlight: '#f59e0b',
  midnight:  '#818cf8',
}

/**
 * Per-aura chance overrides while a biome is active.
 * Values replace the aura's normal chance for rolling purposes.
 */
export const BIOME_AURA_OVERRIDES: Record<BiomeName, Record<string, number>> = {
  starlight: {
    'eclipsed':    1_666_666,
    'crystalline': 11_500_000,
  },
  midnight: {
    'moonlight':      450_000,
    'twilight':     2_000_000,
    'shadow':          73_333,
    'supernova':      300_000,
    'prophecy':     3_500_000,
    'aurora':         100_000,
    'nebula':         500_000,
    'eclipse':      8_500_000,
    'galactic':     2_000_000,
    'ethereal':     5_500_000,
    'shadow-umbra': 7_333_333,
    'gravitas':    15_000_000,
    'nocturn':        900_000,
    'ryan':         1_200_000,
    'aperture':     4_444_444,
    'requiem':     10_000_000,
    'astral':          96_000,
    'sky':                277,
    'karma':            2_345,
  },
}
