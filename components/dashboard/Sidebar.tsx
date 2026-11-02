'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Server, Zap, BarChart3, CreditCard, Settings, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { PulseLogo } from '@/components/brand/PulseMark'
import { UserMenu } from '@/components/layout/UserMenu'
import { useAuthStore } from '@/store/authStore'

const navItems = [
  { href: '/dashboard/servers', label: 'Servers', icon: Server },
  { href: '/dashboard/applications', label: 'Applications', icon: Zap },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
]

const settingsItem = { href: '/dashboard/settings', label: 'Settings', icon: Settings }

function NavItem({ item, onNavigate }: { item: typeof navItems[0]; onNavigate?: () => void }) {
  const pathname = usePathname()
  const Icon = item.icon
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        'relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary/10 text-foreground'
          : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
      )}
    >
      {isActive && (
        <span aria-hidden className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-primary" />
      )}
      <Icon className={cn('size-4 shrink-0', isActive && 'text-primary')} />
      {item.label}
    </Link>
  )
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuthStore()

  return (
    <div className="flex h-full flex-col border-r border-sidebar-border bg-sidebar">
      <div className="p-5">
        <Link href="/dashboard/servers" onClick={onNavigate}>
          <PulseLogo />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => (
          <NavItem key={item.href} item={item} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="space-y-3 border-t border-sidebar-border p-3">
        <NavItem item={settingsItem} onNavigate={onNavigate} />
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent p-3">
          <UserMenu />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-xs font-semibold text-foreground">{user?.name || 'V Pulse User'}</span>
            <span className="truncate text-xs text-muted-foreground">{user?.email || 'Signed in'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
        <Link href="/dashboard/servers">
          <PulseLogo />
        </Link>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open navigation">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 border-none p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </header>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col lg:flex">
        <SidebarContent />
      </aside>
    </>
  )
}
