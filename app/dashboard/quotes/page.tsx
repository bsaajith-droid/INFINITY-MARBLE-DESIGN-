"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useQuoteStore } from "@/lib/quote-store"
import {
  Trash2,
  Plus,
  Minus,
  FileText,
  Send,
  ArrowLeft,
  ShoppingCart,
} from "lucide-react"

export default function QuotesPage() {
  const { cartItems, quotes, removeFromCart, updateCartItem, clearCart, createQuote } =
    useQuoteStore()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    projectName: "",
    notes: "",
  })

  const cartTotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0)

  const handleCreateQuote = () => {
    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
      alert("Please fill in all required fields")
      return
    }
    const quote = createQuote(formData)
    setShowForm(false)
    setFormData({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      customerAddress: "",
      projectName: "",
      notes: "",
    })
    alert(`Quote ${quote.id} created successfully!`)
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

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-20 lg:pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold mb-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
              <h1 className="font-serif text-3xl font-bold">Quotations</h1>
            </div>
            <Button asChild className="bg-gold text-background hover:bg-gold-light">
              <Link href="/materials">
                <Plus className="mr-2 h-4 w-4" />
                Add Materials
              </Link>
            </Button>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart */}
            <div className="lg:col-span-2">
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-serif flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-gold" />
                    Quote Cart
                  </CardTitle>
                  {cartItems.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearCart}
                      className="text-destructive hover:text-destructive"
                    >
                      Clear All
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {cartItems.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Your quote cart is empty</p>
                      <Button asChild className="mt-4 bg-gold text-background hover:bg-gold-light">
                        <Link href="/materials">Browse Materials</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div
                          key={`${item.material.id}-${item.thickness}-${item.finish}`}
                          className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-secondary/50 rounded-lg"
                        >
                          <div className="flex-1">
                            <h3 className="font-medium text-foreground">{item.material.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {item.thickness} | {item.finish}
                            </p>
                            <p className="text-sm text-gold">
                              QAR {item.material.price.toLocaleString()}/sqm
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 bg-transparent"
                                onClick={() =>
                                  updateCartItem(item.material.id, {
                                    quantity: Math.max(1, item.quantity - 1),
                                  })
                                }
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-12 text-center">{item.quantity} sqm</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 bg-transparent"
                                onClick={() =>
                                  updateCartItem(item.material.id, {
                                    quantity: item.quantity + 1,
                                  })
                                }
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <span className="w-24 text-right font-medium text-gold">
                              QAR {item.subtotal.toLocaleString()}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => removeFromCart(item.material.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      <div className="flex justify-between items-center pt-4 border-t border-border">
                        <span className="text-lg font-medium">Total</span>
                        <span className="text-2xl font-bold text-gold">
                          QAR {cartTotal.toLocaleString()}
                        </span>
                      </div>

                      <Button
                        className="w-full bg-gold text-background hover:bg-gold-light mt-4"
                        onClick={() => setShowForm(true)}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Create Quotation
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Customer Form */}
              {showForm && (
                <Card className="bg-card border-border mt-6">
                  <CardHeader>
                    <CardTitle className="font-serif">Customer Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label>Customer Name *</Label>
                        <Input
                          value={formData.customerName}
                          onChange={(e) =>
                            setFormData({ ...formData, customerName: e.target.value })
                          }
                          className="mt-1 bg-secondary border-border"
                        />
                      </div>
                      <div>
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          value={formData.customerEmail}
                          onChange={(e) =>
                            setFormData({ ...formData, customerEmail: e.target.value })
                          }
                          className="mt-1 bg-secondary border-border"
                        />
                      </div>
                      <div>
                        <Label>Phone *</Label>
                        <Input
                          value={formData.customerPhone}
                          onChange={(e) =>
                            setFormData({ ...formData, customerPhone: e.target.value })
                          }
                          className="mt-1 bg-secondary border-border"
                        />
                      </div>
                      <div>
                        <Label>Project Name</Label>
                        <Input
                          value={formData.projectName}
                          onChange={(e) =>
                            setFormData({ ...formData, projectName: e.target.value })
                          }
                          className="mt-1 bg-secondary border-border"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Address</Label>
                      <Textarea
                        value={formData.customerAddress}
                        onChange={(e) =>
                          setFormData({ ...formData, customerAddress: e.target.value })
                        }
                        className="mt-1 bg-secondary border-border"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>Notes</Label>
                      <Textarea
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                        className="mt-1 bg-secondary border-border"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowForm(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateQuote}
                        className="flex-1 bg-gold text-background hover:bg-gold-light"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Create Quote
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Recent Quotes */}
            <div>
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="font-serif">Recent Quotations</CardTitle>
                </CardHeader>
                <CardContent>
                  {quotes.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No quotations yet</p>
                  ) : (
                    <div className="space-y-4">
                      {quotes.slice(-5).reverse().map((quote) => (
                        <Link
                          key={quote.id}
                          href={`/dashboard/quotes/${quote.id}`}
                          className="block p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-sm text-gold">{quote.id}</span>
                            <Badge className={getStatusColor(quote.status)}>
                              {quote.status}
                            </Badge>
                          </div>
                          <p className="font-medium text-foreground">{quote.customerName}</p>
                          <p className="text-sm text-muted-foreground">{quote.projectName || "No project name"}</p>
                          <p className="text-gold font-medium mt-2">
                            QAR {quote.total.toLocaleString()}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
