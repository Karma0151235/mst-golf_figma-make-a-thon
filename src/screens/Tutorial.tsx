import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, Gauge, Pause, Play, RotateCw, Sparkles } from 'lucide-react'
import { ADDRESS, type Lesson, type Pose } from '../lib/swing'
import type { Profile } from '../lib/data'

const SwingScene = lazy(() => import('../components/SwingFigure').then((m) => ({ default: m.SwingScene })))

const P = (o: Partial<Pose>): Pose => ({ ...ADDRESS, ...o })
const TOP = P({ arms: -2.2, wrist: -1.9, torso: -1.15, hips: -0.45, shift: -0.05 })
const DELIVERY = P({ arms: -1.0, wrist: -1.5, torso: -0.35, hips: 0.15, shift: 0.04 })
const IMPACT = P({ arms: 0.05, wrist: 0.02, torso: 0.2, hips: 0.45, shift: 0.07 })
const FINISH = P({ arms: 2.4, wrist: 1.3, torso: 1.45, hips: 0.95, bend: 0.12, shift: 0.1 })

type LessonDef = Lesson & { title: string; short: string; coach: (p: Profile) => string; cues: string[] }

const tipFor = (p: Profile) => {
  const n = p.ability?.notes ?? []
  if (n.includes('Mobility'))
    return ' Playing seated? Keep the same arm triangle — our adaptive bays have a seated tee height for this.'
  if (n.includes('Limb')) return ' One-handed? Lead with your stronger arm and let the club swing like a pendulum.'
  if (n.includes('Vision')) return ' Ask staff for audio tee-ready cues at the bay.'
  if (n.includes('Hearing')) return ' The bay screen flashes green when your shot is tracked.'
  return ''
}

const LESSONS: LessonDef[] = [
  {
    id: 'grip',
    title: 'Grip & Address',
    short: 'Address',
    ball: 'none',
    keys: [
      { t: 0, pose: ADDRESS, label: 'Address' },
      { t: 0.8, pose: P({ arms: -0.12, wrist: -0.1 }), label: 'Waggle' },
      { t: 1.6, pose: ADDRESS, label: 'Address' },
      { t: 3, pose: ADDRESS },
    ],
    cues: ['Hands just ahead of the ball', 'Grip pressure: 4 out of 10', 'Arms hang, don\u2019t reach'],
    coach: (p) =>
      `Let's start at the address, ${p.name.split(' ')[0] || 'golfer'}. Hold the club in your fingers, not your palm, with the "V" of each thumb pointing to your trail shoulder. Tilt from the hips so your arms hang naturally.` +
      tipFor(p),
  },
  {
    id: 'stance',
    title: 'Stance & Posture',
    short: 'Stance',
    ball: 'none',
    keys: [
      { t: 0, pose: ADDRESS, label: 'Set' },
      { t: 1, pose: P({ shift: -0.06, hips: -0.1 }), label: 'Feel trail side' },
      { t: 2, pose: P({ shift: 0.06, hips: 0.1 }), label: 'Feel lead side' },
      { t: 3, pose: ADDRESS, label: 'Balanced' },
    ],
    cues: ['Feet shoulder-width apart', 'Soft knees', 'Weight 50/50, on the balls of your feet'],
    coach: (p) =>
      'Feet about shoulder-width, knees soft, weight balanced. Watch the hips — a good stance lets you shift side to side without losing your spine angle.' +
      (p.level === 'beginner' ? ' Ball in the middle of your stance is perfect while you learn.' : ''),
  },
  {
    id: 'backswing',
    title: 'The Backswing',
    short: 'Backswing',
    ball: 'none',
    keys: [
      { t: 0, pose: ADDRESS, label: 'Takeaway' },
      { t: 0.7, pose: P({ arms: -0.9, wrist: -0.3, torso: -0.5, hips: -0.2 }), label: 'Club parallel' },
      { t: 1.5, pose: TOP, label: 'Top' },
      { t: 2.3, pose: TOP },
      { t: 3.4, pose: ADDRESS },
    ],
    cues: ['Turn your chest, not just your arms', 'Wrists hinge naturally', 'Back faces the target at the top'],
    coach: () =>
      'Start the club back low and slow. Rotate your chest away from the target, let your wrists hinge, and stop when your back faces the target. Think "turn", not "lift".',
  },
  {
    id: 'swing',
    title: 'Full Swing',
    short: 'Full swing',
    ball: 'drive',
    impact: 1.62,
    keys: [
      { t: 0, pose: ADDRESS, label: 'Address' },
      { t: 1.1, pose: TOP, label: 'Backswing' },
      { t: 1.4, pose: DELIVERY, label: 'Downswing' },
      { t: 1.62, pose: IMPACT, label: 'Impact' },
      { t: 2.05, pose: FINISH, label: 'Follow-through' },
      { t: 3.4, pose: FINISH, label: 'Hold the finish' },
      { t: 4.4, pose: ADDRESS },
    ],
    cues: ['Hips start the downswing', 'Hit down and through', 'Finish tall, belt buckle to target'],
    coach: (p) =>
      `Put it together. From the top, your hips lead, arms follow, and the club releases through the ball. Hold your finish for a count of three — ${
        p.level === 'professional' ? 'tempo is 3:1, backswing to downswing.' : 'balance is the sign of a good swing.'
      }`,
  },
  {
    id: 'putt',
    title: 'Putting',
    short: 'Putting',
    ball: 'putt',
    impact: 1.5,
    keys: [
      { t: 0, pose: P({ bend: 0.6 }), label: 'Set up' },
      { t: 0.9, pose: P({ bend: 0.6, arms: -0.32, torso: -0.12 }), label: 'Back' },
      { t: 1.5, pose: P({ bend: 0.6, arms: 0, torso: 0 }), label: 'Strike' },
      { t: 2.1, pose: P({ bend: 0.6, arms: 0.32, torso: 0.12 }), label: 'Through' },
      { t: 3.4, pose: P({ bend: 0.6, arms: 0.32, torso: 0.12 }) },
      { t: 4.2, pose: P({ bend: 0.6 }) },
    ],
    cues: ['Rock the shoulders like a pendulum', 'Quiet wrists', 'Same length back and through'],
    coach: () =>
      'Putting is a pendulum. Eyes over the ball, rock your shoulders, keep the wrists quiet, and make the stroke the same length back and through.',
  },
]

const QA: { q: string; a: string }[] = [
  {
    q: 'Why does my ball slice?',
    a: 'A slice usually comes from an open clubface at impact. Strengthen your grip slightly — see 2–3 knuckles on your lead hand — and feel the toe of the club rotate over through impact.',
  },
  {
    q: 'How hard should I swing?',
    a: 'About 80%. Smooth tempo beats raw power. If you can hold your finish in balance, the speed is right.',
  },
  {
    q: 'Which club do I start with?',
    a: 'A 7-iron. It is forgiving, mid-length and teaches good contact. Move to the driver once you are striking the 7 consistently.',
  },
  {
    q: 'How do I aim?',
    a: 'Pick a spot a metre in front of the ball on your target line, square the clubface to it, then set your feet parallel to that line.',
  },
]

function useTypewriter(text: string, speed = 14) {
  const [out, setOut] = useState('')
  useEffect(() => {
    setOut('')
    let i = 0
    const id = setInterval(() => {
      i += 2
      setOut(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return out
}

export function TutorialScreen({ profile, onBack }: { profile: Profile; onBack: () => void }) {
  const [idx, setIdx] = useState(0)
  const [run, setRun] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [slow, setSlow] = useState(false)
  const [phase, setPhase] = useState('')
  const [answer, setAnswer] = useState<{ q: string; a: string } | null>(null)
  const lesson = LESSONS[idx]
  const message = useMemo(() => (answer ? answer.a : lesson.coach(profile)), [answer, lesson, profile])
  const typed = useTypewriter(message)

  const goto = (i: number) => {
    setIdx(i)
    setRun((r) => r + 1)
    setAnswer(null)
    setPhase('')
    setPlaying(true)
  }

  return (
    <div className="flex h-full flex-col bg-ink">
      <div className="relative h-[50%] shrink-0 overflow-hidden bg-[radial-gradient(ellipse_at_50%_30%,#123d24_0%,#07110b_65%)]">
        <Suspense
          fallback={<div className="grid h-full place-items-center text-sm text-white/40">Setting up the bay…</div>}
        >
          <SwingScene
            lesson={{ ...lesson, id: `${lesson.id}-${run}` }}
            playing={playing}
            speed={slow ? 0.35 : 1}
            onPhase={setPhase}
          />
        </Suspense>
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between bg-gradient-to-b from-black/50 to-transparent px-5 pb-6 pt-14">
          <button
            onClick={onBack}
            aria-label="Back to home"
            className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-black/40 ring-1 ring-white/15 backdrop-blur"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-mst-bright">
              Lesson {idx + 1} of {LESSONS.length}
            </div>
            <div className="font-display text-2xl font-extrabold uppercase italic leading-none">{lesson.title}</div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
              Drag to rotate
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-5 pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="rounded-full bg-black/50 px-3 py-1.5 font-display text-sm font-bold uppercase tracking-wider ring-1 ring-white/10 backdrop-blur"
            >
              {phase || lesson.short}
            </motion.div>
          </AnimatePresence>
          <div className="flex gap-2">
            <button
              onClick={() => setSlow((s) => !s)}
              aria-label="Toggle slow motion"
              className={`flex h-10 items-center gap-1.5 rounded-full px-3 text-xs font-bold ring-1 backdrop-blur transition ${
                slow ? 'bg-mst ring-mst' : 'bg-black/40 ring-white/15'
              }`}
            >
              <Gauge size={15} /> {slow ? 'Slow-mo' : '1×'}
            </button>
            <button
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? 'Pause' : 'Play'}
              className="grid h-10 w-10 place-items-center rounded-full bg-chalk text-ink"
            >
              {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 gap-2 overflow-x-auto px-5 py-4 no-scrollbar">
        {LESSONS.map((l, i) => (
          <button
            key={l.id}
            onClick={() => goto(i)}
            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[13px] font-bold ring-1 transition ${
              i === idx ? 'bg-chalk text-ink ring-chalk' : 'bg-ink-2 text-white/70 ring-white/10 hover:text-white'
            }`}
          >
            <span className={`text-[10px] ${i === idx ? 'text-mst' : 'text-white/35'}`}>0{i + 1}</span>
            {l.short}
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-5 pb-6">
        <div className="min-h-0 flex-1 overflow-y-auto rounded-[24px] bg-ink-2 p-4 ring-1 ring-white/10 no-scrollbar">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-full bg-mst">
              <Sparkles size={14} />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/60">
              {answer ? answer.q : 'MST AI Coach'}
            </span>
          </div>
          <p className="mt-3 text-[14px] leading-relaxed text-white/85">
            {typed}
            {typed.length < message.length && (
              <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-mst-bright align-middle" />
            )}
          </p>
          {!answer && (
            <ul className="mt-3 space-y-1.5">
              {lesson.cues.map((c) => (
                <li key={c} className="flex items-center gap-2 text-[12px] font-semibold text-white/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-mst-bright" /> {c}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">Ask the coach</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {QA.map((qa) => (
              <button
                key={qa.q}
                onClick={() => setAnswer(answer?.q === qa.q ? null : qa)}
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ring-1 transition ${
                  answer?.q === qa.q
                    ? 'bg-mst/20 text-mst-bright ring-mst'
                    : 'bg-white/5 text-white/60 ring-white/10 hover:text-white'
                }`}
              >
                {qa.q}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 grid shrink-0 grid-cols-[auto_1fr] gap-2">
          <button
            onClick={() => goto(idx)}
            aria-label="Replay lesson"
            className="grid h-12 w-12 place-items-center rounded-full bg-white/5 ring-1 ring-white/15"
          >
            <RotateCw size={17} />
          </button>
          <button
            onClick={() => (idx < LESSONS.length - 1 ? goto(idx + 1) : onBack())}
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-mst text-sm font-bold hover:bg-mst-bright"
          >
            {idx < LESSONS.length - 1 ? (
              <>
                Next: {LESSONS[idx + 1].short} <ChevronRight size={17} />
              </>
            ) : (
              'Finish & book a bay'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
