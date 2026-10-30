import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BRAND } from '@/lib/brand'

export function CTA() {
  return (
    <section className="border-t border-border px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-xl border border-primary bg-card px-8 py-16 text-center">
        <h2 className="font-display text-4xl font-semibold tracking-tight text-foreground">
          Ready to Transform Your Cloud Infrastructure?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Manage your cloud infrastructure with {BRAND.name}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/signup">Get Started Now</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href={`mailto:${BRAND.contactEmail}`}>Contact Sales</Link>
          </Button>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          No credit card required. Free tier available.
        </p>
      </div>
    </section>
  )
}
