'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { mockServers } from '@/lib/mockData'
import Link from 'next/link'

export default function ServersPage() {
  const [selectedServer, setSelectedServer] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-accent/20 text-accent'
      case 'inactive':
        return 'bg-muted text-muted-foreground'
      case 'provisioning':
        return 'bg-primary/20 text-primary'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Servers</h1>
          <p className="text-muted-foreground mt-1">Manage your cloud servers</p>
        </div>
        <Button>Create New Server</Button>
      </div>

      {/* Server List */}
      <div className="grid gap-6">
        {mockServers.map((server) => (
          <Card
            key={server.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedServer === server.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedServer(selectedServer === server.id ? null : server.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {server.name}
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(server.status)}`}>
                      {server.status}
                    </span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{server.provider} • {server.region}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">${server.monthlyPrice}</p>
                  <p className="text-xs text-muted-foreground">/month</p>
                </div>
              </div>
            </CardHeader>

            {selectedServer === server.id && (
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm text-muted-foreground">CPU Cores</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{server.cpuCores}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm text-muted-foreground">RAM</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{server.ram}GB</p>
                  </div>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm text-muted-foreground">Storage</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{server.storage}GB</p>
                  </div>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm text-muted-foreground">Bandwidth</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{server.bandwidth}GB</p>
                  </div>
                </div>

                <div className="mt-6 flex gap-4">
                  <Button variant="outline" asChild>
                    <Link href={`/dashboard/servers/${server.id}`}>View Details</Link>
                  </Button>
                  <Button variant="outline">Manage</Button>
                  <Button variant="destructive" className="ml-auto">Delete</Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Server Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Server Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Servers</p>
              <p className="text-3xl font-bold text-foreground mt-2">{mockServers.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-3xl font-bold text-accent mt-2">
                {mockServers.filter(s => s.status === 'active').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Monthly Cost</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                ${mockServers.reduce((sum, s) => sum + s.monthlyPrice, 0).toFixed(0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Bandwidth</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {mockServers.reduce((sum, s) => sum + s.bandwidth, 0) / 1000}TB
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
