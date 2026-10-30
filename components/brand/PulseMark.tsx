import { cn } from '@/lib/utils'
import { BRAND } from '@/lib/brand'

export function PulseMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={cn('size-8', className)}>
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <path
        d="M5 17h5l2.5-7 4.5 13 3-9 1.5 3H27"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-primary-foreground"
      />
    </svg>
  )
}

export function PulseLogo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <PulseMark />
      <span className="font-display text-lg font-semibold tracking-tight text-foreground">{BRAND.name}</span>
    </span>
  )
}
