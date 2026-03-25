import { TopNavigation } from '@/components/dashboard/TopNavigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopNavigation />
      <main className="flex-1 mt-16 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl w-full mx-auto">
        {children}
      </main>
    </div>
  )
}
