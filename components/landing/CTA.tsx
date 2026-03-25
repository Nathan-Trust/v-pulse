import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function CTA() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-lg border border-border bg-gradient-to-r from-primary/10 to-accent/10 px-8 py-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ready to Transform Your Cloud Infrastructure?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of teams managing their cloud infrastructure with Fusion Tech
          </p>
          
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/signup">Get Started Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="mailto:contact@fusiontech.com">Contact Sales</Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            No credit card required. Free tier available.
          </p>
        </div>
      </div>
    </section>
  )
}
