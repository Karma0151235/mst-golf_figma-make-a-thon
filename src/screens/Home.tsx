import { motion } from 'motion/react'
import { ArrowUpRight, CalendarDays, MapPin, Play, ShoppingBag, Sparkles, Trophy } from 'lucide-react'
import { GolfBall, Logo } from '../components/ui'
import { LEVELS, PHOTOS, type Profile } from '../lib/data'

/* ---------- Screen 11: Home ---------- */
export function HomeScreen({
  profile,
  cartCount,
  onNewToGolf,
  onLocations,
  onShop,
}: {
  profile: Profile
  cartCount: number
  onNewToGolf: () => void
  onLocations: () => void
  onShop: () => void
}) {
  const first = profile.name.split(' ')[0] || 'Golfer'
  const level = LEVELS.find((l) => l.id === profile.level)
  const hour = new Date().getHours()
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="h-full overflow-y-auto bg-ink pb-10 no-scrollbar">
      <div className="flex items-center justify-between px-6 pt-14">
        <Logo />
        <div className="flex items-center gap-2">
          <button
            onClick={onShop}
            aria-label="Shop"
            className="relative grid h-10 w-10 place-items-center rounded-full bg-ink-2 ring-1 ring-white/10"
          >
            <ShoppingBag size={17} />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-mst px-1 text-[9px] font-bold">
                {cartCount}
              </span>
            )}
          </button>
          <div className="grid h-10 w-10 place-items-center rounded-full bg-chalk font-display text-lg font-bold text-ink">
            {first[0]?.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="px-6 pt-8">
        <div className="text-sm text-white/50">{greet},</div>
        <h1 className="font-display text-5xl font-extrabold uppercase italic leading-none">{first}</h1>
        <div className="mt-3 flex gap-2">
          {level && (
            <span className="rounded-full bg-mst/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-mst-bright ring-1 ring-mst/40">
              {level.title}
            </span>
          )}
          {profile.ability?.needsSupport && (
            <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-white/70 ring-1 ring-white/10">
              Adaptive bay
            </span>
          )}
        </div>
      </div>

      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={onNewToGolf}
        className="group relative mx-6 mt-6 block w-[calc(100%-3rem)] overflow-hidden rounded-[28px] bg-mst p-6 text-left"
      >
        <div className="turf-stripes absolute inset-0 opacity-60" />
        <div className="absolute -right-6 -top-6 h-36 w-36 rounded-full bg-white/10" />
        <GolfBall
          size={58}
          className="absolute right-6 top-6 transition duration-500 group-hover:-translate-y-1 group-hover:rotate-45"
        />
        <div className="relative">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white/80">
            <Sparkles size={13} /> AI Coach
          </div>
          <div className="mt-3 font-display text-[40px] font-extrabold uppercase italic leading-[0.9]">
            New to
            <br />
            golf?
          </div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-bold">
            <Play size={14} fill="currentColor" /> Learn the basic swing in 3D
          </div>
        </div>
      </motion.button>

      <div className="mx-6 mt-4 overflow-hidden rounded-[28px] ring-1 ring-white/10">
        <div className="relative h-44">
          <img
            src={PHOTOS.rangeNight}
            alt="Floodlit driving range at night"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-mst-bright">
                Tonight · The Gardens
              </div>
              <div className="font-display text-2xl font-bold uppercase italic leading-none">Bays open till 1am</div>
            </div>
            <button
              onClick={onLocations}
              aria-label="View locations"
              className="grid h-11 w-11 place-items-center rounded-full bg-chalk text-ink"
            >
              <ArrowUpRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-6 mt-4 grid grid-cols-3 gap-3">
        {[
          { icon: CalendarDays, label: 'Book a bay', on: onLocations },
          { icon: MapPin, label: 'Locations', on: onLocations },
          { icon: ShoppingBag, label: 'Pro shop', on: onShop },
        ].map(({ icon: Icon, label, on }) => (
          <button
            key={label}
            onClick={on}
            className="flex flex-col items-start gap-6 rounded-3xl bg-ink-2 p-4 text-left ring-1 ring-white/10 transition hover:bg-ink-3"
          >
            <Icon size={20} className="text-mst-bright" />
            <span className="text-[13px] font-bold leading-tight">{label}</span>
          </button>
        ))}
      </div>

      <div className="mx-6 mt-4 flex items-center gap-4 rounded-3xl bg-ink-2 p-5 ring-1 ring-white/10">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sand/10">
          <Trophy size={20} className="text-sand" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold">Closest-to-pin challenge</div>
          <div className="text-[12px] text-white/50">Weekly simulator league · Fridays 8pm</div>
        </div>
      </div>
    </div>
  )
}
