import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { mockPlans } from '@/lib/mockData'

export function Pricing() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the plan that fits your needs
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {mockPlans.map((plan, index) => (
            <div
              key={plan.id}
              className={`rounded-lg border p-8 transition-all ${
                index === 1
                  ? 'border-primary shadow-lg ring-1 ring-primary scale-105'
                  : 'border-border'
              } bg-card`}
            >
              {index === 1 && (
                <div className="mb-4">
                  <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                    Most Popular
                  </span>
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
              <p className="mt-2">
                <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </p>

              <div className="mt-6 space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground">{plan.serverSlots} Server{plan.serverSlots > 1 ? 's' : ''}</p>
                  <p className="text-xs">{plan.bandwidth}TB Bandwidth</p>
                </div>

                <div className="space-y-2 border-t border-border pt-4">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent"></span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <Button
                asChild
                className="mt-8 w-full"
                variant={index === 1 ? 'default' : 'outline'}
              >
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
