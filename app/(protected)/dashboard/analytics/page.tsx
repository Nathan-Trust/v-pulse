'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { mockAnalytics } from '@/lib/mockData'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { 
  BarChart3, 
  Activity, 
  Cpu, 
  Database, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function AnalyticsPage() {
  const chartColors = {
    bandwidth: 'var(--primary)',
    cpu: 'var(--accent)',
    memory: 'oklch(0.65 0.2 40)',
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border shadow-md rounded-lg p-2.5 text-[10px]">
          <p className="font-bold text-foreground mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mt-0.5">
              <div className="size-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground font-medium">{entry.name}:</span>
              <span className="font-bold text-foreground">{entry.value}{entry.name === 'Bandwidth' ? ' GB' : '%'}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1 font-medium">
            Infrastructure performance monitoring and historical resource analysis.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-9 px-4 rounded-lg gap-2 border-border/40 text-xs font-bold">
            <Calendar className="size-3.5" />
            Last 30 Days
          </Button>
          <Button className="h-9 px-5 rounded-lg gap-2 shadow-sm text-xs font-bold">
            <Download className="size-3.5" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Avg Bandwidth', value: `${(mockAnalytics.bandwidth.reduce((sum, d) => sum + d.usage, 0) / mockAnalytics.bandwidth.length).toFixed(0)} GB`, trend: '+8.2%', up: true, icon: BarChart3 },
          { label: 'Peak CPU', value: `${Math.max(...mockAnalytics.cpuUsage.map(d => d.value))}%`, trend: '-2.4%', up: false, icon: Cpu },
          { label: 'Avg Memory', value: `${(mockAnalytics.memoryUsage.reduce((sum, d) => sum + d.value, 0) / mockAnalytics.memoryUsage.length).toFixed(0)}%`, trend: '+1.1%', up: true, icon: Activity },
          { label: 'Total Egress', value: `${(mockAnalytics.bandwidth.reduce((sum, d) => sum + d.usage, 0)).toFixed(0)} GB`, trend: '+12%', up: true, icon: Database },
        ].map((stat, i) => (
          <Card key={i} className="border-border/40 shadow-none bg-card/30">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="size-9 rounded-lg bg-muted flex items-center justify-center">
                  <stat.icon className="size-4 text-muted-foreground/70" />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border",
                  stat.up ? "bg-accent/5 text-accent border-accent/10" : "bg-destructive/5 text-destructive border-destructive/10"
                )}>
                  {stat.up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                  {stat.trend}
                </div>
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-bold mt-1 text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid gap-6">
        <Card className="border-border/40 shadow-none bg-card/30 overflow-hidden">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-base font-bold">Network Throughput</CardTitle>
            <CardDescription className="text-xs font-medium">Daily data transfer volume across all endpoints.</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockAnalytics.bandwidth}>
                  <defs>
                    <linearGradient id="colorBandwidth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.bandwidth} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={chartColors.bandwidth} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" opacity={0.5} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 500 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 500 }} 
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)', strokeWidth: 1 }} />
                  <Area
                    name="Bandwidth"
                    type="monotone"
                    dataKey="usage"
                    stroke={chartColors.bandwidth}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorBandwidth)"
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/40 shadow-none bg-card/30 overflow-hidden">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-sm font-bold">CPU Utilization</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-4">
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockAnalytics.cpuUsage}>
                    <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" opacity={0.5} />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'var(--muted-foreground)', fontSize: 9, fontWeight: 500 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'var(--muted-foreground)', fontSize: 9, fontWeight: 500 }} 
                      domain={[0, 100]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      name="CPU"
                      type="monotone"
                      dataKey="value"
                      stroke={chartColors.cpu}
                      strokeWidth={2}
                      dot={false}
                      animationDuration={1000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-none bg-card/30 overflow-hidden">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-sm font-bold">Memory Allocation</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-4">
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockAnalytics.memoryUsage}>
                    <defs>
                      <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColors.memory} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={chartColors.memory} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" opacity={0.5} />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'var(--muted-foreground)', fontSize: 9, fontWeight: 500 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'var(--muted-foreground)', fontSize: 9, fontWeight: 500 }} 
                      domain={[0, 100]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      name="Memory"
                      type="stepAfter"
                      dataKey="value"
                      stroke={chartColors.memory}
                      strokeWidth={1.5}
                      fillOpacity={1}
                      fill="url(#colorMemory)"
                      animationDuration={1000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
