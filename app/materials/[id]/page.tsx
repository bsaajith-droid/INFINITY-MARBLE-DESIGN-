"use client"

import { use, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getMaterialById, materials } from "@/lib/materials-data"
import {
  ArrowLeft,
  Check,
  X,
  MapPin,
  Ruler,
  Sparkles,
  Package,
  Calculator,
  FileText,
  ShoppingCart,
} from "lucide-react"

export default function MaterialDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const material = getMaterialById(resolvedParams.id)
  const [selectedThickness, setSelectedThickness] = useState("")
  const [selectedFinish, setSelectedFinish] = useState("")
  const [quantity, setQuantity] = useState(1)

  if (!material) {
    notFound()
  }

  const totalPrice = material.price * quantity

  const relatedMaterials = materials
    .filter((m) => m.category === material.category && m.id !== material.id)
    .slice(0, 4)

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-20 lg:pt-24">
        {/* Breadcrumb */}
        <div className="bg-secondary/30 py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/materials"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Materials
            </Link>
          </div>
        </div>

        {/* Product Detail */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Image */}
              <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary">
                <Image
                  src={material.image || "/placeholder.svg"}
                  alt={material.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-gold text-background">{material.category}</Badge>
                  {material.inStock ? (
                    <Badge className="bg-green-600 text-white">In Stock</Badge>
                  ) : (
                    <Badge className="bg-destructive text-white">Out of Stock</Badge>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 text-gold" />
                  <span>Origin: {material.origin}</span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                  {material.name}
                </h1>

                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {material.description}
                </p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-serif text-4xl font-bold text-gold">
                    QAR {material.price.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">/ {material.unit}</span>
                </div>

                {material.inStock && (
                  <p className="mt-2 flex items-center gap-2 text-sm text-green-500">
                    <Check className="h-4 w-4" />
                    {material.stockQuantity} sqm available in stock
                  </p>
                )}

                {/* Options */}
                <div className="mt-8 space-y-6">
                  {/* Thickness */}
                  <div>
                    <Label className="text-sm font-medium">Thickness</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {material.thickness.map((t) => (
                        <Button
                          key={t}
                          variant={selectedThickness === t ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedThickness(t)}
                          className={
                            selectedThickness === t
                              ? "bg-gold text-background hover:bg-gold-light"
                              : "border-border hover:border-gold"
                          }
                        >
                          {t}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Finish */}
                  <div>
                    <Label className="text-sm font-medium">Finish</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {material.finish.map((f) => (
                        <Button
                          key={f}
                          variant={selectedFinish === f ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedFinish(f)}
                          className={
                            selectedFinish === f
                              ? "bg-gold text-background hover:bg-gold-light"
                              : "border-border hover:border-gold"
                          }
                        >
                          {f}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <Label className="text-sm font-medium">Quantity (sqm)</Label>
                    <div className="mt-2 flex items-center gap-4">
                      <Input
                        type="number"
                        min={1}
                        max={material.stockQuantity}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-24 bg-secondary border-border"
                      />
                      <span className="text-muted-foreground text-sm">
                        Total: <span className="text-gold font-semibold">QAR {totalPrice.toLocaleString()}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="flex-1 bg-gold text-background hover:bg-gold-light min-h-[48px]"
                    disabled={!material.inStock}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Quote
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 border-gold text-gold hover:bg-gold/10 min-h-[48px] bg-transparent"
                    asChild
                  >
                    <Link href="/visualizer">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Visualize in Room
                    </Link>
                  </Button>
                </div>

                {/* Applications */}
                <div className="mt-8 pt-8 border-t border-border">
                  <h3 className="font-medium text-foreground mb-3">Applications</h3>
                  <div className="flex flex-wrap gap-2">
                    {material.application.map((app) => (
                      <span
                        key={app}
                        className="text-sm px-3 py-1 bg-secondary rounded-full text-muted-foreground"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Ruler, title: "Custom Cutting", desc: "Cut to your exact specifications" },
                { icon: Package, title: "Secure Packaging", desc: "Professional crating & delivery" },
                { icon: Calculator, title: "Material Calculator", desc: "Accurate quantity estimation" },
                { icon: FileText, title: "Instant Quotation", desc: "Get pricing in minutes" },
              ].map((feature) => (
                <Card key={feature.title} className="bg-card border-border">
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Related Materials */}
        {relatedMaterials.length > 0 && (
          <section className="py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="font-serif text-2xl font-bold mb-8">Related Materials</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedMaterials.map((m) => (
                  <Link href={`/materials/${m.id}`} key={m.id}>
                    <Card className="group overflow-hidden bg-card border-border hover:border-gold/50 transition-all duration-300">
                      <div className="relative aspect-[4/5] overflow-hidden">
                        <Image
                          src={m.image || "/placeholder.svg"}
                          alt={m.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-gold transition-colors">
                          {m.name}
                        </h3>
                        <p className="mt-1 text-gold font-medium">
                          QAR {m.price.toLocaleString()}/{m.unit}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  )
}
