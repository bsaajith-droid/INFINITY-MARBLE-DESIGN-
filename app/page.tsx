import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedMaterials } from "@/components/featured-materials"
import { ServicesSection } from "@/components/services-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturedMaterials />
      <ServicesSection />
      <CTASection />
      <Footer />
    </main>
  )
}
