"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useQuoteStore } from "@/lib/quote-store"
import {
  ArrowLeft,
  FileText,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

export default function InvoicesPage() {
  const { invoices, updateInvoiceStatus } = useQuoteStore()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400"
      case "paid":
        return "bg-green-500/20 text-green-400"
      case "overdue":
        return "bg-destructive/20 text-destructive"
      case "cancelled":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return Clock
      case "paid":
        return CheckCircle
      case "overdue":
        return AlertCircle
      default:
        return FileText
    }
  }

  const pendingTotal = invoices
    .filter((inv) => inv.status === "pending")
    .reduce((sum, inv) => sum + inv.total, 0)

  const paidTotal = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.total, 0)

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-20 lg:pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="font-serif text-3xl font-bold">Invoices</h1>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Invoices</p>
                    <p className="text-2xl font-bold text-foreground">{invoices.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Payment</p>
                    <p className="text-2xl font-bold text-foreground">
                      QAR {pendingTotal.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Paid</p>
                    <p className="text-2xl font-bold text-foreground">
                      QAR {paidTotal.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invoices List */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-serif">All Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No invoices yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Create invoices from accepted quotations
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-muted-foreground border-b border-border">
                        <th className="pb-4 font-medium">Invoice</th>
                        <th className="pb-4 font-medium">Customer</th>
                        <th className="pb-4 font-medium">Project</th>
                        <th className="pb-4 font-medium">Amount</th>
                        <th className="pb-4 font-medium">Due Date</th>
                        <th className="pb-4 font-medium">Status</th>
                        <th className="pb-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice) => {
                        const StatusIcon = getStatusIcon(invoice.status)
                        return (
                          <tr key={invoice.id} className="border-b border-border/50">
                            <td className="py-4">
                              <span className="font-mono text-gold">{invoice.id}</span>
                            </td>
                            <td className="py-4">
                              <p className="font-medium text-foreground">{invoice.customerName}</p>
                              <p className="text-sm text-muted-foreground">{invoice.customerEmail}</p>
                            </td>
                            <td className="py-4 text-muted-foreground">
                              {invoice.projectName || "-"}
                            </td>
                            <td className="py-4 font-medium text-gold">
                              QAR {invoice.total.toLocaleString()}
                            </td>
                            <td className="py-4 text-muted-foreground">
                              {new Date(invoice.dueDate).toLocaleDateString()}
                            </td>
                            <td className="py-4">
                              <Badge className={getStatusColor(invoice.status)}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {invoice.status}
                              </Badge>
                            </td>
                            <td className="py-4">
                              {invoice.status === "pending" && (
                                <Button
                                  size="sm"
                                  onClick={() => updateInvoiceStatus(invoice.id, "paid")}
                                  className="bg-green-600 text-white hover:bg-green-700"
                                >
                                  Mark Paid
                                </Button>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  )
}
