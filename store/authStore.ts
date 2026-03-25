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
          
          set({ user: newUser, isAuthenticated: true })
        } catch (error) {
          throw error
        } finally {
          set({ isLoading: false })
        }
      },
      
      logout: () => {
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
