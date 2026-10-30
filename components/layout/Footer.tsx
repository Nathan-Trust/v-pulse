import { BRAND } from '@/lib/brand'

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-7 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </p>
        <p className="text-sm text-muted-foreground">Demo project. All data shown is sample data.</p>
      </div>
    </footer>
  )
}
