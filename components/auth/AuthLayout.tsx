import Link from 'next/link';
import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-12 sm:px-6 lg:flex-1 lg:px-20 xl:px-24">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>

      {/* Right side - Hero */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:items-center lg:justify-center bg-gradient-to-br from-primary/20 via-transparent to-accent/20 px-8">
        <div className="max-w-md text-center flex flex-col items-center justify-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-8">
            <img
              src="/fusion-tech-logo.png"
              alt="Fusion Tech"
              className="h-10 w-40"
            />
          </Link>
          <p className="text-muted-foreground">
            Streamline your cloud infrastructure, manage bandwidth, and scale
            with confidence.
          </p>
        </div>
      </div>
    </div>
  );
}
