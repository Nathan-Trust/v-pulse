import type { Metadata } from 'next'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { SignupForm } from '@/components/auth/SignupForm'

export const metadata: Metadata = {
  title: 'Create Account - V Pulse',
  description: 'Create a new V Pulse account',
}

export default function SignupPage() {
  return (
    <AuthLayout
      title="Get Started"
      subtitle="Create your account to begin managing your cloud infrastructure"
    >
      <SignupForm />
    </AuthLayout>
  )
}
