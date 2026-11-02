// API and app constants
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  SERVERS: '/dashboard/servers',
  APPLICATIONS: '/dashboard/applications',
  ANALYTICS: '/dashboard/analytics',
  BILLING: '/dashboard/billing',
  SETTINGS: '/dashboard/settings',
}

export const DEFAULT_USERS = [
  {
    id: '1',
    email: 'admin@vpulse.app',
    password: 'vpulse123',
    name: 'V Pulse User',
  },
]
