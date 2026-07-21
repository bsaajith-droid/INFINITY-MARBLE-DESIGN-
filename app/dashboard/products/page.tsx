import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductManager } from "@/components/product-manager"
import { getMyProducts } from "@/app/actions/products"

export default async function ProductsPage() {
  const products = await getMyProducts()

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 lg:pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold">Vanity Products</h1>
            <p className="text-muted-foreground mt-1">
              Upload and manage your marble and porcelain vanity collection
            </p>
          </div>
          <ProductManager initialProducts={products} />
        </div>
      </div>
      <Footer />
    </main>
  )
}
