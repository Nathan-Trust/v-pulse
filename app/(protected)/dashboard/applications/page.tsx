'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { StatCard } from '@/components/dashboard/StatCard'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { mockApplications as initialApps, mockServers } from '@/lib/mockData'
import { BRAND } from '@/lib/brand'
import { type Application as ApplicationType } from '@/lib/schemas'
import {
  Zap,
  Activity,
  Globe,
  Plus,
  MoreHorizontal,
  RefreshCw,
  Power,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Loader2,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export default function ApplicationsPage() {
  const [apps, setApps] = useState<ApplicationType[]>(initialApps as ApplicationType[])
  const [expandedApp, setExpandedApp] = useState<string | null>(null)
  const [isDeploying, setIsDeploying] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const handleDeploy = async () => {
    setIsDeploying(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    const newApp: ApplicationType = {
      id: `APP-${Math.floor(Math.random() * 10000)}`,
      name: `Service-${apps.length + 1}`,
      status: 'running',
      type: 'Node.js',
      serverId: mockServers[0].id,
      domain: `service-${apps.length + 1}.${BRAND.appDomain}`,
      lastDeployed: new Date().toISOString().split('T')[0],
      uptimePercentage: 100,
    }
    setApps([...apps, newApp])
    setIsDeploying(false)
  }

  const handleAction = async (appId: string, action: 'restart' | 'stop' | 'rollback') => {
    setActionLoading(`${appId}-${action}`)
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (action === 'restart') {
      setApps(prev => prev.map(a => a.id === appId ? { ...a, status: 'running' } : a))
    } else if (action === 'stop') {
      setApps(prev => prev.map(a => a.id === appId ? { ...a, status: 'stopped' } : a))
    }

    setActionLoading(null)
  }

  return (
    <div className="space-y-8 pb-12">
      <PageHeader title="Applications" description="Manage and deploy your cloud services across global nodes.">
        <Button onClick={handleDeploy} disabled={isDeploying} className="gap-2">
          {isDeploying ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          Deploy Service
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Services" value={apps.length} icon={Zap} />
        <StatCard label="Running" value={apps.filter(a => a.status === 'running').length} icon={Activity} />
        <StatCard label="Avg Uptime" value="99.95%" icon={CheckCircle2} />
      </div>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold text-foreground">Active Services</h2>
        <div className="grid gap-3">
          {apps.map((app) => (
            <Card
              key={app.id}
              className={cn(
                'cursor-pointer gap-0 py-0 shadow-none transition-colors hover:border-primary/40',
                expandedApp === app.id && 'border-primary/60'
              )}
              onClick={() => setExpandedApp(expandedApp === app.id ? null : app.id)}
            >
              <div className="p-5">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-semibold text-foreground">{app.name}</h3>
                      <StatusBadge status={app.status} />
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="outline">{app.type}</Badge>
                      <span className="truncate font-mono text-xs text-muted-foreground">{app.domain}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-8 lg:justify-end">
                    <dl className="flex gap-8 text-sm">
                      <div>
                        <dt className="text-xs text-muted-foreground">Last Deployed</dt>
                        <dd className="font-mono text-foreground">{app.lastDeployed}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">Uptime</dt>
                        <dd className="font-mono text-foreground">{app.uptimePercentage}%</dd>
                      </div>
                    </dl>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        aria-label={`Restart ${app.name}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAction(app.id, 'restart')
                        }}
                        disabled={actionLoading?.startsWith(app.id)}
                      >
                        {actionLoading === `${app.id}-restart` ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="size-8" aria-label={`Actions for ${app.name}`}>
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenuItem className="gap-2">
                            <ExternalLink className="size-4" /> Open App
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Activity className="size-4" /> Logs & Metrics
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2" onClick={() => handleAction(app.id, 'rollback')}>
                            <RotateCcw className="size-4" /> Rollback Version
                          </DropdownMenuItem>
                          <DropdownMenuItem variant="destructive" className="gap-2" onClick={() => handleAction(app.id, 'stop')}>
                            <Power className="size-4" /> Stop Service
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <ChevronDown className={cn('ml-1 size-4 text-muted-foreground transition-transform', expandedApp === app.id && 'rotate-180')} />
                    </div>
                  </div>
                </div>

                {expandedApp === app.id && (
                  <div className="mt-5 grid grid-cols-2 gap-6 border-t border-border pt-5 animate-in fade-in slide-in-from-top-1 duration-200 md:grid-cols-4">
                    <div className="space-y-1.5">
                      <p className="text-xs text-muted-foreground">Environment</p>
                      <p className="text-sm font-medium text-foreground">Production</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs text-muted-foreground">Server Node</p>
                      <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                        <Globe className="size-3.5 text-muted-foreground" />
                        US-East-1 (Node-1)
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs text-muted-foreground">Git Branch</p>
                      <code className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-foreground">main</code>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs text-muted-foreground">Auto-Scale</p>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
