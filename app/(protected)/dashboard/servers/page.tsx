'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { StatCard } from '@/components/dashboard/StatCard'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { mockServers as initialServers } from '@/lib/mockData'
import { BRAND } from '@/lib/brand'
import { type Server as ServerType } from '@/lib/schemas'
import {
  Server,
  Activity,
  Globe,
  Plus,
  MoreHorizontal,
  Settings2,
  Trash2,
  CheckCircle2,
  Clock,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'

export default function ServersPage() {
  const [servers, setServers] = useState<ServerType[]>(initialServers as ServerType[])
  const [selectedServer, setSelectedServer] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [terminateTarget, setTerminateTarget] = useState<ServerType | null>(null)

  const handleAddNode = async () => {
    setIsAdding(true)
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newNode: ServerType = {
      id: `${BRAND.invoicePrefix}-${Math.floor(Math.random() * 10000)}`,
      name: `Node-${servers.length + 1}`,
      status: 'provisioning',
      region: 'US-East',
      provider: 'Digital Ocean',
      cpuCores: 4,
      ram: 8,
      storage: 160,
      bandwidth: 5,
      monthlyPrice: 40.00,
      createdAt: new Date().toISOString(),
    }

    setServers([...servers, newNode])
    setIsAdding(false)

    // Simulate it becoming active
    setTimeout(() => {
      setServers(prev => prev.map(s => s.id === newNode.id ? { ...s, status: 'active' } : s))
    }, 5000)
  }

  const handleTerminate = () => {
    if (!terminateTarget) return
    setServers(prev => prev.filter(s => s.id !== terminateTarget.id))
    if (selectedServer === terminateTarget.id) setSelectedServer(null)
    setTerminateTarget(null)
  }

  return (
    <div className="space-y-8 pb-12">
      <PageHeader title="Servers" description="Deploy and manage your distributed nodes.">
        <Button onClick={handleAddNode} disabled={isAdding} className="gap-2">
          {isAdding ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          Add Node
        </Button>
      </PageHeader>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Instances" value={servers.length} icon={Server} />
        <StatCard label="Active" value={servers.filter(s => s.status === 'active').length} icon={Activity} />
        <StatCard label="Uptime" value="99.98%" icon={CheckCircle2} />
        <StatCard label="Avg Latency" value="24ms" icon={Globe} />
      </div>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold text-foreground">Server Fleet</h2>
        <div className="grid gap-3">
          {servers.map((server) => (
            <Card
              key={server.id}
              className={cn(
                'cursor-pointer gap-0 py-0 shadow-none transition-colors hover:border-primary/40',
                selectedServer === server.id && 'border-primary/60'
              )}
              onClick={() => setSelectedServer(selectedServer === server.id ? null : server.id)}
            >
              <div className="p-5">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-semibold text-foreground">{server.name}</h3>
                      <StatusBadge status={server.status} />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {server.provider} · {server.region} · <span className="font-mono">{server.id}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-8 lg:justify-end">
                    <dl className="grid grid-cols-3 gap-6 text-sm">
                      <div>
                        <dt className="text-xs text-muted-foreground">CPU</dt>
                        <dd className="font-mono text-foreground">{server.cpuCores}C</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">RAM</dt>
                        <dd className="font-mono text-foreground">{server.ram}GB</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">SSD</dt>
                        <dd className="font-mono text-foreground">{server.storage}GB</dd>
                      </div>
                    </dl>

                    <div className="flex items-center gap-2">
                      <p className="mr-2 text-right font-semibold text-foreground">
                        ${server.monthlyPrice}
                        <span className="block text-xs font-normal text-muted-foreground">/ month</span>
                      </p>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="size-8" aria-label={`Actions for ${server.name}`}>
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenuItem className="gap-2">
                            <Clock className="size-4" /> View Logs
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Settings2 className="size-4" /> Configure
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive" className="gap-2" onClick={() => setTerminateTarget(server)}>
                            <Trash2 className="size-4" /> Terminate Node
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <ChevronDown className={cn('size-4 text-muted-foreground transition-transform', selectedServer === server.id && 'rotate-180')} />
                    </div>
                  </div>
                </div>

                {selectedServer === server.id && (
                  <div className="mt-5 grid gap-6 border-t border-border pt-5 animate-in fade-in slide-in-from-top-1 duration-200 md:grid-cols-3">
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Throughput</p>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-3/4 bg-primary" />
                      </div>
                      <p className="text-sm font-medium text-foreground">1.2 Gbps avg</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Public IP</p>
                      <code className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-foreground">
                        192.168.1.{100 + (parseInt(server.id.split('-')[1] || '0') % 155)}
                      </code>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">OS Runtime</p>
                      <p className="text-sm font-medium text-foreground">Ubuntu 22.04 LTS</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <AlertDialog open={!!terminateTarget} onOpenChange={(open) => !open && setTerminateTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terminate {terminateTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>This action is irreversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleTerminate}>Terminate</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
