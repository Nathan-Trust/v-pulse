'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { useAuthStore } from '@/store/authStore'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Initialize and check auth
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split(';')
      const authCookie = cookies.find(c => c.trim().startsWith('auth-token='))
      
      if (!authCookie && !isAuthenticated) {
        console.log('[v0] No auth found, redirecting to login')
        router.push('/login')
      } else {
        setIsReady(true)
      }
    }
  }, [isAuthenticated, router])

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <DashboardHeader />
        <main className="mt-16 ml-64 lg:ml-16 flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
