import Link from 'next/link'
import { ReactNode } from 'react'
import { PulseLogo } from '@/components/brand/PulseMark'
import { BRAND } from '@/lib/brand'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col items-center justify-center px-4 py-12 sm:px-6 lg:flex-1 lg:px-20 xl:px-24">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-10 inline-block lg:hidden">
            <PulseLogo />
          </Link>
          <div className="mb-8">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>

      <div className="hidden flex-col justify-center border-l border-border bg-card px-16 lg:flex lg:flex-1">
        <Link href="/" className="mb-8 inline-block">
          <PulseLogo />
        </Link>
        <p className="max-w-md font-display text-3xl font-semibold tracking-tight text-foreground">
          {BRAND.tagline}
        </p>
        <svg viewBox="0 0 480 110" className="mt-10 w-full max-w-md" aria-hidden="true">
          <path
            d="M0 60h120l14-34 22 64 16-44 10 14h70l14-34 22 64 16-44 10 14h166"
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-primary"
          />
        </svg>
      </div>
    </div>
  )
}
