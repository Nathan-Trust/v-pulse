import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  hint?: string
  badge?: ReactNode
}

export function StatCard({ label, value, icon: Icon, hint, badge }: StatCardProps) {
  return (
    <Card className="gap-0 border-border py-0 shadow-none">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <Icon className="size-4 text-primary" />
        </div>
        <p className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground">{value}</p>
        {(hint || badge) && (
          <div className="mt-2 flex items-center gap-2">
            {badge}
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
