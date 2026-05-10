'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockApplications as initialApps, mockServers } from '@/lib/mockData'
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
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
      type: 'Node.js', // Valid enum value
      serverId: mockServers[0].id,
      domain: `service-${apps.length + 1}.fusiontech.io`,
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <CheckCircle2 className="size-3.5 text-accent" />
      case 'stopped':
        return <Power className="size-3.5 text-muted-foreground" />
      case 'error':
        return <AlertCircle className="size-3.5 text-destructive" />
      default:
        return null
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-accent/5 text-accent border-accent/10'
      case 'stopped':
        return 'bg-muted/50 text-muted-foreground border-border'
      case 'error':
        return 'bg-destructive/5 text-destructive border-destructive/10'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Applications</h1>
          <p className="text-muted-foreground text-sm mt-1 font-medium">
            Manage and deploy your cloud services across global nodes.
          </p>
        </div>
        <Button 
          onClick={handleDeploy} 
          disabled={isDeploying}
          className="h-10 px-5 rounded-lg shadow-sm gap-2"
        >
          {isDeploying ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          Deploy Service
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: 'Total Services', value: apps.length, icon: Zap },
          { label: 'Running', value: apps.filter(a => a.status === 'running').length, icon: Activity },
          { label: 'Avg Uptime', value: '99.95%', icon: CheckCircle2 },
        ].map((stat, i) => (
          <Card key={i} className="border-border/40 shadow-none bg-card/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="size-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <stat.icon className="size-4.5 text-muted-foreground/70" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-bold text-foreground leading-none mt-1">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Services List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-[0.15em]">Active Services</h2>
        </div>
        
        <div className="grid gap-3">
          {apps.map((app) => (
            <Card
              key={app.id}
              className={cn(
                "group border-border/40 shadow-none hover:border-primary/20 hover:bg-muted/10 transition-all cursor-pointer",
                expandedApp === app.id && "border-primary/30 bg-muted/20"
              )}
              onClick={() => setExpandedApp(expandedApp === app.id ? null : app.id)}
            >
              <div className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-background transition-colors">
                      <Zap className="size-5 text-muted-foreground/70" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-foreground">{app.name}</h3>
                        <div className={cn(
                          "flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                          getStatusClass(app.status)
                        )}>
                          {getStatusIcon(app.status)}
                          {app.status}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-[9px] font-bold uppercase py-0 px-1.5 border-border/60">{app.type}</Badge>
                        <span className="text-xs text-muted-foreground font-medium">{app.domain}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-12">
                    <div className="hidden sm:flex flex-col text-right">
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground/60 font-bold">Last Deployed</p>
                      <p className="text-xs font-semibold text-foreground">{app.lastDeployed}</p>
                    </div>
                    <div className="hidden sm:flex flex-col text-right">
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground/60 font-bold">Uptime</p>
                      <p className="text-xs font-semibold text-foreground">{app.uptimePercentage}%</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAction(app.id, 'restart')
                          }}
                          disabled={actionLoading?.startsWith(app.id)}
                        >
                          {actionLoading === `${app.id}-restart` ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
                        </Button>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-1">
                          <DropdownMenuItem className="gap-2 cursor-pointer text-xs font-medium">
                            <ExternalLink className="size-3.5" /> Open App
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer text-xs font-medium">
                            <Activity className="size-3.5" /> Logs & Metrics
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="gap-2 cursor-pointer text-xs font-medium"
                            onClick={() => handleAction(app.id, 'rollback')}
                          >
                            <RotateCcw className="size-3.5" /> Rollback Version
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2 cursor-pointer text-xs font-medium text-destructive focus:bg-destructive/10 focus:text-destructive"
                            onClick={() => handleAction(app.id, 'stop')}
                          >
                            <Power className="size-3.5" /> Stop Service
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      {expandedApp === app.id ? <ChevronUp className="size-4 text-muted-foreground/40 ml-2" /> : <ChevronDown className="size-4 text-muted-foreground/40 ml-2" />}
                    </div>
                  </div>
                </div>

                {expandedApp === app.id && (
                  <div className="mt-6 pt-6 border-t border-border/40 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="grid gap-8 md:grid-cols-4">
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Environment</p>
                        <p className="text-xs font-semibold">Production</p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Server Node</p>
                        <p className="text-xs font-semibold flex items-center gap-1.5">
                          <Globe className="size-3 text-muted-foreground" />
                          US-East-1 (Node-1)
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Git Branch</p>
                        <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono">main</code>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Auto-Scale</p>
                        <Badge variant="secondary" className="text-[9px] font-bold uppercase py-0 px-1.5">Enabled</Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
