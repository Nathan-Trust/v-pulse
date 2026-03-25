'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mockAnalytics } from '@/lib/mockData'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function AnalyticsPage() {
  const chartColors = {
    bandwidth: 'hsl(260, 85%, 60%)',
    cpu: 'hsl(160, 72%, 50%)',
    memory: 'hsl(40, 84%, 50%)',
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-2">Monitor your infrastructure performance</p>
      </div>

      {/* Bandwidth Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Bandwidth Usage (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <ResponsiveContainer width="100%" height={300} minWidth={300}>
            <AreaChart data={mockAnalytics.bandwidth}>
              <defs>
                <linearGradient id="colorBandwidth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors.bandwidth} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={chartColors.bandwidth} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
              <XAxis
                dataKey="date"
                stroke="hsl(0, 0%, 50%)"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="hsl(0, 0%, 50%)"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(0, 0%, 100%)',
                  border: '1px solid hsl(0, 0%, 85%)',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="usage"
                stroke={chartColors.bandwidth}
                fillOpacity={1}
                fill="url(#colorBandwidth)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* CPU and Memory Usage */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>CPU Usage Over Time</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <ResponsiveContainer width="100%" height={250} minWidth={300}>
              <LineChart data={mockAnalytics.cpuUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
                <XAxis
                  dataKey="time"
                  stroke="hsl(0, 0%, 50%)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="hsl(0, 0%, 50%)"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(0, 0%, 100%)',
                    border: '1px solid hsl(0, 0%, 85%)',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={chartColors.cpu}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Memory Usage Over Time</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <ResponsiveContainer width="100%" height={250} minWidth={300}>
              <LineChart data={mockAnalytics.memoryUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
                <XAxis
                  dataKey="time"
                  stroke="hsl(0, 0%, 50%)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="hsl(0, 0%, 50%)"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(0, 0%, 100%)',
                    border: '1px solid hsl(0, 0%, 85%)',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={chartColors.memory}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Avg Bandwidth/Day</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">
                {(mockAnalytics.bandwidth.reduce((sum, d) => sum + d.usage, 0) / mockAnalytics.bandwidth.length).toFixed(0)} GB
              </p>
              <p className="text-xs text-muted-foreground mt-1">↑ 8%</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">Peak CPU Usage</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">
                {Math.max(...mockAnalytics.cpuUsage.map(d => d.value))}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">at 12:00 PM</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">Avg Memory Usage</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">
                {(mockAnalytics.memoryUsage.reduce((sum, d) => sum + d.value, 0) / mockAnalytics.memoryUsage.length).toFixed(0)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">↓ 2%</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">Data Transferred</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">
                {(mockAnalytics.bandwidth.reduce((sum, d) => sum + d.usage, 0)).toFixed(0)} GB
              </p>
              <p className="text-xs text-muted-foreground mt-1">This week</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
