"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  createQuotation,
  updateQuotationStatus,
  deleteQuotation,
  addDocument,
  deleteDocument,
  type QuotationItemInput,
} from "@/app/actions/customers"
import { DOCUMENT_TYPES, QUOTATION_STATUSES, EXPIRY_WARNING_DAYS } from "@/lib/customer-constants"
import {
  Phone,
  Mail,
  MapPin,
  Plus,
  Trash2,
  FileText,
  Upload,
  Download,
  FileIcon,
  Receipt,
  AlertTriangle,
} from "lucide-react"

type Customer = {
  id: string
  customerCode: string
  name: string
  mobile: string
  email: string | null
  address: string | null
  notes: string | null
}

type Quotation = {
  id: string
  quotationCode: string
  projectName: string | null
  items: unknown
  total: string
  status: string
  createdAt: Date
  validUntil: Date | null
}

type Document = {
  id: string
  folder: string
  fileName: string
  fileUrl: string
  fileSize: number
  createdAt: Date
}

/** Returns days until expiry (negative if already expired), or null if no date */
function daysUntil(date: Date | null): number | null {
  if (!date) return null
  const ms = new Date(date).getTime() - Date.now()
  return Math.ceil(ms / (1000 * 60 * 60 * 24))
}

/** Quotations that are unpaid and expiring soon or already expired */
function getExpiringQuotations(quotations: Quotation[]) {
  return quotations
    .filter((q) => q.status !== "paid" && q.status !== "cancelled")
    .map((q) => ({ q, days: daysUntil(q.validUntil) }))
    .filter((x) => x.days !== null && x.days <= EXPIRY_WARNING_DAYS)
    .sort((a, b) => (a.days ?? 0) - (b.days ?? 0))
}

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-blue-500/20 text-blue-400",
  accepted: "bg-green-500/20 text-green-400",
  paid: "bg-gold/20 text-gold",
  cancelled: "bg-destructive/20 text-destructive",
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

export function CustomerDetail({
  customer,
  quotations,
  documents,
}: {
  customer: Customer
  quotations: Quotation[]
  documents: Document[]
}) {
  const router = useRouter()
  const expiring = getExpiringQuotations(quotations)

  return (
    <div className="space-y-6">
      {/* Expiry / payment-due notifications */}
      {expiring.length > 0 && (
        <div className="rounded-lg border border-gold/40 bg-gold/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-gold mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-gold">Payment reminder</p>
              <ul className="mt-2 space-y-1 text-sm text-foreground">
                {expiring.map(({ q, days }) => (
                  <li key={q.id} className="flex flex-wrap items-center gap-x-2">
                    <span className="font-mono text-gold">{q.quotationCode}</span>
                    <span className="text-muted-foreground">
                      {q.projectName || "Untitled project"}
                    </span>
                    <span className="font-medium">
                      QAR {Number(q.total).toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">—</span>
                    <span className={days !== null && days < 0 ? "text-destructive" : "text-gold"}>
                      {days !== null && days < 0
                        ? `expired ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago, still unpaid`
                        : days === 0
                          ? "expires today, payment not received"
                          : `expires in ${days} day${days === 1 ? "" : "s"}, payment not received`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Customer header */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold font-serif text-2xl font-bold">
              {customer.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <span className="font-mono text-sm text-gold">{customer.customerCode}</span>
              <h1 className="font-serif text-2xl font-bold">{customer.name}</h1>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground mt-2">
                <span className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4" />
                  {customer.mobile}
                </span>
                {customer.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4" />
                    {customer.email}
                  </span>
                )}
                {customer.address && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {customer.address}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="quotations">
        <TabsList className="bg-secondary">
          <TabsTrigger value="quotations">
            <Receipt className="mr-2 h-4 w-4" />
            Quotations ({quotations.length})
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="mr-2 h-4 w-4" />
            Documents ({documents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quotations" className="mt-6">
          <QuotationsTab
            customerId={customer.id}
            quotations={quotations}
            onChange={() => router.refresh()}
          />
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <DocumentsTab
            customerId={customer.id}
            documents={documents}
            onChange={() => router.refresh()}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ---------------- Quotations Tab ----------------

function QuotationsTab({
  customerId,
  quotations,
  onChange,
}: {
  customerId: string
  quotations: Quotation[]
  onChange: () => void
}) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [notes, setNotes] = useState("")
  const [items, setItems] = useState<QuotationItemInput[]>([
    { name: "", quantity: 1, unitPrice: 0 },
  ])

  const total = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)

  const updateItem = (index: number, updates: Partial<QuotationItemInput>) => {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...updates } : it)))
  }

  const handleCreate = async () => {
    setSaving(true)
    try {
      await createQuotation({ customerId, projectName, notes, items })
      setOpen(false)
      setProjectName("")
      setNotes("")
      setItems([{ name: "", quantity: 1, unitPrice: 0 }])
      onChange()
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to create quotation")
    } finally {
      setSaving(false)
    }
  }

  const handleStatus = async (id: string, status: string) => {
    await updateQuotationStatus(id, customerId, status)
    onChange()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this quotation?")) return
    await deleteQuotation(id, customerId)
    onChange()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Each new project gets a fresh quotation number under the same Customer ID.
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gold text-background hover:bg-gold-light">
              <Plus className="mr-2 h-4 w-4" />
              New Quotation
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">New Quotation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label>Project Name</Label>
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="mt-1 bg-secondary border-border"
                  placeholder="e.g. Villa Flooring - West Bay"
                />
              </div>

              <div className="space-y-3">
                <Label>Line Items</Label>
                {items.map((item, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <Input
                      placeholder="Description"
                      value={item.name}
                      onChange={(e) => updateItem(index, { name: e.target.value })}
                      className="bg-secondary border-border flex-1"
                    />
                    <Input
                      type="number"
                      min={0}
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, { quantity: Number(e.target.value) || 0 })
                      }
                      className="bg-secondary border-border w-20"
                    />
                    <Input
                      type="number"
                      min={0}
                      placeholder="Unit QAR"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(index, { unitPrice: Number(e.target.value) || 0 })
                      }
                      className="bg-secondary border-border w-28"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive shrink-0"
                      onClick={() => setItems(items.filter((_, i) => i !== index))}
                      disabled={items.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setItems([...items, { name: "", quantity: 1, unitPrice: 0 }])}
                  className="bg-transparent"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 bg-secondary border-border"
                  rows={2}
                />
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-border">
                <span className="font-medium">Total</span>
                <span className="text-xl font-bold text-gold">
                  QAR {total.toLocaleString()}
                </span>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)} className="bg-transparent">
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={saving}
                className="bg-gold text-background hover:bg-gold-light"
              >
                {saving ? "Creating..." : "Create Quotation"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {quotations.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-12 text-center">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No quotations for this customer yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {quotations.map((q) => (
            <Card key={q.id} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-gold">{q.quotationCode}</span>
                      <Badge className={statusColors[q.status] ?? statusColors.draft}>
                        {q.status === "paid" ? "PAID" : q.status}
                      </Badge>
                    </div>
                    <p className="font-medium text-foreground mt-1">
                      {q.projectName || "Untitled project"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(q.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gold">
                      QAR {Number(q.total).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={q.status} onValueChange={(v) => handleStatus(q.id, v)}>
                      <SelectTrigger className="w-32 bg-secondary border-border h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {QUOTATION_STATUSES.map((s) => (
                          <SelectItem key={s.key} value={s.key}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(q.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------- Documents Tab ----------------

function DocumentsTab({
  customerId,
  documents,
  onChange,
}: {
  customerId: string
  documents: Document[]
  onChange: () => void
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {DOCUMENT_TYPES.map((type) => (
        <DocumentTypeCard
          key={type.key}
          customerId={customerId}
          typeKey={type.key}
          label={type.label}
          documents={documents.filter((d) => d.folder === type.key)}
          onChange={onChange}
        />
      ))}
    </div>
  )
}

function DocumentTypeCard({
  customerId,
  typeKey,
  label,
  documents,
  onChange,
}: {
  customerId: string
  typeKey: string
  label: string
  documents: Document[]
  onChange: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      if (!res.ok) throw new Error("Upload failed")
      const { url } = await res.json()
      await addDocument({
        customerId,
        folder: typeKey,
        fileName: file.name,
        fileUrl: url,
        fileSize: file.size,
        contentType: file.type,
      })
      onChange()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this file?")) return
    await deleteDocument(id, customerId)
    onChange()
  }

  const TypeIcon = typeKey === "invoice" ? Receipt : FileText

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="font-serif text-base flex items-center gap-2">
          <TypeIcon className="h-4 w-4 text-gold" />
          {label}
          <span className="text-xs text-muted-foreground font-sans font-normal">
            ({documents.length})
          </span>
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          className="bg-transparent h-8"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="mr-1.5 h-3.5 w-3.5" />
          {uploading ? "..." : "Upload"}
        </Button>
        <input ref={inputRef} type="file" className="hidden" onChange={handleUpload} />
      </CardHeader>
      <CardContent className="pt-0">
        {documents.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No {label.toLowerCase()} documents yet
          </p>
        ) : (
          <ul className="space-y-2">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="flex items-center gap-2 rounded-md bg-secondary/50 p-2"
              >
                <FileIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm truncate">{doc.fileName}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(doc.fileSize)}</p>
                </div>
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="text-muted-foreground hover:text-gold p-1"
                  aria-label={`Download ${doc.fileName}`}
                >
                  <Download className="h-4 w-4" />
                </a>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="text-muted-foreground hover:text-destructive p-1"
                  aria-label={`Delete ${doc.fileName}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
