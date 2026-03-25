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
    <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center space-y-4">
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Everything You Need
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful tools to manage your cloud infrastructure with confidence
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="rounded-xl border border-border bg-card p-6 hover:shadow-lg hover:border-primary/30 transition-all"
              >
                <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 text-primary">
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
