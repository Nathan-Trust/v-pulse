import { BRAND } from "@/lib/brand";

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: "Paid" | "Pending";
  lineItemCount?: 1 | 2 | 3;
}

// '2026-02-14' -> '14 Feb 2026'
export function formatInvoiceDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Sequential per-year invoice number, e.g. VP-2026-0004
export function nextInvoiceNumber(isoDate: string, existing: Invoice[]) {
  const year = (isoDate || "").slice(0, 4) || String(new Date().getFullYear());
  const prefix = `${BRAND.invoicePrefix}-${year}-`;
  const highest = existing
    .map((inv) => String(inv.id))
    .filter((id) => id.startsWith(prefix))
    .reduce(
      (max, id) => Math.max(max, parseInt(id.slice(prefix.length), 10) || 0),
      0,
    );
  return `${prefix}${String(highest + 1).padStart(4, "0")}`;
}

export async function generateInvoicePDF(
  invoice: Invoice,
  customerName?: string,
) {
  // Loaded on demand so the PDF libraries stay out of the billing page bundle
  const jspdfModule = await import("jspdf");
  const jsPDF = jspdfModule.jsPDF || (jspdfModule as any).default;
  const autoTableModule = await import("jspdf-autotable");
  const autoTable = autoTableModule.default || (autoTableModule as any);

  const id = invoice.id;
  const isPaid = invoice.status === "Paid";
  const amountNum =
    Math.round(
      (parseFloat(String(invoice.amount).replace("$", "")) || 0) * 100,
    ) / 100;
  const itemCount = invoice.lineItemCount ?? 2;
  const itemDefinitions = {
    1: [
      {
        description: "Cloud Infrastructure Services",
        detail: "Monthly cloud infrastructure services.",
        share: 100,
      },
    ],
    2: [
      {
        description: "Server Bandwidth",
        detail: "High-volume data transfer and network capacity fee.",
        share: 65,
      },
      {
        description: "Cloud Storage Maintenance",
        detail: "Monthly upkeep for secure application data hosting.",
        share: 35,
      },
    ],
    3: [
      {
        description: "Server Bandwidth",
        detail: "High-volume data transfer and network capacity fee.",
        share: 55,
      },
      {
        description: "Cloud Storage Maintenance",
        detail: "Monthly upkeep for secure application data hosting.",
        share: 30,
      },
      {
        description: "Infrastructure Management",
        detail: "Monitoring and maintenance of cloud services.",
        share: 15,
      },
    ],
  }[itemCount];
  const totalCents = Math.round(amountNum * 100);
  let allocatedCents = 0;
  const lineItems = itemDefinitions.map((item, index) => {
    const cents =
      index === itemDefinitions.length - 1
        ? totalCents - allocatedCents
        : Math.round((totalCents * item.share) / 100);
    allocatedCents += cents;
    const lineAmount = (cents / 100).toFixed(2);
    return {
      description: `${item.description}\n${item.detail}`,
      amount: `$${lineAmount}`,
    };
  });

  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(BRAND.issuer.name, 20, 20);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(BRAND.issuer.address, 20, 28);

  // "Invoice" wordmark + invoice number, top right
  doc.setFontSize(28);
  doc.setTextColor(40, 40, 40);
  doc.text("Invoice", 190, 22, { align: "right" });

  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text(`# ${id}`, 190, 29, { align: "right" });

  // Balance Due callout
  const paymentMade = isPaid ? amountNum : 0;
  const balanceDue = amountNum - paymentMade;
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(120, 120, 120);
  doc.text("Balance Due", 190, 40, { align: "right" });
  doc.setFontSize(13);
  doc.setTextColor(30, 30, 30);
  doc.text(`$${balanceDue.toFixed(2)}`, 190, 47, { align: "right" });

  // Meta rows (label right-aligned at 150, value right-aligned at 190)
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  let currentY = 62;
  const metaItems = [
    { label: "Invoice Date :", value: formatInvoiceDate(invoice.date) },
    { label: "Terms :", value: "Due on Receipt" },
    { label: "Due Date :", value: formatInvoiceDate(invoice.date) },
  ];
  metaItems.forEach((item) => {
    doc.setTextColor(120, 120, 120);
    doc.text(item.label, 150, currentY, { align: "right" });
    doc.setTextColor(40, 40, 40);
    doc.text(item.value, 190, currentY, { align: "right" });
    currentY += 7;
  });

  // Bill To block
  doc.setTextColor(120, 120, 120);
  doc.text("Bill To", 20, 62);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text(customerName || "Customer", 20, 69);

  autoTable(doc, {
    startY: 85,
    head: [["#", "Item & Description", "Qty", "Rate (USD)", "Amount (USD)"]],
    body: lineItems.map((item, index) => [
      String(index + 1),
      { content: item.description, styles: { fontStyle: "normal" } },
      "1.00",
      item.amount,
      item.amount,
    ]),
    theme: "plain",
    headStyles: {
      fillColor: [50, 50, 50],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
      cellPadding: 3,
    },
    bodyStyles: { textColor: [60, 60, 60], fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 90 },
      2: { cellWidth: 20, halign: "right" },
      3: { cellWidth: 25, halign: "right" },
      4: { cellWidth: 25, halign: "right" },
    },
    margin: { left: 20, right: 20 },
  });

  const tableEnd = (doc as any).lastAutoTable.finalY;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.2);
  doc.line(20, tableEnd + 2, 190, tableEnd + 2);

  let ty = tableEnd + 12;
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(40, 40, 40);
  doc.text("Total", 150, ty, { align: "right" });
  doc.text(`$${amountNum.toFixed(2)}`, 190, ty, { align: "right" });
  ty += 7;

  // Highlighted Balance Due row
  doc.setFillColor(243, 243, 243);
  doc.rect(120, ty - 1, 70, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  doc.text("Balance Due", 150, ty + 4.5, { align: "right" });
  doc.text(`$${balanceDue.toFixed(2)}`, 187, ty + 4.5, { align: "right" });

  // Footer: Notes + Payment Terms
  const footerY = ty + 30;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.text("Notes", 20, footerY);
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(
    isPaid ? "Thank you for your payment." : "Thank you for your business.",
    20,
    footerY + 6,
  );

  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.text("Terms & Conditions", 20, footerY + 20);
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(
    "This is a computer-generated invoice, no signature is required",
    20,
    footerY + 26,
  );

  doc.save(`V Pulse Invoice ${id}.pdf`);
}
