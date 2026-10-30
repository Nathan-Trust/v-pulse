import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { mockPlans } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

export function Pricing() {
  return (
    <section className="border-t border-border px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl space-y-3">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-foreground">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the plan that fits your needs
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {mockPlans.map((plan, index) => (
            <div
              key={plan.id}
              className={cn(
                'flex flex-col rounded-xl border bg-card p-8',
                index === 1 ? 'border-primary' : 'border-border'
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl font-semibold text-foreground">{plan.name}</h3>
                {index === 1 && (
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Most Popular
                  </span>
                )}
              </div>
              <p className="mt-3">
                <span className="font-display text-4xl font-semibold text-foreground">${plan.price}</span>
                <span className="text-muted-foreground"> /month</span>
              </p>

              <ul className="mt-6 flex-1 space-y-2.5 border-t border-border pt-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="size-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button asChild className="mt-8 w-full" variant={index === 1 ? 'default' : 'outline'}>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
