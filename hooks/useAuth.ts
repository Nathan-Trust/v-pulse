'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  const router = useRouter()
  const { user, isAuthenticated, setUser } = useAuthStore()

  // Initialize auth state from cookie on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split(';')
      const authCookie = cookies.find(c => c.trim().startsWith('auth-token='))
      
      if (authCookie) {
        try {
          const token = authCookie.split('=')[1]
          const userData = JSON.parse(atob(token))
          console.log('[v0] Restored user from cookie:', userData)
          setUser(userData)
        } catch (err) {
          console.log('[v0] Failed to parse auth cookie')
          setUser(null)
        }
      }
    }
  }, [setUser])

  return { user, isAuthenticated }
}

export function useProtectedRoute() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      console.log('[v0] Redirecting to login - not authenticated')
      router.push('/login')
    }
  }, [isAuthenticated, router])

  return isAuthenticated
}
