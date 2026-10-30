import { BRAND } from '@/lib/brand'

export interface Invoice {
  id: string
  date: string
  amount: string
  status: 'Paid' | 'Pending'
}

// '2026-02-14' -> '14 Feb 2026'
export function formatInvoiceDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Sequential per-year invoice number, e.g. VP-2026-0004
export function nextInvoiceNumber(isoDate: string, existing: Invoice[]) {
  const year = (isoDate || '').slice(0, 4) || String(new Date().getFullYear())
  const prefix = `${BRAND.invoicePrefix}-${year}-`
  const highest = existing
    .map(inv => String(inv.id))
    .filter(id => id.startsWith(prefix))
    .reduce((max, id) => Math.max(max, parseInt(id.slice(prefix.length), 10) || 0), 0)
  return `${prefix}${String(highest + 1).padStart(4, '0')}`
}

export async function generateInvoicePDF(invoice: Invoice, customerName?: string) {
  // Loaded on demand so the PDF libraries stay out of the billing page bundle
  const jspdfModule = await import('jspdf')
  const jsPDF = jspdfModule.jsPDF || (jspdfModule as any).default
  const autoTableModule = await import('jspdf-autotable')
  const autoTable = autoTableModule.default || (autoTableModule as any)

  const id = invoice.id
  const isPaid = invoice.status === 'Paid'
  const amountNum = parseFloat(String(invoice.amount).replace('$', '')) || 0

  const bandwidthAmount = (amountNum * 0.65).toFixed(2)
  const storageAmount = (amountNum * 0.35).toFixed(2)

  const doc = new jsPDF()

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(BRAND.issuer.name, 20, 20)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(BRAND.issuer.address, 20, 28)

  // "Invoice" wordmark + invoice number, top right
  doc.setFontSize(28)
  doc.setTextColor(40, 40, 40)
  doc.text('Invoice', 190, 22, { align: 'right' })

  doc.setFontSize(10)
  doc.setTextColor(120, 120, 120)
  doc.text(`# ${id}`, 190, 29, { align: 'right' })

  // Balance Due callout
  const paymentMade = isPaid ? amountNum : 0
  const balanceDue = amountNum - paymentMade
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(120, 120, 120)
  doc.text('Balance Due', 190, 40, { align: 'right' })
  doc.setFontSize(13)
  doc.setTextColor(30, 30, 30)
  doc.text(`$${balanceDue.toFixed(2)}`, 190, 47, { align: 'right' })

  // Meta rows (label right-aligned at 150, value right-aligned at 190)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  let currentY = 62
  const metaItems = [
    { label: 'Invoice Date :', value: formatInvoiceDate(invoice.date) },
    { label: 'Terms :', value: 'Due on Receipt' },
    { label: 'Due Date :', value: formatInvoiceDate(invoice.date) },
  ]
  metaItems.forEach(item => {
    doc.setTextColor(120, 120, 120)
    doc.text(item.label, 150, currentY, { align: 'right' })
    doc.setTextColor(40, 40, 40)
    doc.text(item.value, 190, currentY, { align: 'right' })
    currentY += 7
  })

  // Bill To block
  doc.setTextColor(120, 120, 120)
  doc.text('Bill To', 20, 62)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(30, 30, 30)
  doc.text(customerName || 'Sample Customer', 20, 69)

  autoTable(doc, {
    startY: 85,
    head: [['#', 'Item & Description', 'Qty', 'Rate (USD)', 'Amount (USD)']],
    body: [
      [
        '1',
        { content: 'Server Bandwidth\nHigh-volume data transfer and network capacity fee.', styles: { fontStyle: 'normal' } },
        '1.00',
        `$${bandwidthAmount}`,
        `$${bandwidthAmount}`,
      ],
      [
        '2',
        { content: 'Cloud Storage Maintenance\nMonthly upkeep for secure application data hosting.', styles: { fontStyle: 'normal' } },
        '1.00',
        `$${storageAmount}`,
        `$${storageAmount}`,
      ],
    ],
    theme: 'plain',
    headStyles: {
      fillColor: [50, 50, 50],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      cellPadding: 3,
    },
    bodyStyles: { textColor: [60, 60, 60], fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 90 },
      2: { cellWidth: 20, halign: 'right' },
      3: { cellWidth: 25, halign: 'right' },
      4: { cellWidth: 25, halign: 'right' },
    },
    margin: { left: 20, right: 20 },
  })

  const tableEnd = (doc as any).lastAutoTable.finalY
  doc.setDrawColor(220, 220, 220)
  doc.setLineWidth(0.2)
  doc.line(20, tableEnd + 2, 190, tableEnd + 2)

  let ty = tableEnd + 12
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(90, 90, 90)
  doc.text('Sub Total', 150, ty, { align: 'right' })
  doc.text(amountNum.toFixed(2), 190, ty, { align: 'right' })
  ty += 8

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(40, 40, 40)
  doc.text('Total', 150, ty, { align: 'right' })
  doc.text(`$${amountNum.toFixed(2)}`, 190, ty, { align: 'right' })
  ty += 8

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(90, 90, 90)
  doc.text('Payment Made', 150, ty, { align: 'right' })
  doc.setTextColor(200, 60, 60)
  doc.text(`(-) ${paymentMade.toFixed(2)}`, 190, ty, { align: 'right' })
  ty += 6

  // Highlighted Balance Due row
  doc.setFillColor(243, 243, 243)
  doc.rect(120, ty - 1, 70, 10, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(30, 30, 30)
  doc.text('Balance Due', 150, ty + 5.5, { align: 'right' })
  doc.text(`$${balanceDue.toFixed(2)}`, 187, ty + 5.5, { align: 'right' })

  // Footer: Notes + Terms
  const footerY = ty + 30
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(60, 60, 60)
  doc.text('Notes', 20, footerY)
  doc.setFontSize(8)
  doc.setTextColor(120, 120, 120)
  doc.text(isPaid ? 'Thank you for your payment.' : 'Thank you for your business.', 20, footerY + 6)

  doc.setFontSize(9)
  doc.setTextColor(60, 60, 60)
  doc.text('Terms & Conditions', 20, footerY + 20)
  doc.setFontSize(8)
  doc.setTextColor(120, 120, 120)
  doc.text('Sample document for demonstration only. Not a valid invoice or proof of payment.', 20, footerY + 26)

  // Drawn last so the table fills and highlight rows can't cover it
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.12 }))
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(96)
  doc.setTextColor(200, 30, 30)
  doc.text('SAMPLE', 105, 175, { align: 'center', angle: 35 })
  doc.restoreGraphicsState()

  doc.save(`VPulse_SAMPLE_Invoice_${id}.pdf`)
}
