"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Phone, ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/interior-luxury.jpg"
          alt="Luxury interior with marble"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/85" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-sm font-medium text-gold tracking-wider uppercase">Ready to Start?</span>
          <h2 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">
            Let{"'"}s Bring Your Vision to Life
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed text-pretty">
            Contact our team of experts for a free consultation. We{"'"}ll help you select the perfect materials and provide a detailed quotation for your project.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-gold text-background hover:bg-gold-light min-h-[48px] px-8">
              <Link href="/contact">
                Request Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-gold/50 text-gold hover:bg-gold/10 min-h-[48px] px-8 bg-transparent">
              <a href="tel:+97450256775">
                <Phone className="mr-2 h-5 w-5" />
                Call Us Now
              </a>
            </Button>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              Available 7 days a week
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-gold" />
              Free site visit & consultation
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
