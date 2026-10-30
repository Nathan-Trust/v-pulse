import { Sidebar } from '@/components/dashboard/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64">
        <main className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-10">{children}</main>
      </div>
    </div>
  )
}
