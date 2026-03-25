import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 xl:py-28">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left content */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Cloud Infrastructure Made Simple
              </h1>
              <p className="text-lg text-muted-foreground">
                Deploy, manage, and scale your applications with Fusion Tech. Streamline bandwidth management and optimize performance across your infrastructure.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="sm:w-auto">
                <Link href="/signup">Get Started Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="sm:w-auto">
                <Link href="#features">Learn More</Link>
              </Button>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-accent"></div>
                <span>99.9% Uptime SLA</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-accent"></div>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Right side - Visual */}
          <div className="hidden lg:flex lg:items-center lg:justify-center">
            <div className="relative h-96 w-full rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-lg overflow-hidden">
                <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary/20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-accent/20 blur-3xl"></div>
              </div>
              <div className="relative text-center">
                <div className="mb-4 text-5xl font-bold text-primary">∞</div>
                <p className="text-foreground font-semibold">Infinite Scalability</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
