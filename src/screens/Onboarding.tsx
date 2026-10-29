import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import {
  Accessibility,
  ArrowRight,
  Check,
  Ear,
  Eye,
  Hand,
  Mail,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  User,
} from 'lucide-react'
import { Button, Eyebrow, GolfBall, Logo, StepHeader, Title } from '../components/ui'
import { GEAR, LEVELS, PHOTOS, rm, type GearItem, type Level, type Profile } from '../lib/data'

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
}

/* ---------- Screen 1: Loading ---------- */
export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [p, setP] = useState(0)
  const done = useRef(onDone)
  done.current = onDone
  useEffect(() => {
    const start = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const v = Math.min(1, (t - start) / 2600)
      setP(v)
      if (v < 1) raf = requestAnimationFrame(tick)
      else setTimeout(() => done.current(), 250)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-ink">
      <img src={PHOTOS.loading} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/30 to-ink" />
      <div className="relative flex flex-1 flex-col items-center justify-center px-8 text-center">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7 }}>
          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-mst shadow-[0_0_60px_rgba(0,150,57,0.6)]">
            <span className="font-display text-3xl font-extrabold italic text-white">MST</span>
          </div>
        </motion.div>
        <motion.h1
          {...fadeUp}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="font-display text-6xl font-extrabold uppercase italic leading-[0.85]"
        >
          Golf
          <br />
          <span className="text-mst-bright">Arena</span>
        </motion.h1>
        <motion.p {...fadeUp} transition={{ delay: 0.5 }} className="mt-4 text-sm text-white/60">
          All-weather bays. Big energy. Everyone plays.
        </motion.p>
      </div>
      {/* Putting-green progress: ball rolls toward the cup */}
      <div className="relative px-10 pb-16">
        <div className="relative h-8">
          <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-white/10" />
          <div
            className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-mst"
            style={{ width: `${p * 100}%` }}
          />
          <div className="absolute right-0 top-1/2 h-3 w-6 -translate-y-1/2 rounded-[50%] bg-black ring-2 ring-white/20" />
          <div className="absolute -top-8 right-[11px] h-10 w-[2px] bg-white/80">
            <div className="absolute left-[2px] top-0 h-4 w-6 bg-mst" style={{ clipPath: 'polygon(0 0,100% 50%,0 100%)' }} />
          </div>
          <div
            className="absolute top-1/2"
            style={{
              left: `calc(${p * 100}% - ${p * 20}px)`,
              transform: `translateY(-50%) rotate(${p * 900}deg) scale(${p > 0.97 ? 0.6 : 1})`,
            }}
          >
            <GolfBall size={18} />
          </div>
        </div>
        <div className="mt-4 flex justify-between text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40">
          <span>Lining up the putt</span>
          <span>{Math.round(p * 100)}%</span>
        </div>
      </div>
    </div>
  )
}

/* ---------- Screen 2: Signup ---------- */
function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  )
}
function AppleMark() {
  return (
    <svg width="17" height="17" viewBox="0 0 384 512" fill="currentColor" aria-hidden>
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  )
}

export function SignupScreen({ onSubmit }: { onSubmit: (p: Pick<Profile, 'name' | 'email' | 'provider'>) => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const valid = name.trim().length > 1 && /^\S+@\S+\.\S+$/.test(email)

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-ink no-scrollbar">
      <div className="relative h-[34%] min-h-[220px] shrink-0 overflow-hidden">
        <img src={PHOTOS.aerial} alt="Aerial view of a golf course" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/20 to-ink" />
        <Logo className="absolute left-6 top-14" />
      </div>
      <div className="relative -mt-10 flex flex-1 flex-col px-6 pb-8">
        <Eyebrow>Create your player card</Eyebrow>
        <Title>
          Step up
          <br />
          to the tee
        </Title>
        <div className="mt-7 grid grid-cols-2 gap-3">
          <button
            onClick={() => onSubmit({ name: 'Alex', email: 'alex@gmail.com', provider: 'google' })}
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-white text-sm font-bold text-ink transition hover:bg-chalk active:scale-[0.98]"
          >
            <GoogleMark /> Google
          </button>
          <button
            onClick={() => onSubmit({ name: 'Alex', email: 'alex@icloud.com', provider: 'apple' })}
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-ink-3 text-sm font-bold text-white ring-1 ring-white/15 transition hover:bg-white/10 active:scale-[0.98]"
          >
            <AppleMark /> Apple
          </button>
        </div>
        <div className="my-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/35">
          <div className="h-px flex-1 bg-white/10" /> or with email <div className="h-px flex-1 bg-white/10" />
        </div>
        <form
          className="flex flex-1 flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            if (valid) onSubmit({ name: name.trim(), email: email.trim(), provider: 'email' })
          }}
        >
          <Field icon={<User size={17} />} label="Full name" value={name} onChange={setName} autoComplete="name" />
          <Field
            icon={<Mail size={17} />}
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
          />
          <div className="mt-auto pt-6">
            <Button type="submit" disabled={!valid}>
              Continue <ArrowRight size={18} />
            </Button>
            <p className="mt-4 text-center text-[11px] leading-relaxed text-white/35">
              By continuing you agree to MST Golf's Terms and Privacy Policy.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({
  icon,
  label,
  value,
  onChange,
  type = 'text',
  autoComplete,
}: {
  icon: React.ReactNode
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  autoComplete?: string
}) {
  return (
    <label className="group flex h-14 items-center gap-3 rounded-2xl bg-ink-2 px-4 ring-1 ring-white/10 transition focus-within:ring-2 focus-within:ring-mst">
      <span className="text-white/40 group-focus-within:text-mst-bright">{icon}</span>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        aria-label={label}
        className="h-full flex-1 bg-transparent text-[15px] font-medium text-white placeholder:text-white/35 focus:outline-none"
      />
    </label>
  )
}

/* ---------- Screen 3: Level ---------- */
const LEVEL_GLYPH: Record<Level, number> = { beginner: 1, intermediate: 2, professional: 3 }

export function LevelScreen({
  name,
  value,
  onSelect,
  onBack,
}: {
  name: string
  value: Level | null
  onSelect: (l: Level) => void
  onBack: () => void
}) {
  const [sel, setSel] = useState<Level | null>(value)
  return (
    <div className="flex h-full flex-col bg-ink">
      <StepHeader step={1} onBack={onBack} />
      <div className="flex flex-1 flex-col px-6 pb-8 pt-8">
        <Eyebrow>Hi {name.split(' ')[0]}</Eyebrow>
        <Title>
          What's your
          <br />
          playing level?
        </Title>
        <div className="mt-8 flex flex-col gap-3">
          {LEVELS.map((l, i) => {
            const on = sel === l.id
            return (
              <motion.button
                key={l.id}
                {...fadeUp}
                transition={{ delay: 0.08 * i }}
                onClick={() => setSel(l.id)}
                className={`relative flex items-center gap-4 overflow-hidden rounded-3xl p-5 text-left ring-1 transition ${
                  on ? 'bg-mst/15 ring-2 ring-mst' : 'bg-ink-2 ring-white/10 hover:bg-ink-3'
                }`}
              >
                {/* flags = difficulty */}
                <div className="flex h-12 w-12 shrink-0 items-end justify-center gap-[3px] rounded-2xl bg-black/40 pb-2.5">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className={`w-1.5 rounded-full transition ${n <= LEVEL_GLYPH[l.id] ? (on ? 'bg-mst-bright' : 'bg-white/80') : 'bg-white/15'}`}
                      style={{ height: 8 + n * 6 }}
                    />
                  ))}
                </div>
                <div className="flex-1">
                  <div className="font-display text-2xl font-bold uppercase italic leading-none">{l.title}</div>
                  <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-mst-bright">
                    {l.handicap}
                  </div>
                  <div className="mt-1.5 text-[13px] leading-snug text-white/55">{l.blurb}</div>
                </div>
                <div
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ring-1 transition ${on ? 'bg-mst ring-mst' : 'ring-white/25'}`}
                >
                  {on && <Check size={14} strokeWidth={3} />}
                </div>
              </motion.button>
            )
          })}
        </div>
        <div className="mt-auto pt-6">
          <Button disabled={!sel} onClick={() => sel && onSelect(sel)}>
            Continue <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ---------- Screen 4: Differently abled ---------- */
const SUPPORT = [
  { id: 'Mobility', icon: Accessibility, label: 'Mobility', hint: 'Seated or wheelchair play' },
  { id: 'Vision', icon: Eye, label: 'Vision', hint: 'Audio cues & high contrast' },
  { id: 'Hearing', icon: Ear, label: 'Hearing', hint: 'Visual signals & captions' },
  { id: 'Limb', icon: Hand, label: 'Limb difference', hint: 'One-handed or adaptive grips' },
]

export function AbilityScreen({
  onSubmit,
  onBack,
}: {
  onSubmit: (a: { needsSupport: boolean; notes: string[] }) => void
  onBack: () => void
}) {
  const [answer, setAnswer] = useState<boolean | null>(null)
  const [notes, setNotes] = useState<string[]>([])
  const toggle = (id: string) => setNotes((n) => (n.includes(id) ? n.filter((x) => x !== id) : [...n, id]))

  return (
    <div className="flex h-full flex-col bg-ink">
      <StepHeader step={2} onBack={onBack} />
      <div className="flex flex-1 flex-col overflow-y-auto px-6 pb-8 pt-8 no-scrollbar">
        <Eyebrow>Golf for everyone</Eyebrow>
        <Title>
          Are you
          <br />
          differently abled?
        </Title>
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          Our Arenas have adaptive bays and coaches. Tell us so we can set things up for you — this stays private.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {[
            { v: true, label: 'Yes' },
            { v: false, label: 'No' },
          ].map((o) => (
            <button
              key={o.label}
              onClick={() => {
                setAnswer(o.v)
                if (!o.v) setNotes([])
              }}
              className={`h-16 rounded-2xl font-display text-2xl font-bold uppercase italic ring-1 transition ${
                answer === o.v ? 'bg-mst text-white ring-mst' : 'bg-ink-2 text-white/80 ring-white/10 hover:bg-ink-3'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
        {answer && (
          <motion.div {...fadeUp} className="mt-6">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">
              What would help? (optional)
            </div>
            <div className="grid grid-cols-2 gap-3">
              {SUPPORT.map(({ id, icon: Icon, label, hint }) => {
                const on = notes.includes(id)
                return (
                  <button
                    key={id}
                    onClick={() => toggle(id)}
                    className={`rounded-2xl p-4 text-left ring-1 transition ${on ? 'bg-mst/15 ring-2 ring-mst' : 'bg-ink-2 ring-white/10 hover:bg-ink-3'}`}
                  >
                    <Icon size={20} className={on ? 'text-mst-bright' : 'text-white/60'} />
                    <div className="mt-3 text-sm font-bold">{label}</div>
                    <div className="mt-0.5 text-[11px] leading-snug text-white/45">{hint}</div>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
        <div className="mt-auto pt-6">
          <Button disabled={answer === null} onClick={() => onSubmit({ needsSupport: !!answer, notes })}>
            Continue <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ---------- Screen 5: Equipment ---------- */
export function EquipmentScreen({ onAnswer, onBack }: { onAnswer: (has: boolean) => void; onBack: () => void }) {
  return (
    <div className="flex h-full flex-col bg-ink">
      <StepHeader step={3} onBack={onBack} />
      <div className="flex flex-1 flex-col px-6 pb-8 pt-8">
        <Eyebrow>Your bag</Eyebrow>
        <Title>
          Got your own
          <br />
          golf gear?
        </Title>
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          Clubs, balls, glove — anything you'd bring to the bay.
        </p>
        <div className="mt-8 grid flex-1 grid-rows-2 gap-3">
          <button
            onClick={() => onAnswer(true)}
            className="group relative overflow-hidden rounded-3xl text-left ring-1 ring-white/10 transition hover:ring-mst"
          >
            <img src={PHOTOS.bag} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <div>
                <div className="font-display text-4xl font-extrabold uppercase italic leading-none">Yes</div>
                <div className="mt-1 text-sm text-white/70">I'm bringing my own bag</div>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-full bg-mst transition group-hover:translate-x-1">
                <ArrowRight size={18} />
              </span>
            </div>
          </button>
          <button
            onClick={() => onAnswer(false)}
            className="group relative overflow-hidden rounded-3xl bg-ink-2 text-left ring-1 ring-white/10 transition hover:ring-mst"
          >
            <img src={PHOTOS.ball} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40 transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <div>
                <div className="font-display text-4xl font-extrabold uppercase italic leading-none">Not yet</div>
                <div className="mt-1 text-sm text-white/70">Show me what I need</div>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white/10 ring-1 ring-white/20 transition group-hover:translate-x-1">
                <ArrowRight size={18} />
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

/* ---------- Screen 6: Great! ---------- */
export function GreatScreen({ onDone }: { onDone: () => void }) {
  const done = useRef(onDone)
  done.current = onDone
  useEffect(() => {
    const t = setTimeout(() => done.current(), 2000)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className="relative grid h-full place-items-center overflow-hidden bg-ink">
      <motion.div
        className="absolute h-72 w-72 rounded-full bg-mst/30 blur-3xl"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: [0.4, 1.3, 1.6], opacity: [0, 1, 0] }}
        transition={{ duration: 2 }}
      />
      <motion.h1
        className="relative font-display text-[96px] font-extrabold uppercase italic leading-none"
        initial={{ opacity: 0, scale: 0.7, y: 20 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.7, 1, 1.02, 1.1], y: [20, 0, 0, -10] }}
        transition={{ duration: 1.9, times: [0, 0.25, 0.7, 1] }}
      >
        Great<span className="text-mst-bright">!</span>
      </motion.h1>
    </div>
  )
}

/* ---------- Screen 7: Recommended gear ---------- */
export function GearScreen({
  level,
  onPurchase,
  onSkip,
  onBack,
}: {
  level: Level
  onPurchase: (items: GearItem[]) => void
  onSkip: () => void
  onBack: () => void
}) {
  const items = GEAR[level]
  const [picked, setPicked] = useState<string[]>(items.map((i) => i.id))
  const chosen = items.filter((i) => picked.includes(i.id))
  const total = chosen.reduce((s, i) => s + i.price, 0)
  const levelTitle = LEVELS.find((l) => l.id === level)!.title

  return (
    <div className="flex h-full flex-col bg-ink">
      <StepHeader step={4} onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-6 pb-4 pt-8 no-scrollbar">
        <Eyebrow>Picked for a {levelTitle.toLowerCase()}</Eyebrow>
        <Title>
          Your starter
          <br />
          bag
        </Title>
        <div className="mt-6 flex flex-col gap-3">
          {items.map((it, i) => {
            const on = picked.includes(it.id)
            return (
              <motion.button
                key={it.id}
                {...fadeUp}
                transition={{ delay: 0.06 * i }}
                onClick={() => setPicked((p) => (on ? p.filter((x) => x !== it.id) : [...p, it.id]))}
                className={`flex gap-4 rounded-3xl p-4 text-left ring-1 transition ${on ? 'bg-ink-2 ring-mst/70' : 'bg-ink-2/50 ring-white/10 opacity-60'}`}
              >
                <GearThumb item={it} />
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-mst-bright">
                    {it.brand} · {it.category}
                  </div>
                  <div className="mt-0.5 font-semibold leading-tight">{it.name}</div>
                  <div className="mt-1 text-[12px] leading-snug text-white/50">{it.why}</div>
                  <div className="mt-2 font-display text-lg font-bold">{rm(it.price)}</div>
                </div>
                <div
                  className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full ring-1 ${on ? 'bg-mst ring-mst' : 'ring-white/25'}`}
                >
                  {on && <Check size={14} strokeWidth={3} />}
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
      <div className="border-t border-white/10 bg-ink-2/80 px-6 pb-8 pt-5 backdrop-blur">
        <div className="mb-4 flex items-baseline justify-between">
          <span className="font-display text-xl font-bold uppercase italic">Purchase now?</span>
          <span className="text-sm text-white/60">
            {chosen.length} items · <span className="font-bold text-white">{rm(total)}</span>
          </span>
        </div>
        <div className="grid grid-cols-[1fr_1.6fr] gap-3">
          <Button variant="ghost" onClick={onSkip}>
            No
          </Button>
          <Button disabled={!chosen.length} onClick={() => onPurchase(chosen)}>
            <ShoppingBag size={18} /> Yes, add to cart
          </Button>
        </div>
      </div>
    </div>
  )
}

export function GearThumb({ item, size = 'md' }: { item: GearItem; size?: 'sm' | 'md' }) {
  const s = size === 'sm' ? 'h-16 w-16' : 'h-[84px] w-[84px]'
  return (
    <div className={`relative ${s} shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-turf to-black ring-1 ring-white/10`}>
      <div className="turf-stripes absolute inset-0" />
      <div className="absolute inset-0 grid place-items-center">
        <GearGlyph category={item.category} />
      </div>
    </div>
  )
}

/** Minimal drawn product glyphs, so gear tiles read as golf objects rather than generic icons. */
function GearGlyph({ category }: { category: GearItem['category'] }) {
  const c = 'stroke-white/85'
  switch (category) {
    case 'Balls':
      return (
        <div className="flex -space-x-2">
          <GolfBall size={22} />
          <GolfBall size={26} className="relative -top-2" />
          <GolfBall size={22} />
        </div>
      )
    case 'Clubs':
      return (
        <svg width="46" height="46" viewBox="0 0 48 48" fill="none" className={c} strokeWidth="2.5" strokeLinecap="round">
          <path d="M14 4 L22 38" />
          <path d="M22 38 q-1 5 -8 5 h-4" />
          <path d="M24 4 L28 38" />
          <path d="M28 38 q0 5 7 5 h4" />
          <path d="M34 6 L31 37" className="stroke-mst-bright" />
          <path d="M31 37 l9 3" className="stroke-mst-bright" />
        </svg>
      )
    case 'Glove':
      return <Hand size={36} className="text-white/85" strokeWidth={1.6} />
    case 'Bag':
      return (
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none" className={c} strokeWidth="2.2" strokeLinejoin="round">
          <rect x="15" y="14" width="18" height="30" rx="5" />
          <path d="M18 14 V6 M24 14 V3 M30 14 V7" strokeLinecap="round" />
          <path d="M15 24 h18" className="stroke-mst-bright" />
        </svg>
      )
    case 'Shoes':
      return (
        <svg width="46" height="46" viewBox="0 0 48 48" fill="none" className={c} strokeWidth="2.2" strokeLinejoin="round">
          <path d="M6 30 c0-6 2-12 6-12 l6 6 c4 2 14 3 20 4 c4 1 4 6 0 6 H8 c-1 0-2-1-2-4z" />
          <path d="M10 38 v3 M18 38 v3 M26 38 v3 M34 38 v3" strokeLinecap="round" className="stroke-mst-bright" />
        </svg>
      )
    case 'Tech':
      return (
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none" className={c} strokeWidth="2.2">
          <rect x="8" y="14" width="32" height="20" rx="5" />
          <circle cx="30" cy="24" r="5" className="stroke-mst-bright" />
          <path d="M14 21 h6 M14 27 h4" strokeLinecap="round" />
        </svg>
      )
    default:
      return (
        <svg width="40" height="40" viewBox="0 0 48 48" fill="none" className={c} strokeWidth="2.2" strokeLinecap="round">
          <path d="M16 10 h8 l-2 6 v22 l-2 4 l-2 -4 V16z" />
          <path d="M28 14 h8 l-2 6 v18 l-2 4 l-2 -4 V20z" className="stroke-mst-bright" />
        </svg>
      )
  }
}

/* ---------- Screen 8: Cart ---------- */
export type CartLine = GearItem & { qty: number }

export function CartScreen({
  lines,
  setLines,
  onCheckout,
  onBack,
}: {
  lines: CartLine[]
  setLines: (l: CartLine[]) => void
  onCheckout: () => void
  onBack: () => void
}) {
  const [pickup, setPickup] = useState(true)
  const [placing, setPlacing] = useState(false)
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0)
  const shipping = pickup || subtotal > 500 ? 0 : 25
  const update = (id: string, d: number) =>
    setLines(lines.map((l) => (l.id === id ? { ...l, qty: Math.max(1, l.qty + d) } : l)))

  return (
    <div className="flex h-full flex-col bg-ink">
      <StepHeader step={4} onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-6 pb-4 pt-8 no-scrollbar">
        <Eyebrow>Shopping cart</Eyebrow>
        <Title>Your bag</Title>
        {lines.length === 0 ? (
          <div className="mt-10 rounded-3xl bg-ink-2 p-8 text-center ring-1 ring-white/10">
            <ShoppingBag className="mx-auto text-white/40" />
            <p className="mt-3 text-sm text-white/55">Your cart is empty.</p>
          </div>
        ) : (
          <div className="mt-6 flex flex-col divide-y divide-white/10">
            {lines.map((l) => (
              <div key={l.id} className="flex gap-4 py-4">
                <GearThumb item={l} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">{l.brand}</div>
                  <div className="truncate text-sm font-semibold">{l.name}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1 rounded-full bg-ink-2 p-1 ring-1 ring-white/10">
                      <button aria-label="Decrease" onClick={() => update(l.id, -1)} className="grid h-7 w-7 place-items-center rounded-full hover:bg-white/10">
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm font-bold">{l.qty}</span>
                      <button aria-label="Increase" onClick={() => update(l.id, 1)} className="grid h-7 w-7 place-items-center rounded-full hover:bg-white/10">
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="font-display text-lg font-bold">{rm(l.price * l.qty)}</span>
                  </div>
                </div>
                <button
                  aria-label={`Remove ${l.name}`}
                  onClick={() => setLines(lines.filter((x) => x.id !== l.id))}
                  className="self-start p-1 text-white/35 hover:text-white"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-ink-2 p-1.5 ring-1 ring-white/10">
          {[
            { v: true, label: 'Pick up at Arena' },
            { v: false, label: 'Deliver to me' },
          ].map((o) => (
            <button
              key={o.label}
              onClick={() => setPickup(o.v)}
              className={`h-10 rounded-xl text-[13px] font-bold transition ${pickup === o.v ? 'bg-chalk text-ink' : 'text-white/60'}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 bg-ink-2/80 px-6 pb-8 pt-5 backdrop-blur">
        <div className="space-y-1.5 text-sm">
          <Row k="Subtotal" v={rm(subtotal)} />
          <Row k={pickup ? 'Pickup' : 'Delivery'} v={shipping ? rm(shipping) : 'Free'} />
          <div className="flex items-baseline justify-between pt-2">
            <span className="font-display text-xl font-bold uppercase italic">Total</span>
            <span className="font-display text-2xl font-extrabold">{rm(subtotal + shipping)}</span>
          </div>
        </div>
        <Button
          className="mt-4"
          disabled={!lines.length || placing}
          onClick={() => {
            setPlacing(true)
            setTimeout(onCheckout, 900)
          }}
        >
          {placing ? (
            <>
              <Check size={18} /> Order placed
            </>
          ) : (
            <>Checkout · {rm(subtotal + shipping)}</>
          )}
        </Button>
      </div>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between text-white/60">
      <span>{k}</span>
      <span className="font-semibold text-white">{v}</span>
    </div>
  )
}
