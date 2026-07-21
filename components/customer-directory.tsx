"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { createCustomer } from "@/app/actions/customers"
import { UserPlus, Search, Phone, Mail, ChevronRight, Users } from "lucide-react"

type Customer = {
  id: string
  customerCode: string
  name: string
  mobile: string
  email: string | null
  createdAt: Date
}

export function CustomerDirectory({ customers }: { customers: Customer[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    notes: "",
  })

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      c.mobile.toLowerCase().includes(q) ||
      c.customerCode.toLowerCase().includes(q)
    )
  })

  const handleCreate = async () => {
    setError("")
    if (!form.name.trim() || !form.mobile.trim()) {
      setError("Name and mobile number are required.")
      return
    }
    setSaving(true)
    try {
      const { id } = await createCustomer(form)
      setOpen(false)
      setForm({ name: "", mobile: "", email: "", address: "", notes: "" })
      router.push(`/dashboard/customers/${id}`)
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create customer")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, mobile, or customer ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-secondary border-border h-11"
          />
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gold text-background hover:bg-gold-light h-11">
              <UserPlus className="mr-2 h-4 w-4" />
              New Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">New Customer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <p className="text-sm text-muted-foreground">
                A unique Customer ID is generated automatically. Their folders and quotation
                history are created with the account.
              </p>
              <div>
                <Label>Customer Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 bg-secondary border-border"
                  placeholder="e.g. Ahmed Al-Thani"
                />
              </div>
              <div>
                <Label>Mobile Number *</Label>
                <Input
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  className="mt-1 bg-secondary border-border"
                  placeholder="e.g. 50256775"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 bg-secondary border-border"
                />
              </div>
              <div>
                <Label>Address</Label>
                <Textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="mt-1 bg-secondary border-border"
                  rows={2}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={saving}
                className="bg-gold text-background hover:bg-gold-light"
              >
                {saving ? "Creating..." : "Create Customer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {filtered.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-16 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {customers.length === 0
                ? "No customers yet. Add your first customer to get started."
                : "No customers match your search."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map((c) => (
            <Link key={c.id} href={`/dashboard/customers/${c.id}`}>
              <Card className="bg-card border-border hover:border-gold/50 transition-colors">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold font-serif text-lg font-bold">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-gold">{c.customerCode}</span>
                    </div>
                    <h3 className="font-medium text-foreground truncate">{c.name}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {c.mobile}
                      </span>
                      {c.email && (
                        <span className="flex items-center gap-1 truncate">
                          <Mail className="h-3 w-3" />
                          {c.email}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
