"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { materials, categories } from "@/lib/materials-data"
import {
  ArrowLeft,
  Search,
  Package,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  Warehouse,
  Filter,
} from "lucide-react"

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all")

  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      const matchesSearch =
        material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.origin.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory =
        categoryFilter === "all" || material.category === categoryFilter
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "low" && material.stockQuantity > 0 && material.stockQuantity < 100) ||
        (stockFilter === "out" && material.stockQuantity === 0)
      return matchesSearch && matchesCategory && matchesStock
    })
  }, [searchQuery, categoryFilter, stockFilter])

  // Calculate stats
  const totalInventoryValue = materials.reduce(
    (sum, m) => sum + m.price * m.stockQuantity,
    0
  )
  const totalQuantity = materials.reduce((sum, m) => sum + m.stockQuantity, 0)
  const lowStockItems = materials.filter((m) => m.stockQuantity > 0 && m.stockQuantity < 100).length
  const outOfStockItems = materials.filter((m) => m.stockQuantity === 0).length

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: "Out of Stock", color: "bg-destructive/20 text-destructive" }
    if (quantity < 100) return { label: "Low Stock", color: "bg-yellow-500/20 text-yellow-400" }
    return { label: "In Stock", color: "bg-green-500/20 text-green-400" }
  }

  const getStockLevel = (quantity: number, maxExpected: number = 500) => {
    return Math.min((quantity / maxExpected) * 100, 100)
  }

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
            <h1 className="font-serif text-3xl font-bold">Inventory Management</h1>
            <p className="text-muted-foreground mt-1">Track and manage your material stock levels</p>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center">
                    <Warehouse className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Stock</p>
                    <p className="text-xl font-bold">{totalQuantity.toLocaleString()} sqm</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Inventory Value</p>
                    <p className="text-xl font-bold">QAR {(totalInventoryValue / 1000000).toFixed(1)}M</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Low Stock Items</p>
                    <p className="text-xl font-bold">{lowStockItems}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <TrendingDown className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Out of Stock</p>
                    <p className="text-xl font-bold">{outOfStockItems}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-card border-border mb-8">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search materials..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-secondary border-border"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat.id}
                      variant={categoryFilter === cat.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCategoryFilter(cat.id)}
                      className={
                        categoryFilter === cat.id
                          ? "bg-gold text-background hover:bg-gold-light"
                          : "border-border hover:border-gold"
                      }
                    >
                      {cat.name}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={stockFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStockFilter("all")}
                    className={
                      stockFilter === "all"
                        ? "bg-gold text-background hover:bg-gold-light"
                        : "border-border hover:border-gold"
                    }
                  >
                    All
                  </Button>
                  <Button
                    variant={stockFilter === "low" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStockFilter("low")}
                    className={
                      stockFilter === "low"
                        ? "bg-yellow-500 text-background hover:bg-yellow-600"
                        : "border-border hover:border-yellow-500"
                    }
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Low Stock
                  </Button>
                  <Button
                    variant={stockFilter === "out" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStockFilter("out")}
                    className={
                      stockFilter === "out"
                        ? "bg-destructive text-white hover:bg-destructive/90"
                        : "border-border hover:border-destructive"
                    }
                  >
                    Out of Stock
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Table */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-serif">
                Inventory ({filteredMaterials.length} items)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-muted-foreground border-b border-border">
                      <th className="pb-4 font-medium">Material</th>
                      <th className="pb-4 font-medium">Category</th>
                      <th className="pb-4 font-medium">Origin</th>
                      <th className="pb-4 font-medium">Unit Price</th>
                      <th className="pb-4 font-medium">Stock Level</th>
                      <th className="pb-4 font-medium">Quantity</th>
                      <th className="pb-4 font-medium">Value</th>
                      <th className="pb-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMaterials.map((material) => {
                      const status = getStockStatus(material.stockQuantity)
                      const stockLevel = getStockLevel(material.stockQuantity)
                      const value = material.price * material.stockQuantity

                      return (
                        <tr key={material.id} className="border-b border-border/50 hover:bg-secondary/30">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative h-10 w-10 rounded overflow-hidden bg-secondary">
                                <Image
                                  src={material.image || "/placeholder.svg"}
                                  alt={material.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <Link href={`/materials/${material.id}`} className="font-medium text-foreground hover:text-gold">
                                {material.name}
                              </Link>
                            </div>
                          </td>
                          <td className="py-4">
                            <Badge variant="outline" className="border-gold/50 text-gold">
                              {material.category}
                            </Badge>
                          </td>
                          <td className="py-4 text-muted-foreground">{material.origin}</td>
                          <td className="py-4 text-gold">QAR {material.price.toLocaleString()}</td>
                          <td className="py-4">
                            <div className="w-24">
                              <Progress
                                value={stockLevel}
                                className={`h-2 ${
                                  material.stockQuantity === 0
                                    ? "[&>div]:bg-destructive"
                                    : material.stockQuantity < 100
                                    ? "[&>div]:bg-yellow-500"
                                    : "[&>div]:bg-green-500"
                                }`}
                              />
                            </div>
                          </td>
                          <td className="py-4 font-medium">{material.stockQuantity.toLocaleString()} sqm</td>
                          <td className="py-4 text-gold">QAR {value.toLocaleString()}</td>
                          <td className="py-4">
                            <Badge className={status.color}>{status.label}</Badge>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {filteredMaterials.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No materials found</p>
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
