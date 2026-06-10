'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { mockPlans, mockServers } from '@/lib/mockData'
import { 
  CreditCard, 
  Receipt, 
  TrendingUp, 
  CheckCircle2, 
  ArrowUpRight, 
  Download,
  Wallet,
  Clock,
  Zap,
  Plus,
  Loader2,
  FileText,
  AlertTriangle,
  Check,
  ChevronRight,
  DollarSign
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from '@/lib/utils'

export default function BillingClient() {
  const { user } = useAuthStore()
  const currentPlan = mockPlans[1] // Professional plan
  const nextInvoiceDate = '2024-04-15'
  const totalMonthlyUsage = mockServers.reduce((sum, s) => sum + s.monthlyPrice, 0)
  
  const [invoices, setInvoices] = useState<any[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [justGenerated, setJustGenerated] = useState(false)
  const [isDownloading, setIsDownloading] = useState<string | null>(null)
  const [isPaying, setIsPaying] = useState(false)
  
  // Custom Invoice States
  const [customPrice, setCustomPrice] = useState('247')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Persist invoices in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ft_invoices')
    if (saved) {
      setInvoices(JSON.parse(saved))
    } else {
      const initial = [
        { date: '2024-03-15', amount: '$247', status: 'Pending', id: '5100147867' },
        { date: '2024-02-15', amount: '$874.99', status: 'Paid', id: '5100147866' },
        { date: '2024-01-15', amount: '$824.99', status: 'Paid', id: '5100147865' },
      ]
      setInvoices(initial)
      localStorage.setItem('ft_invoices', JSON.stringify(initial))
    }
  }, [])

  const saveInvoices = (newInvoices: any[]) => {
    setInvoices(newInvoices)
    localStorage.setItem('ft_invoices', JSON.stringify(newInvoices))
  }

  const handleCreateInvoice = async () => {
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const amount = parseFloat(customPrice) || 0
    const newInvoice = {
      date: new Date().toISOString().split('T')[0],
      amount: `$${amount.toFixed(2)}`,
      status: 'Pending',
      id: `510014${Math.floor(7000 + Math.random() * 2000)}`
    }
    
    const updated = [newInvoice, ...invoices]
    saveInvoices(updated)
    setIsGenerating(false)
    setJustGenerated(true)
    setIsDialogOpen(false)
    setTimeout(() => setJustGenerated(false), 3000)
  }

  const handleDownloadPDF = async (id: string) => {
    setIsDownloading(id)
    try {
      // Robust dynamic import for jsPDF and its autoTable plugin
      const jspdfModule = await import('jspdf')
      // Some versions export jsPDF as default, others as a named export
      const jsPDF = jspdfModule.jsPDF || (jspdfModule as any).default
      
      // Import autoTable which attaches itself to jsPDF
      await import('jspdf-autotable')
      
      const invoice = invoices.find(inv => inv.id === id);
      const amountStr = invoice?.amount.replace('$', '') || '0';
      const amountNum = parseFloat(amountStr);
      
      const bandwidthAmount = (amountNum * 0.65).toFixed(2);
      const storageAmount = (amountNum * 0.35).toFixed(2);

      const doc = new jsPDF()

      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('FusionTech Solutions', 20, 20)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text([
        '70 King George Street, London,',
        'SW1A 0AA, United Kingdom.'
      ], 20, 28)

      doc.setFontSize(24)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(50, 50, 50)
      doc.text('INVOICE', 140, 25)

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 100, 100)
      
      const metaX = 140
      const metaValueX = 175
      let currentY = 40

      const metaItems = [
        { label: 'Invoice #', value: id },
        { label: 'Invoice Date', value: invoice?.date },
        { label: 'Terms', value: 'Due on Receipt' },
        { label: 'Due Date', value: invoice?.date },
      ]

      metaItems.forEach(item => {
        doc.setFont('helvetica', 'normal')
        doc.text(item.label, metaX, currentY)
        doc.setFont('helvetica', 'bold')
        doc.text(item.value, metaValueX, currentY)
        currentY += 6
      })

      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(100, 100, 100)
      doc.text('Bill To:', 20, 60)
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text(user?.name || 'Nathan Trust', 20, 68)

      // Use the autoTable plugin
      if ((doc as any).autoTable) {
        (doc as any).autoTable({
          startY: 85,
          head: [['#', 'Item & Description', 'Qty', 'Rate (USD)', 'Amount (USD)']],
          body: [
            [
              '1', 
              { content: 'Server Bandwidth\nHigh-volume data transfer and network capacity fee.', styles: { fontStyle: 'normal' } }, 
              '1.00', 
              `$${bandwidthAmount}`, 
              `$${bandwidthAmount}`
            ],
            [
              '2', 
              { content: 'Cloud Storage Maintenance\nMonthly upkeep for secure application data hosting.', styles: { fontStyle: 'normal' } }, 
              '1.00', 
              `$${storageAmount}`, 
              `$${storageAmount}`
            ]
          ],
          theme: 'grid',
          headStyles: { fillColor: [245, 245, 245], textColor: [50, 50, 50], fontStyle: 'bold', lineWidth: 0.1, lineColor: [200, 200, 200] },
          bodyStyles: { textColor: [50, 50, 50], lineWidth: 0.1, lineColor: [200, 200, 200] },
          columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 100 },
            2: { cellWidth: 20, halign: 'center' },
            3: { cellWidth: 30, halign: 'right' },
            4: { cellWidth: 30, halign: 'right' }
          },
          margin: { top: 80 }
        })

        const finalY = (doc as any).lastAutoTable.finalY + 10
        doc.setFontSize(10)
        doc.setTextColor(50, 50, 50)
        
        doc.text('Sub Total', 140, finalY)
        doc.text(`$${amountNum.toFixed(2)}`, 180, finalY, { align: 'right' })
        
        doc.text('Payment Made', 140, finalY + 7)
        doc.text('(-)$0.00', 180, finalY + 7, { align: 'right' })
        
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('Balance Due', 140, finalY + 16)
        doc.text(`$${amountNum.toFixed(2)}`, 180, finalY + 16, { align: 'right' })

        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(150, 150, 150)
        doc.text('Notes:', 20, finalY + 35)
        doc.text('Thank you for your business. This is a computer-generated invoice; no signature is required.', 20, finalY + 42)
      }

      doc.save(`FusionTech_Invoice_${id}.pdf`)
    } catch (error) {
      console.error('PDF Generation Error:', error)
      alert('PDF generation encountered an issue. Please try again.')
    } finally {
      setIsDownloading(null)
    }
  }

  const handlePayNow = async () => {
    setIsPaying(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    const updated = invoices.map(inv => inv.status === 'Pending' ? { ...inv, status: 'Paid' } : inv)
    saveInvoices(updated)
    setIsPaying(false)
    alert('Account settled successfully. All pending invoices are now marked as Paid.')
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Alert Banner */}
      <div className="flex items-center justify-between p-5 px-8 bg-[#FEF2F2] border border-destructive/10 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="size-9 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="size-5 text-destructive" />
          </div>
          <p className="text-sm font-medium text-destructive/90 leading-relaxed">
            Your account has a past due balance. Please submit a payment of <span className="font-bold">$248.57</span> before Friday, Jun 12, to prevent service suspension.
          </p>
        </div>
        <button 
          onClick={handlePayNow}
          disabled={isPaying}
          className="text-sm font-bold text-destructive hover:underline flex items-center gap-2 shrink-0 ml-12 bg-destructive/5 px-4 py-2 rounded-lg transition-colors hover:bg-destructive/10 disabled:opacity-50"
        >
          {isPaying ? <Loader2 className="size-4 animate-spin mr-1" /> : null}
          Pay Now <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Billing</h1>
          <p className="text-muted-foreground text-sm mt-1 font-medium">
            Review and generate official PDF invoices for your records.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant={justGenerated ? "secondary" : "outline"}
                className={cn(
                  "h-10 px-5 rounded-lg gap-2 border-border/40 font-bold text-xs transition-all",
                  justGenerated && "bg-green-50 text-green-600 border-green-200"
                )}
              >
                {justGenerated ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
                {justGenerated ? "Invoice Created" : "Create Custom Invoice"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">New Custom Invoice</DialogTitle>
                <DialogDescription className="text-sm">
                  Enter the specific amount for this invoice. It will be generated as a high-fidelity PDF.
                </DialogDescription>
              </DialogHeader>
              <div className="py-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Invoice Amount (USD)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      className="pl-10 h-12 text-lg font-bold rounded-xl"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleCreateInvoice} 
                  disabled={isGenerating}
                  className="w-full h-11 rounded-xl font-bold"
                >
                  {isGenerating ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                  Generate Official PDF
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Accrued Charges", value: `$${totalMonthlyUsage.toFixed(2)}`, description: "Usage this period", icon: TrendingUp, color: "text-accent" },
          { label: "Estimated Next", value: `$${(currentPlan.price + totalMonthlyUsage).toFixed(2)}`, description: `Due ${nextInvoiceDate}`, icon: Clock, color: "text-foreground" },
          { label: "Credit Balance", value: "$50.00", description: "Auto-applied to total", icon: Wallet, color: "text-primary" },
        ].map((stat, i) => (
          <Card key={i} className="border-border/40 shadow-none bg-card/40">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                  <p className={cn("text-2xl font-bold mt-1.5", stat.color)}>{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase opacity-60">{stat.description}</p>
                </div>
                <div className="size-9 rounded-lg bg-muted flex items-center justify-center">
                  <stat.icon className="size-4 text-muted-foreground/70" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-border/40 shadow-none bg-card/40 overflow-hidden relative">
            <div className="absolute top-4 right-4">
              <div className="bg-primary/5 text-primary text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-widest border border-primary/10">
                Current Plan
              </div>
            </div>
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-bold">{currentPlan.name}</CardTitle>
              <CardDescription className="text-sm font-medium">Professional infrastructure for growing teams.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">${currentPlan.price}</span>
                <span className="text-sm text-muted-foreground font-medium">/month</span>
              </div>
              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                {currentPlan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-muted-foreground">
                    <CheckCircle2 className="size-3.5 text-accent" />
                    {feature}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <section className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Invoices History</h2>
              <p className="text-[10px] font-bold text-muted-foreground/40">{invoices.length} entries</p>
            </div>
            <Card className="border-border/40 shadow-none bg-card/40 overflow-hidden">
              <div className="divide-y divide-border/40">
                {invoices.length > 0 ? invoices.map((invoice, idx) => (
                  <div key={invoice.id} className={cn(
                    "flex items-center justify-between p-4 px-5 transition-colors group",
                    idx === 0 && justGenerated ? "bg-green-50/50" : "hover:bg-muted/10"
                  )}>
                    <div className="flex items-center gap-4">
                      <div className="size-9 rounded-lg bg-muted flex items-center justify-center group-hover:bg-background transition-colors">
                        <FileText className="size-4 text-muted-foreground/60" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">{invoice.date}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">{invoice.id} • Service Fee</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <p className="font-bold text-sm text-foreground">{invoice.amount}</p>
                      <div className={cn(
                        "text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border",
                        invoice.status === 'Paid' ? "bg-accent/5 text-accent border-accent/10" : "bg-primary/5 text-primary border-primary/10"
                      )}>
                        {invoice.status}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="size-8 rounded-lg hover:bg-background"
                        onClick={() => handleDownloadPDF(invoice.id)}
                        disabled={isDownloading === invoice.id}
                      >
                        {isDownloading === invoice.id ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Download className="size-3.5 text-muted-foreground/70" />
                        )}
                      </Button>
                    </div>
                  </div>
                )) : (
                  <div className="p-8 text-center text-xs text-muted-foreground font-medium">
                    No invoices generated yet.
                  </div>
                )}
              </div>
            </Card>
          </section>
        </div>

        <div className="space-y-6">
          <Card className="border-border/40 shadow-none bg-card/40">
            <CardHeader className="p-6">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground/70">Payment Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/20 border border-border/20">
                <CreditCard className="size-5 text-muted-foreground/60" />
                <div>
                  <p className="text-xs font-bold text-foreground">Visa ending in 4242</p>
                  <p className="text-[9px] text-muted-foreground font-bold uppercase">Expires 12/2025</p>
                </div>
              </div>
              <Button variant="outline" className="w-full h-10 rounded-lg border-border/40 font-bold text-xs">Update Method</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
