'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { loginSchema, type LoginInput } from '@/lib/schemas'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BRAND } from '@/lib/brand'

const ALLOWED_EMAILS = [
  BRAND.loginEmail,
  'admin@gmail.com',
  'cto@gmail.com',
  'nathan@gmail.io',
  'billpointdev@gmail.com'
]

export function LoginForm() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [error, setError] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setError('')
    
    const emailLower = data.email.toLowerCase()
    
    // Check if email is allowed (case-insensitive)
    if (!ALLOWED_EMAILS.some(e => e.toLowerCase() === emailLower)) {
      setError('Access denied. This account does not have permission to access the dashboard.')
      return
    }

    try {
      await login(data.email, data.password)
      router.push('/dashboard/servers')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed'
      setError(errorMsg)
    }
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address
          </Label>
          <Input
            {...register('email')}
            id="email"
            type="email"
            placeholder="you@company.com"
            className="mt-2 h-11"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <Input
            {...register('password')}
            id="password"
            type="password"
            placeholder="••••••••"
            className="mt-2 h-11"
          />
          {errors.password && (
            <p className="mt-2 text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11"
        >
          {isSubmitting ? 'Verifying Access...' : 'Sign In'}
        </Button>
      </form>
  
    </div>
  )
}
