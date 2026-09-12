"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-marble.jpg"
          alt="Luxury marble surface"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-8">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="text-sm text-gold">Premium Stone Solutions in Qatar</span>
          </div>
          
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
            <span className="text-foreground">Transform Spaces with</span>
            <br />
            <span className="text-gold">Timeless Elegance</span>
          </h1>
          
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed text-pretty">
            Discover our exquisite collection of marble, granite, and porcelain tiles. 
            From visualization to installation, we bring your interior design dreams to life.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-gold text-background hover:bg-gold-light min-h-[48px] px-8">
              <Link href="/materials">
                Explore Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-gold/50 text-gold hover:bg-gold/10 min-h-[48px] px-8 bg-transparent">
              <Link href="/visualizer">
                AI Visualizer
                <Sparkles className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { value: "500+", label: "Projects Completed" },
              { value: "200+", label: "Stone Varieties" },
              { value: "15+", label: "Years Experience" },
              { value: "100%", label: "Client Satisfaction" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-gold">{stat.value}</span>
                <span className="mt-1 text-sm text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs text-muted-foreground">Scroll to explore</span>
        <div className="h-8 w-5 rounded-full border-2 border-gold/50 flex items-start justify-center p-1">
          <div className="h-2 w-1 rounded-full bg-gold animate-pulse" />
        </div>
      </div>
    </section>
  )
}
