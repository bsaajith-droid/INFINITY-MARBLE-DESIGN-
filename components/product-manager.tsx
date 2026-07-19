"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { createProduct, deleteProduct, type ProductInput } from "@/app/actions/products"
import { generateProductDescription } from "@/app/actions/generate-description"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Upload, Trash2, Loader2, ImageIcon, Package, CheckCircle, Sparkles } from "lucide-react"

type Product = {
  id: string
  name: string
  category: string
  origin: string | null
  image: string
  price: string
  unit: string
  finish: string | null
  application: string | null
  description: string | null
  inStock: boolean
  stockQuantity: number
  featured: boolean
}

const CATEGORIES = [
  { id: "marble-vanity", name: "Marble Vanity" },
  { id: "porcelain-tile-vanity", name: "Porcelain Tile Vanity" },
]

const emptyForm: ProductInput = {
  name: "",
  category: "marble-vanity",
  origin: "",
  image: "",
  price: 0,
  unit: "piece",
  finish: "",
  application: "",
  description: "",
  inStock: true,
  stockQuantity: 1,
  featured: false,
}

export function ProductManager({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [form, setForm] = useState<ProductInput>(emptyForm)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [writing, setWriting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError("")
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Upload failed")
      setForm((f) => ({ ...f, image: data.url }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!form.name.trim()) {
      setError("Product name is required")
      return
    }
    if (!form.image) {
      setError("Please upload a product photo")
      return
    }

    setSaving(true)
    try {
      const { id } = await createProduct(form)
      setProducts((prev) => [
        {
          ...form,
          id,
          origin: form.origin || null,
          finish: form.finish || null,
          application: form.application || null,
          description: form.description || null,
          price: String(form.price),
        },
        ...prev,
      ])
      setForm(emptyForm)
      if (fileInputRef.current) fileInputRef.current.value = ""
      setSuccess("Product added successfully")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
    try {
      await deleteProduct(id)
    } catch {
      setError("Failed to delete product")
    }
  }

  const categoryName = (id: string) => CATEGORIES.find((c) => c.id === id)?.name ?? id

  const handleWriteWithAI = async () => {
    if (!form.name.trim()) {
      setError("Enter a product name first, then let AI write the description")
      return
    }
    setError("")
    setWriting(true)
    try {
      const description = await generateProductDescription({
        name: form.name,
        category: categoryName(form.category),
        origin: form.origin || undefined,
        finish: form.finish || undefined,
      })
      setForm((f) => ({ ...f, description }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate description")
    } finally {
      setWriting(false)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      {/* Upload Form */}
      <div className="lg:col-span-2">
        <Card className="bg-card border-border sticky top-24">
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              <Upload className="h-5 w-5 text-gold" />
              Add New Vanity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image upload */}
              <div>
                <Label className="mb-2 block">Product Photo</Label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-full aspect-video rounded-lg border-2 border-dashed border-border hover:border-gold/50 transition-colors flex items-center justify-center overflow-hidden bg-secondary/30"
                >
                  {form.image ? (
                    <Image
                      src={form.image || "/placeholder.svg"}
                      alt="Product preview"
                      fill
                      className="object-cover"
                    />
                  ) : uploading ? (
                    <Loader2 className="h-8 w-8 text-gold animate-spin" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <ImageIcon className="h-8 w-8" />
                      <span className="text-sm">Tap to upload photo</span>
                    </div>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <div>
                <Label htmlFor="name" className="mb-2 block">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Calacatta Marble Vanity 90cm"
                  className="bg-secondary/50 border-border"
                />
              </div>

              <div>
                <Label htmlFor="category" className="mb-2 block">Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm({ ...form, category: v })}
                >
                  <SelectTrigger id="category" className="bg-secondary/50 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="price" className="mb-2 block">Price (QAR)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={form.price || ""}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="bg-secondary/50 border-border"
                  />
                </div>
                <div>
                  <Label htmlFor="stock" className="mb-2 block">Stock Qty</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={form.stockQuantity || ""}
                    onChange={(e) => setForm({ ...form, stockQuantity: Number(e.target.value) })}
                    className="bg-secondary/50 border-border"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="origin" className="mb-2 block">Origin (optional)</Label>
                <Input
                  id="origin"
                  value={form.origin}
                  onChange={(e) => setForm({ ...form, origin: e.target.value })}
                  placeholder="e.g. Italy"
                  className="bg-secondary/50 border-border"
                />
              </div>

              <div>
                <Label htmlFor="finish" className="mb-2 block">Finish / Size (optional)</Label>
                <Input
                  id="finish"
                  value={form.finish}
                  onChange={(e) => setForm({ ...form, finish: e.target.value })}
                  placeholder="e.g. Polished, 90x50cm"
                  className="bg-secondary/50 border-border"
                />
              </div>

              <div>
                <Label htmlFor="description" className="mb-2 block">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Details about the vanity..."
                  rows={3}
                  className="bg-secondary/50 border-border resize-none"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Switch
                    id="instock"
                    checked={form.inStock}
                    onCheckedChange={(v) => setForm({ ...form, inStock: v })}
                  />
                  <Label htmlFor="instock">In Stock</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="featured"
                    checked={form.featured}
                    onCheckedChange={(v) => setForm({ ...form, featured: v })}
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              {success && (
                <p className="text-sm text-green-500 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" /> {success}
                </p>
              )}

              <Button
                type="submit"
                disabled={saving || uploading}
                className="w-full bg-gold text-background hover:bg-gold-light min-h-11"
              >
                {saving ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                ) : (
                  "Add Vanity"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Products List */}
      <div className="lg:col-span-3">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              <Package className="h-5 w-5 text-gold" />
              Your Vanities ({products.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Package className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p>No vanities uploaded yet.</p>
                <p className="text-sm">Add your first product using the form.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-lg border border-border overflow-hidden bg-secondary/30 group"
                  >
                    <div className="relative aspect-video">
                      <Image
                        src={p.image || "/placeholder.svg"}
                        alt={p.name}
                        fill
                        className="object-cover"
                      />
                      {p.featured && (
                        <span className="absolute top-2 left-2 text-xs bg-gold text-background px-2 py-0.5 rounded font-medium">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium leading-tight">{p.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {categoryName(p.category)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(p.id)}
                          className="text-muted-foreground hover:text-destructive h-8 w-8 shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-gold font-semibold">
                          QAR {Number(p.price).toLocaleString()}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          p.inStock ? "bg-green-500/20 text-green-400" : "bg-destructive/20 text-destructive"
                        }`}>
                          {p.inStock ? `${p.stockQuantity} in stock` : "Out of stock"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
