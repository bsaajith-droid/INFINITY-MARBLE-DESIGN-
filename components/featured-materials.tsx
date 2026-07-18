"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const materials = [
  {
    id: 1,
    name: "Calacatta Gold",
    category: "Marble",
    origin: "Italy",
    image: "/images/marble-calacatta.jpg",
    price: "QAR 850/sqm",
  },
  {
    id: 2,
    name: "Black Galaxy",
    category: "Granite",
    origin: "India",
    image: "/images/granite-black.jpg",
    price: "QAR 650/sqm",
  },
  {
    id: 3,
    name: "Nero Marquina",
    category: "Porcelain",
    origin: "Spain",
    image: "/images/porcelain-nero.jpg",
    price: "QAR 450/sqm",
  },
  {
    id: 4,
    name: "Honey Onyx",
    category: "Onyx",
    origin: "Iran",
    image: "/images/onyx-honey.jpg",
    price: "QAR 1,200/sqm",
  },
]

export function FeaturedMaterials() {
  return (
    <section className="py-20 lg:py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <span className="text-sm font-medium text-gold tracking-wider uppercase">Our Collection</span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">
              Featured Materials
            </h2>
          </div>
          <Link 
            href="/materials" 
            className="group inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
          >
            View All Materials
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {materials.map((material) => (
            <Link href={`/materials/${material.id}`} key={material.id}>
              <Card className="group overflow-hidden bg-card border-border hover:border-gold/50 transition-all duration-300">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={material.image || "/placeholder.svg"}
                    alt={material.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-gold font-medium">{material.price}</span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-gold bg-gold/10 px-2 py-1 rounded">
                      {material.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{material.origin}</span>
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-gold transition-colors">
                    {material.name}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
