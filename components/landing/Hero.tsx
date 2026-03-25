import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Cloud, Zap, BarChart3 } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 xl:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left content */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
                Cloud Made Effortless
              </h1>
              <p className="text-xl text-muted-foreground text-balance">
                Deploy, manage, and monitor your infrastructure with a single platform. Built for teams who demand reliability and performance.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="text-base h-12 sm:w-auto">
                <Link href="/signup">Get Started Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base h-12 sm:w-auto">
                <Link href="#features">See Features</Link>
              </Button>
            </div>

            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0"></div>
                <span>99.9% uptime SLA with redundancy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0"></div>
                <span>Real-time monitoring and alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0"></div>
                <span>24/7 expert support included</span>
              </div>
            </div>
          </div>

          {/* Right side - Icon Grid */}
          <div className="hidden lg:flex lg:items-center lg:justify-center">
            <div className="relative w-full h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl"></div>
              <div className="relative flex items-center justify-center h-full gap-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 rounded-xl bg-primary/10 text-primary">
                    <Cloud size={48} />
                  </div>
                  <span className="text-sm font-medium text-foreground">Deploy</span>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 rounded-xl bg-accent/10 text-accent">
                    <Zap size={48} />
                  </div>
                  <span className="text-sm font-medium text-foreground">Scale</span>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 rounded-xl bg-primary/10 text-primary">
                    <BarChart3 size={48} />
                  </div>
                  <span className="text-sm font-medium text-foreground">Monitor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
