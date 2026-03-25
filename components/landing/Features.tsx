export function Features() {
  const features = [
    {
      title: 'Server Management',
      description: 'Deploy and manage servers across multiple cloud providers with unified control',
      icon: '🖥️',
    },
    {
      title: 'Application Deployment',
      description: 'One-click deployments with automatic rollbacks and zero-downtime updates',
      icon: '⚡',
    },
    {
      title: 'Real-time Analytics',
      description: 'Monitor bandwidth, CPU, memory usage with detailed metrics and insights',
      icon: '📊',
    },
    {
      title: 'Bandwidth Optimization',
      description: 'Intelligent bandwidth management with cost optimization recommendations',
      icon: '🚀',
    },
    {
      title: 'Auto-scaling',
      description: 'Automatically scale your infrastructure based on demand',
      icon: '📈',
    },
    {
      title: 'Security First',
      description: 'Enterprise-grade security with SSL certificates and firewall rules',
      icon: '🔒',
    },
  ]

  return (
    <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Powerful Features for Modern Teams
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to manage your cloud infrastructure efficiently
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-lg border border-border bg-card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="mb-4 text-4xl">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
