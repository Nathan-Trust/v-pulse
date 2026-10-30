import { cn } from '@/lib/utils'

const TONES: Record<string, { pill: string; dot: string; pulse?: boolean }> = {
  active: { pill: 'bg-success/10 text-success', dot: 'bg-success' },
  running: { pill: 'bg-success/10 text-success', dot: 'bg-success' },
  paid: { pill: 'bg-success/10 text-success', dot: 'bg-success' },
  provisioning: { pill: 'bg-warning/10 text-warning', dot: 'bg-warning', pulse: true },
  pending: { pill: 'bg-warning/10 text-warning', dot: 'bg-warning' },
  inactive: { pill: 'bg-muted text-muted-foreground', dot: 'bg-muted-foreground' },
  stopped: { pill: 'bg-muted text-muted-foreground', dot: 'bg-muted-foreground' },
  error: { pill: 'bg-destructive/10 text-destructive', dot: 'bg-destructive' },
}

export function StatusBadge({ status }: { status: string }) {
  const tone = TONES[status.toLowerCase()] ?? TONES.inactive

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', tone.pill)}>
      <span className={cn('size-1.5 rounded-full', tone.dot, tone.pulse && 'animate-pulse')} />
      {status}
    </span>
  )
}
