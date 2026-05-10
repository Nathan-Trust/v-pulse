'use client'

import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

// Dynamically import the BillingClient with SSR disabled
// This prevents the PDF generation libraries (jspdf) from causing build errors during pre-rendering
const BillingClient = dynamic(() => import('./BillingClient'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] w-full items-center justify-center">
      <Loader2 className="size-8 animate-spin text-muted-foreground/20" />
    </div>
  )
})

export default function BillingPage() {
  return <BillingClient />
}
