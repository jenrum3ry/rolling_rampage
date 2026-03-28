import { useCallback, useState } from 'react'
import { useGameState } from './hooks/useGameState'
import { useAuth } from './hooks/useAuth'
import { useAutoRoll } from './hooks/useAutoRoll'
import { LoginScreen } from './components/LoginScreen'
import { TutorialModal } from './components/TutorialModal'
import { RollButton } from './components/RollButton'
import { AuraDisplay } from './components/AuraDisplay'
import { StatsPanel } from './components/StatsPanel'
import { Inventory } from './components/Inventory'
import { PotionPanel } from './components/PotionPanel'
import { GauntletPanel } from './components/GauntletPanel'
import { AuraIndex } from './components/AuraIndex'
import { AutoRollPanel } from './components/AutoRollPanel'
import { getEffectiveLuck } from './utils/roll'
import { AURA_MAP } from './data/auras'

type Tab = 'inventory' | 'potions' | 'gauntlets' | 'index' | 'auto-roll'

function Game({ username }: { username: string }) {
  const {
    state,
    roll,
    quickRoll,
    usePotion,
    completeTutorial,
    craftGauntlet,
    equipGauntlet,
    unequipGauntlet,
    setAutoRollEnabled,
    setAutoRollSpeed,
    resetGame,
    getInventoryCounts,
    canCraftGauntlet,
  } = useGameState(username)

  const { logout } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('inventory')
  const [displayKey, setDisplayKey] = useState(0)

  const effectiveLuck = getEffectiveLuck(state)
  const inventoryCounts = getInventoryCounts()

  const handleRoll = useCallback(() => {
    roll()
    setDisplayKey((k) => k + 1)
  }, [roll])

  const handleDismiss = useCallback(() => {}, [])

  // Auto-roll runs independently of manual roll overlays
  useAutoRoll(state, quickRoll, false)

  const lastAuraDef = state.lastRolledAura
    ? AURA_MAP[state.lastRolledAura.definitionId]
    : null

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: 'inventory', label: 'Inventory', badge: state.inventory.length },
    { id: 'potions', label: 'Potions', badge: state.potionInventory.length || undefined },
    { id: 'gauntlets', label: 'Gauntlets' },
    { id: 'index', label: 'Aura Index', badge: state.discoveredAuras.length || undefined },
    { id: 'auto-roll', label: 'Auto Roll' },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Tutorial */}
      {!state.tutorialComplete && (
        <TutorialModal onComplete={completeTutorial} />
      )}

      {/* Aura display overlay */}
      <AuraDisplay
        key={displayKey}
        aura={lastAuraDef ?? null}
        onDismiss={handleDismiss}
      />

      {/* Header */}
      <header className="border-b border-gray-800 px-5 py-3.5 flex items-center justify-between">
        <h1 className="text-xl font-extrabold tracking-tight">
          <span className="text-purple-400">Rolling</span>{' '}
          <span className="text-white">Rampage</span>
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm hidden sm:block">{username}</span>
          <button
            onClick={logout}
            className="text-xs text-gray-600 hover:text-gray-300 transition-colors"
          >
            Log out
          </button>
          <button
            onClick={resetGame}
            className="text-xs text-gray-600 hover:text-red-400 transition-colors"
          >
            Reset
          </button>
        </div>
      </header>

      {/* Equipped gauntlets bar */}
      {state.equippedGauntlets.length > 0 && (
        <div className="bg-purple-950 border-b border-purple-800 px-5 py-2 flex items-center gap-2 flex-wrap">
          <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">Equipped:</span>
          {state.equippedGauntlets.map((id) => {
            const g = { 'gauntlet-of-sparks': 'Sparks', 'gauntlet-of-storms': 'Storms', 'gauntlet-of-the-abyss': 'Abyss', 'gauntlet-of-hellfire': 'Hellfire' }[id] ?? id
            return (
              <span key={id} className="text-xs bg-purple-800 text-purple-200 px-2 py-0.5 rounded-full">{g}</span>
            )
          })}
        </div>
      )}

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Roll section */}
        <section className="flex flex-col items-center gap-3">
          <RollButton
            onRoll={handleRoll}
            onQuickRoll={quickRoll}
            effectiveLuck={effectiveLuck}
          />
          <p className="text-gray-600 text-sm">
            {state.totalRolls === 0
              ? 'Click to roll your first aura!'
              : `${state.totalRolls.toLocaleString()} rolls so far`}
          </p>
        </section>

        {/* Stats */}
        <StatsPanel state={state} />

        {/* Tabs */}
        <div>
          <div className="flex gap-1 mb-4 bg-gray-900 p-1 rounded-xl overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-700 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="bg-purple-500 text-white text-xs rounded-full px-1.5 py-0 leading-5">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {activeTab === 'inventory' && <Inventory state={state} />}
          {activeTab === 'potions' && (
            <PotionPanel state={state} onUsePotion={usePotion} />
          )}
          {activeTab === 'gauntlets' && (
            <GauntletPanel
              state={state}
              onCraft={craftGauntlet}
              onEquip={equipGauntlet}
              onUnequip={unequipGauntlet}
              canCraft={canCraftGauntlet}
              inventoryCounts={inventoryCounts}
            />
          )}
          {activeTab === 'index' && <AuraIndex state={state} />}
          {activeTab === 'auto-roll' && (
            <AutoRollPanel
              state={state}
              onToggle={setAutoRollEnabled}
              onSpeedChange={setAutoRollSpeed}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export function App() {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <LoginScreen />
  }

  return <Game username={currentUser} />
}
