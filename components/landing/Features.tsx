import {
  Server,
  Zap,
  BarChart3,
  Gauge,
  TrendingUp,
  Shield,
} from 'lucide-react'

export function Features() {
  const features = [
    {
      title: 'Server Management',
      description: 'Deploy and manage servers across multiple cloud providers with unified control',
      icon: Server,
    },
    {
      title: 'Quick Deployment',
      description: 'One-click deployments with automatic rollbacks and zero-downtime updates',
      icon: Zap,
    },
    {
      title: 'Real-time Analytics',
      description: 'Monitor bandwidth, CPU, memory usage with detailed metrics and insights',
      icon: BarChart3,
    },
    {
      title: 'Bandwidth Control',
      description: 'Intelligent bandwidth management with cost optimization recommendations',
      icon: Gauge,
    },
    {
      title: 'Auto-scaling',
      description: 'Automatically scale your infrastructure based on real-time demand',
      icon: TrendingUp,
    },
    {
      title: 'Enterprise Security',
      description: 'Enterprise-grade security with SSL certificates and firewall rules',
      icon: Shield,
    },
  ]

  return (
    <section id="features" className="border-t border-border px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl space-y-3">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-foreground">
            Everything You Need
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful tools to manage your cloud infrastructure with confidence
          </p>
        </div>

        <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="border-l-2 border-primary pl-4">
                <Icon className="mb-3 size-5 text-primary" />
                <h3 className="mb-1.5 font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
