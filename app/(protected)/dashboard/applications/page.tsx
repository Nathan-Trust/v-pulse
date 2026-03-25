'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { mockApplications, mockServers } from '@/lib/mockData'

export default function ApplicationsPage() {
  const [expandedApp, setExpandedApp] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-accent/20 text-accent'
      case 'stopped':
        return 'bg-muted text-muted-foreground'
      case 'error':
        return 'bg-destructive/20 text-destructive'
      default:
        return ''
    }
  }

  const getServerName = (serverId: string) => {
    return mockServers.find(s => s.id === serverId)?.name || 'Unknown'
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Applications</h1>
          <p className="text-muted-foreground mt-2">Deploy and manage your applications</p>
        </div>
        <Button className="w-full sm:w-auto">Deploy Application</Button>
      </div>

      {/* Applications Grid */}
      <div className="grid gap-4">
        {mockApplications.map((app) => (
          <Card
            key={app.id}
            className="cursor-pointer transition-all hover:shadow-md"
            onClick={() => setExpandedApp(expandedApp === app.id ? null : app.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {app.name}
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </CardTitle>
                  <div className="flex flex-col gap-1 mt-2 text-sm">
                    <p className="text-muted-foreground">
                      Server: <span className="text-foreground font-medium">{getServerName(app.serverId)}</span>
                    </p>
                    <p className="text-muted-foreground">
                      Type: <span className="text-foreground font-medium">{app.type}</span>
                    </p>
                    <p className="text-muted-foreground">
                      Domain: <span className="text-foreground font-medium text-sm break-all">{app.domain}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-accent">{app.uptimePercentage}%</p>
                  <p className="text-xs text-muted-foreground">Uptime</p>
                </div>
              </div>
            </CardHeader>

            {expandedApp === app.id && (
              <CardContent className="border-t border-border pt-6">
                <div className="space-y-6">
                  {/* Deployment Info */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Deployment Info</h4>
                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-2">
                      <div className="rounded-lg bg-muted p-4">
                        <p className="text-xs sm:text-sm text-muted-foreground">Last Deployed</p>
                        <p className="text-sm sm:text-base text-foreground font-medium mt-1">{app.lastDeployed}</p>
                      </div>
                      <div className="rounded-lg bg-muted p-4">
                        <p className="text-xs sm:text-sm text-muted-foreground">Environment</p>
                        <p className="text-sm sm:text-base text-foreground font-medium mt-1">Production</p>
                      </div>
                    </div>
                  </div>

                  {/* Health Metrics */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Health Metrics</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs sm:text-sm text-muted-foreground">CPU Usage</span>
                          <span className="text-xs sm:text-sm font-semibold">45%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-accent" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs sm:text-sm text-muted-foreground">Memory Usage</span>
                          <span className="text-xs sm:text-sm font-semibold">62%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-accent" style={{ width: '62%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs sm:text-sm text-muted-foreground">Response Time</span>
                          <span className="text-xs sm:text-sm font-semibold">125ms</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-accent" style={{ width: '30%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                    <Button variant="outline" className="flex-1 sm:flex-initial">Restart</Button>
                    <Button variant="outline" className="flex-1 sm:flex-initial">Logs</Button>
                    <Button variant="outline" className="flex-1 sm:flex-initial">Rollback</Button>
                    <Button variant="outline" className="flex-1 sm:flex-initial sm:ml-auto">Edit</Button>
                    <Button variant="destructive" className="flex-1 sm:flex-initial">Remove</Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Application Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">Total Applications</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground mt-2">{mockApplications.length}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Running</p>
              <p className="text-2xl sm:text-3xl font-bold text-accent mt-2">
                {mockApplications.filter(a => a.status === 'running').length}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg Uptime</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground mt-2">
                {(mockApplications.reduce((sum, a) => sum + a.uptimePercentage, 0) / mockApplications.length).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Languages</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground mt-2">
                {new Set(mockApplications.map(a => a.type)).size}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
