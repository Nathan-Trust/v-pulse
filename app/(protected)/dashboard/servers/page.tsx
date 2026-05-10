'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { mockServers as initialServers } from '@/lib/mockData'
import { type Server as ServerType } from '@/lib/schemas'
import Link from 'next/link'
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
  AlertCircle,
  AlertTriangle,
  ChevronRight,
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

export default function ServersPage() {
  const [servers, setServers] = useState<ServerType[]>(initialServers as ServerType[])
  const [selectedServer, setSelectedServer] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddNode = async () => {
    setIsAdding(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newNode: ServerType = {
      id: `FT-${Math.floor(Math.random() * 10000)}`,
      name: `Node-${servers.length + 1}`,
      status: 'provisioning',
      region: 'US-East',
      provider: 'Digital Ocean', // Must be one of the enum values
      cpuCores: 4,
      ram: 8,
      storage: 160,
      bandwidth: 5, // Missing in previous version
      monthlyPrice: 40.00,
      createdAt: new Date().toISOString(), // Missing in previous version
    }
    
    setServers([...servers, newNode])
    setIsAdding(false)
    
    // Simulate it becoming active
    setTimeout(() => {
      setServers(prev => prev.map(s => s.id === newNode.id ? { ...s, status: 'active' } : s))
    }, 5000)
  }

  const handleTerminate = async (id: string) => {
    if (confirm('Are you sure you want to terminate this server? This action is irreversible.')) {
      setServers(prev => prev.filter(s => s.id !== id))
      if (selectedServer === id) setSelectedServer(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="size-3.5 text-accent" />
      case 'provisioning':
        return <Clock className="size-3.5 text-primary animate-pulse" />
      case 'inactive':
        return <AlertCircle className="size-3.5 text-muted-foreground" />
      default:
        return null
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-accent/5 text-accent border-accent/10'
      case 'provisioning':
        return 'bg-primary/5 text-primary border-primary/10'
      case 'inactive':
        return 'bg-muted/50 text-muted-foreground border-border'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Account Alert Banner */}
      <div className="flex items-center justify-between p-5 px-8 bg-[#FEF2F2] border border-destructive/10 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="size-9 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="size-5 text-destructive" />
          </div>
          <p className="text-sm font-medium text-destructive/90 leading-relaxed">
            Your account has a past due balance. Please submit a payment of <span className="font-bold">$247</span> before Tuesday, May 12 to prevent service suspension.
          </p>
        </div>
        <Link 
          href="/dashboard/billing" 
          className="text-sm font-bold text-destructive hover:underline flex items-center gap-2 shrink-0 ml-12 bg-destructive/5 px-4 py-2 rounded-lg transition-colors hover:bg-destructive/10"
        >
          Pay Now <ChevronRight className="size-4" />
        </Link>
      </div>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Infrastructure</h1>
          <p className="text-muted-foreground text-sm mt-1 font-medium">
            Deploy and manage your distributed nodes.
          </p>
        </div>
        <Button 
          onClick={handleAddNode}
          disabled={isAdding}
          className="h-10 px-5 rounded-lg shadow-sm gap-2"
        >
          {isAdding ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          Add Node
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Instances', value: servers.length, icon: Server },
          { label: 'Active', value: servers.filter(s => s.status === 'active').length, icon: Activity },
          { label: 'Uptime', value: '99.98%', icon: CheckCircle2 },
          { label: 'Avg Latency', value: '24ms', icon: Globe },
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

      {/* Server List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-[0.15em]">Server Fleet</h2>
        </div>
        
        <div className="grid gap-3">
          {servers.map((server) => (
            <Card
              key={server.id}
              className={cn(
                "group border-border/40 shadow-none hover:border-primary/20 hover:bg-muted/10 transition-colors cursor-pointer",
                selectedServer === server.id && "border-primary/30 bg-muted/20"
              )}
              onClick={() => setSelectedServer(selectedServer === server.id ? null : server.id)}
            >
              <div className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-background transition-colors">
                      <Server className="size-5 text-muted-foreground/70" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-foreground">{server.name}</h3>
                        <div className={cn(
                          "flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                          getStatusClass(server.status)
                        )}>
                          {getStatusIcon(server.status)}
                          {server.status}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground font-medium mt-0.5">
                        {server.provider} • {server.region} • <span className="font-mono">{server.id}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-8">
                    <div className="grid grid-cols-3 gap-6 text-xs font-medium">
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60 font-bold">CPU</span>
                        <span className="text-foreground">{server.cpuCores}C</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60 font-bold">RAM</span>
                        <span className="text-foreground">{server.ram}GB</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60 font-bold">SSD</span>
                        <span className="text-foreground">{server.storage}GB</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-foreground">${server.monthlyPrice}</p>
                        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/60 font-bold">/ month</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-1">
                          <DropdownMenuItem className="gap-2 cursor-pointer text-xs font-medium">
                            <Clock className="size-3.5" /> View Logs
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer text-xs font-medium">
                            <Settings2 className="size-3.5" /> Configure
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleTerminate(server.id)}
                            className="gap-2 cursor-pointer text-xs font-medium text-destructive focus:bg-destructive/10 focus:text-destructive"
                          >
                            <Trash2 className="size-3.5" /> Terminate Node
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                {selectedServer === server.id && (
                  <div className="mt-6 pt-6 border-t border-border/40 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="grid gap-6 md:grid-cols-3">
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Throughput</p>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-accent w-[75%]" />
                        </div>
                        <p className="text-xs font-semibold">1.2 Gbps avg</p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Public IP</p>
                        <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono">192.168.1.{100 + parseInt(server.id.split('-')[1] || '0')}</code>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">OS Runtime</p>
                        <p className="text-xs font-semibold">Ubuntu 22.04 LTS</p>
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
