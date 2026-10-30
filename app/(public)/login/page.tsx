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
      {/* <div className="mt-8 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
        <p className="font-medium mb-2">Demo Credentials:</p>
        <p>Email: <span className="font-mono text-foreground">demo@vpulse.example</span></p>
        <p>Password: <span className="font-mono text-foreground">demo123</span></p>
      </div> */}
    </AuthLayout>
  )
}
