import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Material } from "./materials-data"

export type QuoteItem = {
  material: Material
  quantity: number
  thickness: string
  finish: string
  subtotal: number
}

export type Quote = {
  id: string
  items: QuoteItem[]
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  projectName: string
  notes: string
  status: "draft" | "sent" | "accepted" | "rejected"
  createdAt: Date
  validUntil: Date
  subtotal: number
  vat: number
  total: number
}

export type Invoice = {
  id: string
  quoteId?: string
  items: QuoteItem[]
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  projectName: string
  status: "pending" | "paid" | "overdue" | "cancelled"
  createdAt: Date
  dueDate: Date
  subtotal: number
  vat: number
  total: number
  paidAt?: Date
}

type QuoteStore = {
  cartItems: QuoteItem[]
  quotes: Quote[]
  invoices: Invoice[]
  addToCart: (item: QuoteItem) => void
  removeFromCart: (materialId: string) => void
  updateCartItem: (materialId: string, updates: Partial<QuoteItem>) => void
  clearCart: () => void
  createQuote: (customerDetails: Omit<Quote, "id" | "items" | "status" | "createdAt" | "validUntil" | "subtotal" | "vat" | "total">) => Quote
  updateQuoteStatus: (quoteId: string, status: Quote["status"]) => void
  createInvoiceFromQuote: (quoteId: string) => Invoice
  updateInvoiceStatus: (invoiceId: string, status: Invoice["status"]) => void
  getQuoteById: (id: string) => Quote | undefined
  getInvoiceById: (id: string) => Invoice | undefined
}

const VAT_RATE = 0 // Qatar has no VAT, but keeping for future use

function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `${prefix}-${timestamp}-${random}`.toUpperCase()
}

function calculateTotals(items: QuoteItem[]) {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
  const vat = subtotal * VAT_RATE
  const total = subtotal + vat
  return { subtotal, vat, total }
}

export const useQuoteStore = create<QuoteStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      quotes: [],
      invoices: [],

      addToCart: (item) => {
        set((state) => {
          const existingIndex = state.cartItems.findIndex(
            (i) =>
              i.material.id === item.material.id &&
              i.thickness === item.thickness &&
              i.finish === item.finish
          )
          if (existingIndex >= 0) {
            const newItems = [...state.cartItems]
            newItems[existingIndex].quantity += item.quantity
            newItems[existingIndex].subtotal =
              newItems[existingIndex].quantity * newItems[existingIndex].material.price
            return { cartItems: newItems }
          }
          return { cartItems: [...state.cartItems, item] }
        })
      },

      removeFromCart: (materialId) => {
        set((state) => ({
          cartItems: state.cartItems.filter((i) => i.material.id !== materialId),
        }))
      },

      updateCartItem: (materialId, updates) => {
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.material.id === materialId
              ? {
                  ...item,
                  ...updates,
                  subtotal: (updates.quantity ?? item.quantity) * item.material.price,
                }
              : item
          ),
        }))
      },

      clearCart: () => set({ cartItems: [] }),

      createQuote: (customerDetails) => {
        const items = get().cartItems
        const totals = calculateTotals(items)
        const quote: Quote = {
          id: generateId("QT"),
          items: [...items],
          ...customerDetails,
          status: "draft",
          createdAt: new Date(),
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days validity
          ...totals,
        }
        set((state) => ({ quotes: [...state.quotes, quote], cartItems: [] }))
        return quote
      },

      updateQuoteStatus: (quoteId, status) => {
        set((state) => ({
          quotes: state.quotes.map((q) => (q.id === quoteId ? { ...q, status } : q)),
        }))
      },

      createInvoiceFromQuote: (quoteId) => {
        const quote = get().quotes.find((q) => q.id === quoteId)
        if (!quote) throw new Error("Quote not found")

        const invoice: Invoice = {
          id: generateId("INV"),
          quoteId: quote.id,
          items: quote.items,
          customerName: quote.customerName,
          customerEmail: quote.customerEmail,
          customerPhone: quote.customerPhone,
          customerAddress: quote.customerAddress,
          projectName: quote.projectName,
          status: "pending",
          createdAt: new Date(),
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days due
          subtotal: quote.subtotal,
          vat: quote.vat,
          total: quote.total,
        }
        set((state) => ({
          invoices: [...state.invoices, invoice],
          quotes: state.quotes.map((q) =>
            q.id === quoteId ? { ...q, status: "accepted" as const } : q
          ),
        }))
        return invoice
      },

      updateInvoiceStatus: (invoiceId, status) => {
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === invoiceId
              ? { ...inv, status, paidAt: status === "paid" ? new Date() : inv.paidAt }
              : inv
          ),
        }))
      },

      getQuoteById: (id) => get().quotes.find((q) => q.id === id),

      getInvoiceById: (id) => get().invoices.find((inv) => inv.id === id),
    }),
    {
      name: "infinity-marble-quotes",
    }
  )
)
