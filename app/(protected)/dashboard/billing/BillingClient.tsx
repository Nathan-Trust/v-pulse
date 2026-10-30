'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { StatCard } from '@/components/dashboard/StatCard'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { mockPlans, mockServers } from '@/lib/mockData'
import { BRAND } from '@/lib/brand'
import { formatInvoiceDate, generateInvoicePDF, nextInvoiceNumber, type Invoice } from '@/lib/invoice-pdf'
import {
  CreditCard,
  TrendingUp,
  CheckCircle2,
  Download,
  Wallet,
  Clock,
  Plus,
  Loader2,
  FileText,
  DollarSign,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

const STORAGE_KEY = 'vp_invoices_v1'
const P = BRAND.invoicePrefix

const SEED_INVOICES: Invoice[] = [
  { date: '2024-03-15', amount: '$247.00', status: 'Pending', id: `${P}-2024-0003` },
  { date: '2024-02-15', amount: '$874.99', status: 'Paid', id: `${P}-2024-0002` },
  { date: '2024-01-15', amount: '$824.99', status: 'Paid', id: `${P}-2024-0001` },
]

export default function BillingClient() {
  const { user } = useAuthStore()
  const currentPlan = mockPlans[1] // Professional plan
  const nextInvoiceDate = '2024-04-15'
  const totalMonthlyUsage = mockServers.reduce((sum, s) => sum + s.monthlyPrice, 0)

  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDownloading, setIsDownloading] = useState<string | null>(null)
  const [isPaying, setIsPaying] = useState(false)

  // Custom invoice dialog
  const [customPrice, setCustomPrice] = useState('247')
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setInvoices(JSON.parse(saved))
    } else {
      setInvoices(SEED_INVOICES)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_INVOICES))
    }
  }, [])

  const saveInvoices = (newInvoices: Invoice[]) => {
    setInvoices(newInvoices)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newInvoices))
  }

  const downloadPDF = async (invoice: Invoice) => {
    try {
      await generateInvoicePDF(invoice, user?.name)
      return true
    } catch (error) {
      console.error('PDF Generation Error:', error)
      toast.error('PDF generation encountered an issue. Please try again.')
      return false
    }
  }

  const amount = parseFloat(customPrice)
  const isAmountValid = Number.isFinite(amount) && amount > 0
  const canCreate = isAmountValid && !!customDate

  const handleCreateInvoice = async () => {
    if (!canCreate) return
    setIsGenerating(true)

    const newInvoice: Invoice = {
      date: customDate,
      amount: `$${amount.toFixed(2)}`,
      status: 'Paid',
      id: nextInvoiceNumber(customDate, invoices),
    }

    saveInvoices([newInvoice, ...invoices])

    // Pass the invoice directly: reading it back from state here would race the re-render
    const saved = await downloadPDF(newInvoice)

    setIsGenerating(false)
    setIsDialogOpen(false)
    if (saved) toast.success(`Sample invoice ${newInvoice.id} created`)
  }

  const handleDownloadPDF = async (invoice: Invoice) => {
    setIsDownloading(invoice.id)
    await downloadPDF(invoice)
    setIsDownloading(null)
  }

  const handlePayNow = async () => {
    setIsPaying(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    saveInvoices(invoices.map(inv => inv.status === 'Pending' ? { ...inv, status: 'Paid' } : inv))
    setIsPaying(false)
    toast.success('Pending demo invoices are now marked as Paid.')
  }

  const hasPending = invoices.some(inv => inv.status === 'Pending')

  return (
    <div className="space-y-8 pb-12">
      <PageHeader title="Billing" description="Review your plan and generate sample PDF invoices.">
        <Badge variant="outline" className="border-warning/40 text-warning">Demo data</Badge>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="size-4" />
              Create Sample Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">New Sample Invoice</DialogTitle>
              <DialogDescription>
                Set the amount and issue date. The PDF downloads immediately and is watermarked SAMPLE.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="price">Invoice Amount (USD)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    aria-invalid={!isAmountValid}
                    className="h-11 pl-10"
                    placeholder="0.00"
                  />
                </div>
                {!isAmountValid && (
                  <p className="text-xs text-destructive">Enter an amount greater than zero.</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="h-11"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateInvoice} disabled={isGenerating || !canCreate} className="h-11 w-full gap-2">
                {isGenerating && <Loader2 className="size-4 animate-spin" />}
                Generate & Download PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Accrued Charges" value={`$${totalMonthlyUsage.toFixed(2)}`} hint="Usage this period" icon={TrendingUp} />
        <StatCard label="Estimated Next" value={`$${(currentPlan.price + totalMonthlyUsage).toFixed(2)}`} hint={`Due ${nextInvoiceDate}`} icon={Clock} />
        <StatCard label="Credit Balance" value="$50.00" hint="Auto-applied to total" icon={Wallet} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Invoice History <span className="text-sm font-normal text-muted-foreground">({invoices.length})</span>
            </h2>
            {hasPending && (
              <Button variant="outline" size="sm" onClick={handlePayNow} disabled={isPaying} className="gap-2">
                {isPaying && <Loader2 className="size-3.5 animate-spin" />}
                Settle Pending
              </Button>
            )}
          </div>
          <Card className="gap-0 overflow-hidden py-0 shadow-none">
            {invoices.length > 0 ? (
              <div className="divide-y divide-border">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-4 transition-colors hover:bg-muted/50">
                    <div className="flex min-w-0 items-center gap-4">
                      <FileText className="size-4 shrink-0 text-primary" />
                      <div className="min-w-0">
                        <p className="truncate font-mono text-sm text-foreground">{invoice.id}</p>
                        <p className="text-xs text-muted-foreground">{formatInvoiceDate(invoice.date)} · Service Fee</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 sm:gap-5">
                      <p className="text-sm font-semibold text-foreground">{invoice.amount}</p>
                      <StatusBadge status={invoice.status} />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        aria-label={`Download ${invoice.id}`}
                        onClick={() => handleDownloadPDF(invoice)}
                        disabled={isDownloading === invoice.id}
                      >
                        {isDownloading === invoice.id ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-8 text-center text-sm text-muted-foreground">No invoices generated yet.</p>
            )}
          </Card>
        </section>

        <div className="space-y-6">
          <Card className="gap-0 py-0 shadow-none">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="font-display text-lg font-semibold text-foreground">{currentPlan.name}</p>
                <Badge variant="secondary">Current Plan</Badge>
              </div>
              <p className="mt-3">
                <span className="font-display text-3xl font-semibold text-foreground">${currentPlan.price}</span>
                <span className="text-sm text-muted-foreground"> /month</span>
              </p>
              <ul className="mt-4 space-y-2">
                {currentPlan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="size-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="gap-0 py-0 shadow-none">
            <CardContent className="space-y-4 p-5">
              <p className="font-display text-lg font-semibold text-foreground">Payment Settings</p>
              <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                <CreditCard className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Visa ending in 4242</p>
                  <p className="text-xs text-muted-foreground">Expires 12/2025</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">Update Method</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
