'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Server, 
  Zap, 
  CreditCard, 
  Settings,
  Menu,
  ChevronRight
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button'
import { UserMenu } from '@/components/layout/UserMenu'
import { useAuthStore } from '@/store/authStore'

const navItems = [
  { href: '/dashboard/servers', label: 'Servers', icon: Server },
  { href: '/dashboard/applications', label: 'Applications', icon: Zap },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuthStore()

  const NavItem = ({ item }: { item: typeof navItems[0] }) => {
    const Icon = item.icon
    const isActive = pathname === item.href || pathname.startsWith(item.href)

    return (
      <Link
        href={item.href}
        className={cn(
          "group flex items-center gap-3 rounded-lg px-4 py-2.5 transition-all duration-200",
          isActive 
            ? "bg-primary text-primary-foreground shadow-sm" 
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <Icon className={cn("size-4 shrink-0", isActive ? "scale-105" : "group-hover:scale-105 transition-transform")} />
        <span className="font-medium text-sm flex-1">{item.label}</span>
        {isActive && <ChevronRight className="size-3 opacity-50" />}
      </Link>
    )
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card border-r border-border/40">
      {/* Logo Area */}
      <div className="p-6 pb-8">
        <Link href="/dashboard/servers" className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <img
              src="/fusion-tech-logo.png"
              alt="Fusion Tech Logo"
              className="h-10 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                const parent = e.currentTarget.parentElement
                if (parent) {
                  const text = document.createElement('span')
                  text.className = 'text-xl font-bold tracking-tight text-primary'
                  text.innerText = 'Fusion Tech'
                  parent.appendChild(text)
                }
              }}
            />
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 mt-auto border-t border-border/40 bg-muted/20">
        <NavItem item={{ href: '/dashboard/settings', label: 'Settings', icon: Settings }} />
        
        <div className="flex items-center gap-3 p-3 mt-4 rounded-lg bg-card border border-border/40">
          <UserMenu />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold truncate text-foreground">{user?.name || 'Nathan Trust'}</span>
            <span className="text-[10px] text-muted-foreground truncate">{user?.email || 'Administrator'}</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-md border-border/50 shadow-sm">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 border-none">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col z-40">
        <SidebarContent />
      </aside>
    </>
  )
}
