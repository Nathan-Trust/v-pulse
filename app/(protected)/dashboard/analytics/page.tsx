'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { StatCard } from '@/components/dashboard/StatCard'
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
  Calendar,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const chartColors = {
  bandwidth: 'var(--chart-1)',
  cpu: 'var(--chart-2)',
  memory: 'var(--chart-3)',
}

const axisTick = { fill: 'var(--muted-foreground)', fontSize: 11 }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover p-2.5 text-xs shadow-md">
        <p className="mb-1 font-semibold text-foreground">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="mt-0.5 flex items-center gap-2">
            <div className="size-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-semibold text-foreground">{entry.value}{entry.name === 'Bandwidth' ? ' GB' : '%'}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

function Trend({ value, up }: { value: string; up: boolean }) {
  const Icon = up ? ArrowUpRight : ArrowDownRight
  return (
    <span className={cn('inline-flex items-center gap-0.5 text-xs font-medium', up ? 'text-success' : 'text-destructive')}>
      <Icon className="size-3.5" />
      {value}
    </span>
  )
}

export default function AnalyticsPage() {
  const { bandwidth, cpuUsage, memoryUsage } = mockAnalytics
  const totalBandwidth = bandwidth.reduce((sum, d) => sum + d.usage, 0)

  return (
    <div className="space-y-8 pb-12">
      <PageHeader title="Analytics" description="Infrastructure performance monitoring and historical resource analysis.">
        <Button variant="outline" className="gap-2">
          <Calendar className="size-4" />
          Last 30 Days
        </Button>
        <Button className="gap-2">
          <Download className="size-4" />
          Export Data
        </Button>
      </PageHeader>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Avg Bandwidth" value={`${(totalBandwidth / bandwidth.length).toFixed(0)} GB`} icon={BarChart3} badge={<Trend value="+8.2%" up />} />
        <StatCard label="Peak CPU" value={`${Math.max(...cpuUsage.map(d => d.value))}%`} icon={Cpu} badge={<Trend value="-2.4%" up={false} />} />
        <StatCard label="Avg Memory" value={`${(memoryUsage.reduce((sum, d) => sum + d.value, 0) / memoryUsage.length).toFixed(0)}%`} icon={Activity} badge={<Trend value="+1.1%" up />} />
        <StatCard label="Total Egress" value={`${totalBandwidth.toFixed(0)} GB`} icon={Database} badge={<Trend value="+12%" up />} />
      </div>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="font-display text-lg">Network Throughput</CardTitle>
          <CardDescription>Daily data transfer volume across all endpoints.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bandwidth}>
                <defs>
                  <linearGradient id="colorBandwidth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.bandwidth} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={chartColors.bandwidth} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={axisTick} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={axisTick} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)', strokeWidth: 1 }} />
                <Area name="Bandwidth" type="monotone" dataKey="usage" stroke={chartColors.bandwidth} strokeWidth={2} fill="url(#colorBandwidth)" animationDuration={1000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="font-display text-lg">CPU Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cpuUsage}>
                  <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={axisTick} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={axisTick} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line name="CPU" type="monotone" dataKey="value" stroke={chartColors.cpu} strokeWidth={2} dot={false} animationDuration={1000} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="font-display text-lg">Memory Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={memoryUsage}>
                  <defs>
                    <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.memory} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={chartColors.memory} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={axisTick} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={axisTick} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area name="Memory" type="stepAfter" dataKey="value" stroke={chartColors.memory} strokeWidth={1.5} fill="url(#colorMemory)" animationDuration={1000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
