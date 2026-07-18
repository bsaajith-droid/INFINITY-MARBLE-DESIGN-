"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { materials, categories } from "@/lib/materials-data"
import { Search, Filter, Grid3X3, List, Check, X } from "lucide-react"

export default function MaterialsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      const matchesSearch =
        material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory =
        selectedCategory === "all" || material.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-20 lg:pt-24">
        {/* Hero */}
        <section className="py-12 lg:py-20 bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="text-sm font-medium text-gold tracking-wider uppercase">
                Our Collection
              </span>
              <h1 className="mt-2 font-serif text-4xl sm:text-5xl lg:text-6xl font-bold">
                Premium Materials
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground text-lg">
                Explore our extensive collection of marble, granite, porcelain tiles, and exotic stones from around the world.
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b border-border sticky top-16 lg:top-20 bg-background/95 backdrop-blur-sm z-40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary border-border min-h-[44px]"
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={
                      selectedCategory === category.id
                        ? "bg-gold text-background hover:bg-gold-light"
                        : "border-border text-foreground hover:border-gold hover:text-gold"
                    }
                  >
                    {category.name}
                  </Button>
                ))}
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "text-gold" : "text-muted-foreground"}
                >
                  <Grid3X3 className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "text-gold" : "text-muted-foreground"}
                >
                  <List className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Materials Grid/List */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-muted-foreground">
                Showing <span className="text-gold font-medium">{filteredMaterials.length}</span> materials
              </p>
            </div>

            {viewMode === "grid" ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredMaterials.map((material) => (
                  <Link href={`/materials/${material.id}`} key={material.id}>
                    <Card className="group overflow-hidden bg-card border-border hover:border-gold/50 transition-all duration-300 h-full">
                      <div className="relative aspect-[4/5] overflow-hidden">
                        <Image
                          src={material.image || "/placeholder.svg"}
                          alt={material.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <Badge className="bg-gold/90 text-background hover:bg-gold">
                            {material.category}
                          </Badge>
                          {material.inStock ? (
                            <Badge className="bg-green-600/90 text-white hover:bg-green-600">
                              In Stock
                            </Badge>
                          ) : (
                            <Badge className="bg-destructive/90 text-white hover:bg-destructive">
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button className="w-full bg-gold text-background hover:bg-gold-light">
                            View Details
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-muted-foreground">{material.origin}</span>
                        </div>
                        <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-gold transition-colors">
                          {material.name}
                        </h3>
                        <p className="mt-2 text-gold font-semibold">
                          QAR {material.price.toLocaleString()}/{material.unit}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredMaterials.map((material) => (
                  <Link href={`/materials/${material.id}`} key={material.id}>
                    <Card className="group overflow-hidden bg-card border-border hover:border-gold/50 transition-all duration-300">
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative w-full sm:w-48 lg:w-64 aspect-[4/3] sm:aspect-square overflow-hidden">
                          <Image
                            src={material.image || "/placeholder.svg"}
                            alt={material.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <CardContent className="flex-1 p-4 sm:p-6">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <Badge className="bg-gold/90 text-background hover:bg-gold">
                              {material.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{material.origin}</span>
                            {material.inStock ? (
                              <span className="flex items-center gap-1 text-xs text-green-500">
                                <Check className="h-3 w-3" /> In Stock ({material.stockQuantity} sqm)
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-xs text-destructive">
                                <X className="h-3 w-3" /> Out of Stock
                              </span>
                            )}
                          </div>
                          <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-gold transition-colors">
                            {material.name}
                          </h3>
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                            {material.description}
                          </p>
                          <div className="mt-4 flex flex-wrap items-center gap-4">
                            <span className="text-gold font-semibold text-lg">
                              QAR {material.price.toLocaleString()}/{material.unit}
                            </span>
                            <div className="flex gap-2">
                              {material.finish.slice(0, 3).map((f) => (
                                <span key={f} className="text-xs px-2 py-1 bg-secondary rounded text-muted-foreground">
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
