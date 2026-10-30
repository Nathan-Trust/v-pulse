import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { mockServers } from '@/lib/mockData'

const highlights = [
  '99.9% uptime SLA with redundancy',
  'Real-time monitoring and alerts',
  '24/7 expert support included',
]

export function Hero() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 xl:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div className="space-y-8">
          <div className="space-y-5">
            <h1 className="font-display text-5xl font-semibold tracking-tight text-balance text-foreground sm:text-6xl">
              Feel the pulse of your <span className="text-primary">infrastructure</span>
            </h1>
            <p className="text-lg text-balance text-muted-foreground">
              Deploy, manage, and monitor your infrastructure with a single platform. Built for teams who demand reliability and performance.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 text-base">
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 text-base">
              <Link href="#features">See Features</Link>
            </Button>
          </div>

          <ul className="space-y-2 text-sm text-muted-foreground">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <Card className="hidden gap-0 overflow-hidden py-0 lg:block">
          <svg viewBox="0 0 480 110" className="w-full border-b border-border" aria-hidden="true">
            <path
              d="M0 60h120l14-34 22 64 16-44 10 14h70l14-34 22 64 16-44 10 14h166"
              fill="none"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-primary"
            />
          </svg>
          <div className="divide-y divide-border">
            {mockServers.map((server) => (
              <div key={server.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{server.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">{server.region}</p>
                </div>
                <StatusBadge status={server.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  )
}
