import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MaterialsBrowser } from "@/components/materials-browser"
import { getPublicProducts } from "@/app/actions/products"

export default async function MaterialsPage() {
  const dbProducts = await getPublicProducts()

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
                Explore our extensive collection of marble, granite, porcelain tiles, vanities, and exotic stones from around the world.
              </p>
            </div>
          </div>
        </section>

        <MaterialsBrowser dbProducts={dbProducts} />
      </div>

      <Footer />
    </main>
  )
}
