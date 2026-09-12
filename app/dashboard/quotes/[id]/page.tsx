"use client"

import { use } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useQuoteStore } from "@/lib/quote-store"
import {
  ArrowLeft,
  Download,
  Send,
  Check,
  X,
  FileText,
  Phone,
  Mail,
  MapPin,
  Calendar,
} from "lucide-react"

export default function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const { getQuoteById, updateQuoteStatus, createInvoiceFromQuote } = useQuoteStore()
  const quote = getQuoteById(resolvedParams.id)

  if (!quote) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-muted text-muted-foreground"
      case "sent":
        return "bg-blue-500/20 text-blue-400"
      case "accepted":
        return "bg-green-500/20 text-green-400"
      case "rejected":
        return "bg-destructive/20 text-destructive"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const handleConvertToInvoice = () => {
    const invoice = createInvoiceFromQuote(quote.id)
    alert(`Invoice ${invoice.id} created successfully!`)
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-20 lg:pt-24 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <Link
                href="/dashboard/quotes"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold mb-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Quotations
              </Link>
              <div className="flex items-center gap-4">
                <h1 className="font-serif text-3xl font-bold">{quote.id}</h1>
                <Badge className={getStatusColor(quote.status)}>{quote.status}</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-border bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              {quote.status === "draft" && (
                <Button
                  onClick={() => updateQuoteStatus(quote.id, "sent")}
                  className="bg-gold text-background hover:bg-gold-light"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Quote
                </Button>
              )}
            </div>
          </div>

          {/* Quote Document */}
          <Card className="bg-card border-border">
            <CardContent className="p-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between gap-6 pb-8 border-b border-border">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-gold">INFINITY</h2>
                  <p className="text-xs tracking-[0.3em] text-muted-foreground">MARBLE DESIGN</p>
                  <div className="mt-4 space-y-1 text-sm text-muted-foreground">
                    <p>Doha, Qatar</p>
                    <p>+974 5025 6775</p>
                    <p>infinitymarbledesign@gmail.com</p>
                  </div>
                </div>
                <div className="text-right">
                  <h3 className="text-2xl font-bold text-foreground">QUOTATION</h3>
                  <p className="text-gold font-mono mt-2">{quote.id}</p>
                  <div className="mt-4 space-y-1 text-sm text-muted-foreground">
                    <p className="flex items-center justify-end gap-2">
                      <Calendar className="h-4 w-4" />
                      Created: {new Date(quote.createdAt).toLocaleDateString()}
                    </p>
                    <p className="flex items-center justify-end gap-2">
                      <Calendar className="h-4 w-4" />
                      Valid Until: {new Date(quote.validUntil).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="py-8 border-b border-border">
                <h4 className="text-sm font-medium text-muted-foreground mb-4">BILL TO</h4>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-foreground">{quote.customerName}</p>
                  {quote.projectName && (
                    <p className="text-muted-foreground">Project: {quote.projectName}</p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gold" />
                      {quote.customerPhone}
                    </span>
                    <span className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gold" />
                      {quote.customerEmail}
                    </span>
                  </div>
                  {quote.customerAddress && (
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-gold" />
                      {quote.customerAddress}
                    </p>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <div className="py-8">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-muted-foreground border-b border-border">
                      <th className="pb-4">Item</th>
                      <th className="pb-4">Specifications</th>
                      <th className="pb-4 text-right">Qty</th>
                      <th className="pb-4 text-right">Unit Price</th>
                      <th className="pb-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quote.items.map((item, index) => (
                      <tr key={index} className="border-b border-border/50">
                        <td className="py-4">
                          <p className="font-medium text-foreground">{item.material.name}</p>
                          <p className="text-sm text-muted-foreground">{item.material.category}</p>
                        </td>
                        <td className="py-4 text-sm text-muted-foreground">
                          {item.thickness} | {item.finish}
                        </td>
                        <td className="py-4 text-right">{item.quantity} sqm</td>
                        <td className="py-4 text-right">
                          QAR {item.material.price.toLocaleString()}
                        </td>
                        <td className="py-4 text-right font-medium text-gold">
                          QAR {item.subtotal.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-full max-w-xs space-y-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>QAR {quote.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>VAT (0%)</span>
                    <span>QAR {quote.vat.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold border-t border-border pt-3">
                    <span>Total</span>
                    <span className="text-gold">QAR {quote.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {quote.notes && (
                <div className="mt-8 pt-8 border-t border-border">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">NOTES</h4>
                  <p className="text-sm text-muted-foreground">{quote.notes}</p>
                </div>
              )}

              {/* Terms */}
              <div className="mt-8 pt-8 border-t border-border">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">TERMS & CONDITIONS</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>- This quotation is valid for 30 days from the date of issue.</li>
                  <li>- 50% advance payment required to confirm the order.</li>
                  <li>- Delivery within 2-4 weeks depending on availability.</li>
                  <li>- Prices are subject to change based on market conditions.</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {quote.status === "sent" && (
            <Card className="bg-card border-border mt-6">
              <CardContent className="p-6">
                <h3 className="font-serif text-lg font-semibold mb-4">Quote Actions</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => updateQuoteStatus(quote.id, "accepted")}
                    className="flex-1 bg-green-600 text-white hover:bg-green-700"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Mark as Accepted
                  </Button>
                  <Button
                    onClick={() => updateQuoteStatus(quote.id, "rejected")}
                    variant="outline"
                    className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Mark as Rejected
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {quote.status === "accepted" && (
            <Card className="bg-card border-border mt-6">
              <CardContent className="p-6">
                <Button
                  onClick={handleConvertToInvoice}
                  className="w-full bg-gold text-background hover:bg-gold-light"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Convert to Invoice
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
