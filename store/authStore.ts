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
          // Mock authentication - in production, call API
          const mockUser: User = {
            id: '1',
            email,
            name: 'Demo User',
          }
          
          if (email === 'demo@fusiontech.com' && password === 'demo123') {
            // Set auth token cookie for middleware to recognize
            if (typeof window !== 'undefined') {
              document.cookie = `auth-token=${btoa(JSON.stringify(mockUser))}; path=/; max-age=604800`
              console.log('[v0] Setting auth cookie for user:', email)
            }
            set({ user: mockUser, isAuthenticated: true })
          } else {
            throw new Error('Invalid credentials')
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
          // Mock signup - in production, call API
          const newUser: User = {
            id: Math.random().toString(),
            email,
            name,
          }
          
          // Set auth token cookie for middleware to recognize
          if (typeof window !== 'undefined') {
            document.cookie = `auth-token=${btoa(JSON.stringify(newUser))}; path=/; max-age=604800`
            console.log('[v0] Setting auth cookie for new user:', email)
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
          console.log('[v0] Clearing auth cookie')
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
