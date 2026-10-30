import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          // Demo-only check: this runs in the browser, so it can't hold real secrets
          const isValidPassword =
            password.toLowerCase() === 'password' ||
            password === 'demo123'

          if (isValidPassword) {
            // Determine name based on email
            let name = 'Authorized User'
            const emailLower = email.toLowerCase()
            
            if (emailLower.includes('billpoint')) name = 'Billpoint Dev'
            else if (emailLower.includes('nathan')) name = 'Nathan Trust'
            else if (emailLower.includes('admin')) name = 'Administrator'
            else if (emailLower.includes('cto')) name = 'CTO'
            else if (emailLower.includes('demo')) name = 'Demo User'

            const mockUser: User = {
              id: Math.random().toString(36).substr(2, 9),
              email: emailLower,
              name,
            }
            
            // Set auth token cookie for middleware
            if (typeof window !== 'undefined') {
              document.cookie = `auth-token=${btoa(JSON.stringify(mockUser))}; path=/; max-age=604800`
            }
            
            set({ user: mockUser, isAuthenticated: true })
          } else {
            throw new Error('Invalid credentials. Please check your password.')
          }
        } catch (error) {
          throw error
        } finally {
          set({ isLoading: false })
        }
      },
      
      signup: async (name: string, email: string, password: string) => {
        set({ isLoading: true })
        try {
          const newUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name,
          }
          
          if (typeof window !== 'undefined') {
            document.cookie = `auth-token=${btoa(JSON.stringify(newUser))}; path=/; max-age=604800`
          }
          
          set({ user: newUser, isAuthenticated: true })
        } catch (error) {
          throw error
        } finally {
          set({ isLoading: false })
        }
      },
      
      logout: () => {
        if (typeof window !== 'undefined') {
          document.cookie = `auth-token=; path=/; max-age=0`
        }
        set({ user: null, isAuthenticated: false })
      },
      
      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
