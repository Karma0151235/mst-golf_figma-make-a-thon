import { motion } from 'motion/react'

export type TransitionVariant = 'putt' | 'drive'

export const TRANSITION_MS = 1500
// Fraction of the overlay timeline when the screen underneath is swapped.
export const SWAP_AT = 0.62

/** Full-screen golf-themed overlay played between screens. */
export function GolfTransition({ variant }: { variant: TransitionVariant }) {
  return (
    <div className="pointer-events-auto absolute inset-0 z-50 overflow-hidden">
      {variant === 'putt' ? <Putt /> : <Drive />}
    </div>
  )
}

const d = TRANSITION_MS / 1000

/** Ball rolls into the cup, the cup opens into a turf iris, then closes back down. */
function Putt() {
  return (
    <>
      {/* Turf iris expanding from the cup */}
      <motion.div
        className="turf-stripes absolute left-1/2 top-[58%] h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-turf"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 0, 22, 22, 0] }}
        transition={{ duration: d, times: [0, 0.34, 0.55, 0.7, 1], ease: 'easeInOut' }}
      />
      {/* Cup + flag */}
      <motion.div
        className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1, 1, 0.6] }}
        transition={{ duration: d, times: [0, 0.12, 0.4, 0.5] }}
      >
        <div className="h-4 w-12 rounded-[50%] bg-black shadow-[inset_0_3px_6px_rgba(0,0,0,1),0_0_0_3px_rgba(255,255,255,0.15)]" />
        <div className="absolute bottom-2 left-[22px] h-28 w-[3px] origin-bottom bg-white/90">
          <motion.div
            className="absolute left-[3px] top-0 h-7 w-11 bg-mst"
            style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}
            animate={{ skewY: [0, -6, 0, -6, 0] }}
            transition={{ duration: d, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
      {/* Ball */}
      <motion.div
        className="dimples absolute top-[58%] h-6 w-6 -translate-y-[70%] rounded-full"
        initial={{ left: '-10%' }}
        animate={{
          left: ['-10%', 'calc(50% - 12px)', 'calc(50% - 12px)'],
          rotate: [0, 720, 720],
          scale: [1, 1, 0],
          y: [0, 0, 6],
        }}
        transition={{ duration: d * 0.42, times: [0, 0.82, 1], ease: 'easeOut' }}
      />
      {/* Brand stamp while covered */}
      <motion.div
        className="absolute inset-0 grid place-items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{ duration: d, times: [0, 0.48, 0.56, 0.66, 0.74] }}
      >
        <span className="font-display text-6xl font-extrabold uppercase italic tracking-tight text-white/90">
          Fore<span className="text-mst-bright">.</span>
        </span>
      </motion.div>
    </>
  )
}

/** Ball is driven across the screen leaving a tracer; the fairway sweeps up behind it. */
function Drive() {
  return (
    <>
      <motion.div
        className="turf-stripes absolute inset-x-0 bottom-0 h-full bg-turf"
        initial={{ y: '100%' }}
        animate={{ y: ['100%', '100%', '0%', '0%', '-100%'] }}
        transition={{ duration: d, times: [0, 0.25, 0.5, 0.68, 1], ease: [0.7, 0, 0.3, 1] }}
      >
        {/* Leading edge of the fairway: a rough fringe */}
        <div className="absolute -top-3 inset-x-0 h-3 bg-[radial-gradient(circle_at_6px_12px,var(--color-turf)_6px,transparent_7px)] bg-[length:12px_12px]" />
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="font-display text-[11px] font-bold uppercase tracking-[0.5em] text-mst-bright">
              Teeing up
            </div>
            <div className="font-display text-5xl font-extrabold uppercase italic text-white/90">MST Arena</div>
          </div>
        </div>
      </motion.div>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path
          d="M -5 92 Q 45 -20 105 40"
          fill="none"
          stroke="white"
          strokeWidth="0.6"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ strokeWidth: 3 }}
          initial={{ pathLength: 0, opacity: 1 }}
          animate={{ pathLength: [0, 1, 1], opacity: [1, 1, 0] }}
          transition={{ duration: d * 0.55, times: [0, 0.75, 1], ease: 'easeOut' }}
        />
      </svg>
      <motion.div
        className="dimples absolute h-5 w-5 rounded-full"
        style={{ offsetPath: 'none' }}
        initial={{ left: '-5%', top: '92%' }}
        animate={{
          left: ['-5%', '20%', '45%', '70%', '105%'],
          top: ['92%', '44%', '28%', '30%', '40%'],
          scale: [1.4, 1.1, 0.9, 0.75, 0.6],
        }}
        transition={{ duration: d * 0.42, ease: 'linear' }}
      />
    </>
  )
}
