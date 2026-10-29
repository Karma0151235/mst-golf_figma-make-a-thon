import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { GolfTransition, SWAP_AT, TRANSITION_MS, type TransitionVariant } from './components/GolfTransition'
import type { Profile, Screen } from './lib/data'
import {
  AbilityScreen,
  CartScreen,
  EquipmentScreen,
  GearScreen,
  GreatScreen,
  LevelScreen,
  LoadingScreen,
  SignupScreen,
  type CartLine,
} from './screens/Onboarding'
import { FindLocationScreen, MapScreen } from './screens/Locations'
import { HomeScreen } from './screens/Home'
import { TutorialScreen } from './screens/Tutorial'

const FLOW: { id: Screen; label: string }[] = [
  { id: 'loading', label: 'Loading' },
  { id: 'signup', label: 'Sign up' },
  { id: 'level', label: 'Playing level' },
  { id: 'ability', label: 'Accessibility' },
  { id: 'equipment', label: 'Equipment' },
  { id: 'great', label: 'Great!' },
  { id: 'gear', label: 'Recommended gear' },
  { id: 'cart', label: 'Shopping cart' },
  { id: 'findLocation', label: 'Find location' },
  { id: 'map', label: 'Map' },
  { id: 'home', label: 'Home' },
  { id: 'tutorial', label: 'AI tutorial' },
]

const EMPTY: Profile = { name: '', email: '', provider: 'email', level: null, ability: null, hasGear: null }

export default function App() {
  const [screen, setScreen] = useState<Screen>('loading')
  const [profile, setProfile] = useState<Profile>(EMPTY)
  const [cart, setCart] = useState<CartLine[]>([])
  const [overlay, setOverlay] = useState<{ key: number; variant: TransitionVariant } | null>(null)
  const busy = useRef(false)
  const count = useRef(0)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  /** Navigate with a golf transition (default) or a quick crossfade. */
  const go = useCallback((next: Screen, quick = false) => {
    if (busy.current) return
    if (quick) return setScreen(next)
    busy.current = true
    count.current += 1
    setOverlay({ key: count.current, variant: count.current % 2 ? 'putt' : 'drive' })
    timers.current.push(
      window.setTimeout(() => setScreen(next), TRANSITION_MS * SWAP_AT),
      window.setTimeout(() => {
        setOverlay(null)
        busy.current = false
      }, TRANSITION_MS),
    )
  }, [])

  const level = profile.level ?? 'beginner'
  const named = { ...profile, name: profile.name || 'Golfer' }

  const view = (() => {
    switch (screen) {
      case 'loading':
        return <LoadingScreen onDone={() => go('signup')} />
      case 'signup':
        return (
          <SignupScreen
            onSubmit={(p) => {
              setProfile((s) => ({ ...s, ...p }))
              go('level')
            }}
          />
        )
      case 'level':
        return (
          <LevelScreen
            name={named.name}
            value={profile.level}
            onBack={() => go('signup', true)}
            onSelect={(l) => {
              setProfile((s) => ({ ...s, level: l }))
              go('ability')
            }}
          />
        )
      case 'ability':
        return (
          <AbilityScreen
            onBack={() => go('level', true)}
            onSubmit={(a) => {
              setProfile((s) => ({ ...s, ability: a }))
              go('equipment')
            }}
          />
        )
      case 'equipment':
        return (
          <EquipmentScreen
            onBack={() => go('ability', true)}
            onAnswer={(has) => {
              setProfile((s) => ({ ...s, hasGear: has }))
              go(has ? 'great' : 'gear')
            }}
          />
        )
      case 'great':
        return <GreatScreen onDone={() => go('findLocation')} />
      case 'gear':
        return (
          <GearScreen
            level={level}
            onBack={() => go('equipment', true)}
            onSkip={() => go('great')}
            onPurchase={(items) => {
              setCart((c) => {
                const next = [...c]
                items.forEach((it) => {
                  if (!next.some((l) => l.id === it.id)) next.push({ ...it, qty: 1 })
                })
                return next
              })
              go('cart')
            }}
          />
        )
      case 'cart':
        return (
          <CartScreen
            lines={cart}
            setLines={setCart}
            onBack={() => go('gear', true)}
            onCheckout={() => {
              setCart([])
              go('findLocation')
            }}
          />
        )
      case 'findLocation':
        return <FindLocationScreen name={named.name} onFind={() => go('map')} />
      case 'map':
        return <MapScreen onNextTime={() => go('home')} />
      case 'home':
        return (
          <HomeScreen
            profile={named}
            cartCount={cart.reduce((s, l) => s + l.qty, 0)}
            onNewToGolf={() => go('tutorial')}
            onLocations={() => go('map')}
            onShop={() => go(cart.length ? 'cart' : 'gear')}
          />
        )
      case 'tutorial':
        return <TutorialScreen profile={named} onBack={() => go('home')} />
    }
  })()

  const activeIndex = FLOW.findIndex((f) => f.id === screen)

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[radial-gradient(ellipse_at_top,#0f2a19_0%,#050605_60%)] sm:gap-16 sm:p-6">
      {/* Desktop-only flow index for demoing */}
      <aside className="hidden w-60 shrink-0 lg:block">
        <div className="font-display text-[13px] font-bold uppercase tracking-[0.3em] text-mst-bright">Make-a-thon</div>
        <div className="mt-1 font-display text-4xl font-extrabold uppercase italic leading-[0.9]">
          MST Golf
          <br />
          Arena onboarding
        </div>
        <ol className="mt-8 space-y-1">
          {FLOW.map((f, i) => (
            <li key={f.id}>
              <button
                onClick={() => go(f.id, true)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition ${
                  i === activeIndex ? 'bg-white/10 text-white' : 'text-white/45 hover:text-white/80'
                }`}
              >
                <span
                  className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold ${
                    i === activeIndex ? 'bg-mst text-white' : 'bg-white/5'
                  }`}
                >
                  {i + 1}
                </span>
                {f.label}
              </button>
            </li>
          ))}
        </ol>
      </aside>

      <div className="relative h-[100dvh] w-full overflow-hidden bg-ink sm:h-[min(874px,calc(100dvh-48px))] sm:w-[402px] sm:rounded-[52px] sm:shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9),0_0_0_10px_#000,0_0_0_11px_rgba(255,255,255,0.08)]">
        {/* Dynamic island */}
        <div className="pointer-events-none absolute left-1/2 top-3 z-[60] hidden h-8 w-28 -translate-x-1/2 rounded-full bg-black sm:block" />
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {view}
          </motion.div>
        </AnimatePresence>
        {overlay && <GolfTransition key={overlay.key} variant={overlay.variant} />}
      </div>
    </div>
  )
}
