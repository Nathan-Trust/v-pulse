import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mockServers, mockApplications, mockAnalytics } from '@/lib/mockData'

export default function DashboardPage() {
  const totalServers = mockServers.length
  const activeServers = mockServers.filter(s => s.status === 'active').length
  const totalApplications = mockApplications.length
  const totalBandwidth = mockAnalytics.bandwidth.reduce((sum, d) => sum + d.usage, 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your infrastructure overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Servers</CardTitle>
            <span className="text-2xl">🖥️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalServers}</div>
            <p className="text-xs text-muted-foreground">{activeServers} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <span className="text-2xl">⚡</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
            <p className="text-xs text-muted-foreground">All running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bandwidth (Week)</CardTitle>
            <span className="text-2xl">📊</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBandwidth.toFixed(0)} GB</div>
            <p className="text-xs text-muted-foreground">↑ 12% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <span className="text-2xl">✅</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.98%</div>
            <p className="text-xs text-muted-foreground">Excellent</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Servers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockServers.slice(0, 3).map((server) => (
                <div
                  key={server.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition"
                >
                  <div>
                    <p className="font-medium text-sm">{server.name}</p>
                    <p className="text-xs text-muted-foreground">{server.region}</p>
                  </div>
                  <div className={`text-xs font-semibold px-2 py-1 rounded ${
                    server.status === 'active'
                      ? 'bg-accent/20 text-accent'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {server.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Monthly Cost</span>
                <span className="font-semibold">${mockServers.reduce((sum, s) => sum + s.monthlyPrice, 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Avg CPU Usage</span>
                <span className="font-semibold">45%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Avg Memory Usage</span>
                <span className="font-semibold">52%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Network Interfaces</span>
                <span className="font-semibold">{totalServers * 2}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
