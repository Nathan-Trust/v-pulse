'use client'

import { useUIStore } from '@/store/uiStore'
import { Button } from '@/components/ui/button'
import { UserMenu } from '@/components/layout/UserMenu'

export function DashboardHeader() {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="ml-64 flex h-16 items-center justify-between px-6 lg:ml-16">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="lg:flex hidden"
        >
          ☰
        </Button>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Welcome back!
          </div>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
