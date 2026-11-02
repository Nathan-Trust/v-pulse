import type { Metadata } from 'next'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Sign In - V Pulse',
  description: 'Sign in to your V Pulse account',
}

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to access your dashboard"
    >
      <LoginForm />
    </AuthLayout>
  )
}
