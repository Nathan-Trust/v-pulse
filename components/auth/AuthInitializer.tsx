'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

export function AuthInitializer() {
  const { setUser } = useAuthStore()

  useEffect(() => {
    // Initialize auth state from cookie on app load
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split(';')
      const authCookie = cookies.find(c => c.trim().startsWith('auth-token='))
      
      if (authCookie) {
        try {
          const token = authCookie.split('=')[1]
          const userData = JSON.parse(atob(token))
          console.log('[v0] Initializing auth from cookie:', userData.email)
          setUser(userData)
        } catch (err) {
          console.log('[v0] Failed to restore auth session')
        }
      }
    }
  }, [setUser])

  return null
}
