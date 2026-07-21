'use client'

import { useState } from 'react'
import { Plus, Printer, Trash2 } from 'lucide-react'

type LineItem = {
  id: number
  description: string
  size: string
  qty: string
  rate: string
}

const emptyItem = (id: number): LineItem => ({
  id,
  description: '',
  size: '',
  qty: '',
  rate: '',
})

function formatQar(n: number) {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function QuotationTemplate() {
  const today = new Date().toISOString().slice(0, 10)

  const [quoteNo, setQuoteNo] = useState('IMD-Q-0001')
  const [date, setDate] = useState(today)
  const [validity, setValidity] = useState('15 days')
  const [clientName, setClientName] = useState('')
  const [clientCompany, setClientCompany] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [clientAddress, setClientAddress] = useState('')
  const [subject, setSubject] = useState('')
  const [items, setItems] = useState<LineItem[]>([
    emptyItem(1),
    emptyItem(2),
    emptyItem(3),
  ])
  const [discount, setDiscount] = useState('')
  const [notes, setNotes] = useState(
    '1. Prices are in Qatari Riyals (QAR) and inclusive of material and installation unless stated otherwise.\n2. 50% advance payment upon confirmation, balance upon completion.\n3. Delivery period to be confirmed upon order confirmation.\n4. This quotation is valid for the period stated above.',
  )

  const updateItem = (id: number, field: keyof LineItem, value: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)),
    )
  }

  const addItem = () =>
    setItems((prev) => [
      ...prev,
      emptyItem(prev.length ? Math.max(...prev.map((i) => i.id)) + 1 : 1),
    ])

  const removeItem = (id: number) =>
    setItems((prev) => (prev.length > 1 ? prev.filter((i) => i.id !== id) : prev))

  const amountOf = (it: LineItem) =>
    (Number.parseFloat(it.qty) || 0) * (Number.parseFloat(it.rate) || 0)

  const subtotal = items.reduce((sum, it) => sum + amountOf(it), 0)
  const discountValue = Number.parseFloat(discount) || 0
  const grandTotal = Math.max(subtotal - discountValue, 0)

  return (
    <main className="flex min-h-screen flex-col items-center gap-4 py-8 print:py-0">
      {/* Toolbar */}
      <div className="no-print flex w-[210mm] max-w-full items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Infinity Marble Design logo"
            className="h-10 w-10 rounded-md object-cover"
          />
          <h1 className="font-serif text-xl font-semibold text-foreground">
            Quotation Editor
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground hover:bg-muted"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Item
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* A4 Sheet with letterhead background */}
      <div className="a4-sheet flex flex-col shadow-xl print:shadow-none">
        {/* Space reserved for the letterhead header */}
        <div className="h-[46mm] shrink-0" aria-hidden="true" />

        <div className="flex flex-1 flex-col px-[14mm] pb-[16mm] text-[10.5pt] leading-relaxed text-[#1a1a1a]">
          {/* Title */}
          <h2 className="text-center font-serif text-[20pt] font-bold tracking-[0.35em] text-[#a8862d]">
            QUOTATION
          </h2>
          <div className="mx-auto mt-1 h-[2px] w-[52mm] bg-[#a8862d]" />

          {/* Meta row */}
          <div className="mt-5 flex items-start justify-between gap-8">
            {/* Client */}
            <div className="flex-1">
              <p className="text-[8.5pt] font-semibold uppercase tracking-widest text-[#a8862d]">
                Quotation To
              </p>
              <div className="mt-1 flex flex-col gap-0.5">
                <input
                  className="doc-input font-semibold"
                  placeholder="Client Name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  aria-label="Client name"
                />
                <input
                  className="doc-input"
                  placeholder="Company / Project"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  aria-label="Client company or project"
                />
                <input
                  className="doc-input"
                  placeholder="Address"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  aria-label="Client address"
                />
                <input
                  className="doc-input"
                  placeholder="Phone"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  aria-label="Client phone"
                />
              </div>
            </div>

            {/* Quote details */}
            <div className="w-[62mm] shrink-0">
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="whitespace-nowrap py-0.5 pr-2 text-[8.5pt] font-semibold uppercase tracking-widest text-[#a8862d]">
                      Quote No.
                    </td>
                    <td>
                      <input
                        className="doc-input text-right"
                        value={quoteNo}
                        onChange={(e) => setQuoteNo(e.target.value)}
                        aria-label="Quotation number"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap py-0.5 pr-2 text-[8.5pt] font-semibold uppercase tracking-widest text-[#a8862d]">
                      Date
                    </td>
                    <td>
                      <input
                        type="date"
                        className="doc-input text-right"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        aria-label="Quotation date"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap py-0.5 pr-2 text-[8.5pt] font-semibold uppercase tracking-widest text-[#a8862d]">
                      Validity
                    </td>
                    <td>
                      <input
                        className="doc-input text-right"
                        value={validity}
                        onChange={(e) => setValidity(e.target.value)}
                        aria-label="Quotation validity"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Subject */}
          <div className="mt-4 flex items-baseline gap-2 border-b border-[#d9d2c4] pb-1">
            <span className="shrink-0 text-[8.5pt] font-semibold uppercase tracking-widest text-[#a8862d]">
              Subject
            </span>
            <input
              className="doc-input"
              placeholder="Supply and installation of marble works..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              aria-label="Quotation subject"
            />
          </div>

          {/* Items table */}
          <table className="mt-5 w-full border-collapse">
            <thead>
              <tr className="bg-[#1a1a1a] text-[8.5pt] uppercase tracking-wider text-white">
                <th className="w-[8mm] border border-[#1a1a1a] px-1.5 py-1.5 text-center font-semibold">
                  No.
                </th>
                <th className="border border-[#1a1a1a] px-2 py-1.5 text-left font-semibold">
                  Description
                </th>
                <th className="w-[24mm] border border-[#1a1a1a] px-1.5 py-1.5 text-center font-semibold">
                  Size / Unit
                </th>
                <th className="w-[14mm] border border-[#1a1a1a] px-1.5 py-1.5 text-center font-semibold">
                  Qty
                </th>
                <th className="w-[24mm] border border-[#1a1a1a] px-1.5 py-1.5 text-center font-semibold">
                  Rate (QAR)
                </th>
                <th className="w-[26mm] border border-[#1a1a1a] px-1.5 py-1.5 text-center font-semibold">
                  Amount (QAR)
                </th>
                <th className="no-print w-8" aria-hidden="true" />
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={it.id} className="align-top">
                  <td className="border border-[#c9c1b0] px-1.5 py-1 text-center">
                    {idx + 1}
                  </td>
                  <td className="border border-[#c9c1b0] px-2 py-1">
                    <input
                      className="doc-input"
                      placeholder="Item description"
                      value={it.description}
                      onChange={(e) =>
                        updateItem(it.id, 'description', e.target.value)
                      }
                      aria-label={`Item ${idx + 1} description`}
                    />
                  </td>
                  <td className="border border-[#c9c1b0] px-1.5 py-1">
                    <input
                      className="doc-input text-center"
                      placeholder="sqm"
                      value={it.size}
                      onChange={(e) => updateItem(it.id, 'size', e.target.value)}
                      aria-label={`Item ${idx + 1} size or unit`}
                    />
                  </td>
                  <td className="border border-[#c9c1b0] px-1.5 py-1">
                    <input
                      className="doc-input text-center"
                      placeholder="0"
                      inputMode="decimal"
                      value={it.qty}
                      onChange={(e) => updateItem(it.id, 'qty', e.target.value)}
                      aria-label={`Item ${idx + 1} quantity`}
                    />
                  </td>
                  <td className="border border-[#c9c1b0] px-1.5 py-1">
                    <input
                      className="doc-input text-right"
                      placeholder="0.00"
                      inputMode="decimal"
                      value={it.rate}
                      onChange={(e) => updateItem(it.id, 'rate', e.target.value)}
                      aria-label={`Item ${idx + 1} rate`}
                    />
                  </td>
                  <td className="border border-[#c9c1b0] px-2 py-1 text-right font-medium">
                    {amountOf(it) ? formatQar(amountOf(it)) : ''}
                  </td>
                  <td className="no-print pl-1">
                    <button
                      type="button"
                      onClick={() => removeItem(it.id)}
                      className="text-muted-foreground hover:text-red-600"
                      aria-label={`Remove item ${idx + 1}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="mt-3 flex justify-end">
            <table className="w-[72mm]">
              <tbody>
                <tr>
                  <td className="py-0.5 pr-3 text-right text-[9pt] font-semibold uppercase tracking-wider">
                    Subtotal
                  </td>
                  <td className="w-[30mm] border-b border-[#c9c1b0] py-0.5 text-right">
                    {formatQar(subtotal)}
                  </td>
                </tr>
                <tr>
                  <td className="py-0.5 pr-3 text-right text-[9pt] font-semibold uppercase tracking-wider">
                    Discount
                  </td>
                  <td className="w-[30mm] border-b border-[#c9c1b0] py-0.5">
                    <input
                      className="doc-input text-right"
                      placeholder="0.00"
                      inputMode="decimal"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      aria-label="Discount amount"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap py-1 pr-3 text-right text-[10pt] font-bold uppercase tracking-wider text-[#a8862d]">
                    Grand Total (QAR)
                  </td>
                  <td className="border-b-2 border-[#a8862d] py-1 text-right text-[11pt] font-bold">
                    {formatQar(grandTotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Terms */}
          <div className="mt-5">
            <p className="text-[8.5pt] font-semibold uppercase tracking-widest text-[#a8862d]">
              Terms &amp; Conditions
            </p>
            <textarea
              className="doc-input mt-1 min-h-[26mm] resize-none text-[9pt] leading-relaxed"
              rows={5}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              aria-label="Terms and conditions"
            />
          </div>

          {/* Signatures */}
          <div className="mt-auto flex items-end justify-between pt-8">
            <div className="w-[55mm] text-center">
              <div className="border-t border-[#1a1a1a] pt-1 text-[9pt] font-semibold">
                Prepared By
              </div>
              <p className="text-[8pt] text-[#6b6b6b]">
                Infinity Marble Design
              </p>
              <p className="text-[8pt] text-[#6b6b6b]">
                Mob / WhatsApp: +974 66625661
              </p>
            </div>
            <div className="w-[55mm] text-center">
              <div className="border-t border-[#1a1a1a] pt-1 text-[9pt] font-semibold">
                Approved By
              </div>
              <p className="text-[8pt] text-[#6b6b6b]">
                Client Signature &amp; Stamp
              </p>
            </div>
          </div>

          {/* Footer contact */}
          <p className="mt-4 text-center text-[8.5pt] font-medium tracking-wide text-[#a8862d]">
            {'For inquiries & orders, send directly on our Business WhatsApp: '}
            <a
              href="https://wa.me/97466625661"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline decoration-[#a8862d]/50 underline-offset-2"
            >
              +974 66625661
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
