"use client"

import { FileText, Package, Sparkles, ClipboardList, Calculator, Warehouse } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const services = [
  {
    icon: Sparkles,
    title: "AI Interior Visualization",
    description: "See your space transformed with our AI-powered visualization tool. Upload a room photo and preview different materials instantly.",
  },
  {
    icon: FileText,
    title: "Quotation & Invoicing",
    description: "Get instant professional quotations and invoices. Streamlined billing process for seamless transactions.",
  },
  {
    icon: ClipboardList,
    title: "Project Management",
    description: "Full project tracking from consultation to installation. Monitor progress, timelines, and deliverables in real-time.",
  },
  {
    icon: Package,
    title: "Premium Materials",
    description: "Access to 200+ varieties of marble, granite, and porcelain tiles sourced from the finest quarries worldwide.",
  },
  {
    icon: Warehouse,
    title: "Inventory Management",
    description: "Real-time stock tracking ensures availability. Reserve materials for your project with confidence.",
  },
  {
    icon: Calculator,
    title: "Material Calculator",
    description: "Precise measurement and quantity calculations. Minimize waste and optimize your material requirements.",
  },
]

export function ServicesSection() {
  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-gold tracking-wider uppercase">What We Offer</span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">
            Complete Stone Solutions
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground text-pretty">
            From selection to installation, we provide end-to-end services for all your marble, granite, and tile needs.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card 
              key={service.title} 
              className="group bg-card border-border hover:border-gold/50 transition-all duration-300 cursor-pointer"
            >
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10 text-gold group-hover:bg-gold group-hover:text-background transition-colors">
                  <service.icon className="h-6 w-6" />
                </div>
                <CardTitle className="font-serif text-xl text-foreground group-hover:text-gold transition-colors">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
