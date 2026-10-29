import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative grid h-8 w-8 place-items-center rounded-full bg-mst">
        <span className="font-display text-[13px] font-extrabold italic leading-none tracking-tight text-white">
          MST
        </span>
      </div>
      <div className="leading-none">
        <div className="font-display text-[15px] font-extrabold uppercase italic tracking-wide">MST Golf</div>
        <div className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/50">Arena</div>
      </div>
    </div>
  )
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'light'
  children: ReactNode
}

export function Button({ variant = 'primary', className = '', children, ...rest }: BtnProps) {
  const styles = {
    primary:
      'bg-mst text-white hover:bg-mst-bright disabled:bg-white/10 disabled:text-white/30 shadow-[0_10px_30px_-10px_rgba(0,150,57,0.8)] disabled:shadow-none',
    ghost: 'bg-white/5 text-white ring-1 ring-white/12 hover:bg-white/10',
    light: 'bg-chalk text-ink hover:bg-white',
  }[variant]
  return (
    <button
      className={`flex h-14 w-full items-center justify-center gap-2 rounded-full px-6 text-[15px] font-bold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed ${styles} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

export function StepHeader({ step, total = 4, onBack }: { step: number; total?: number; onBack?: () => void }) {
  return (
    <div className="flex items-center gap-4 px-6 pt-14">
      {onBack ? (
        <button
          onClick={onBack}
          aria-label="Back"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
        >
          <ChevronLeft size={18} />
        </button>
      ) : (
        <div className="h-10 w-10" />
      )}
      {/* Progress as a fairway: holes fill in green */}
      <div className="flex flex-1 items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-mst transition-all duration-500"
              style={{ width: i < step ? '100%' : '0%' }}
            />
          </div>
        ))}
      </div>
      <span className="w-10 text-right font-display text-sm font-semibold text-white/50">
        {step}/{total}
      </span>
    </div>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-mst-bright">{children}</div>
  )
}

export function Title({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-display text-[44px] font-extrabold uppercase italic leading-[0.92] tracking-tight">
      {children}
    </h1>
  )
}

export function GolfBall({ size = 24, className = '' }: { size?: number; className?: string }) {
  return <div className={`dimples rounded-full ${className}`} style={{ width: size, height: size }} />
}
