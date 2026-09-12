import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CustomerDirectory } from "@/components/customer-directory"
import { getCustomers } from "@/app/actions/customers"
import { ArrowLeft } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function CustomersPage() {
  const customers = await getCustomers()

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 lg:pt-24 pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="font-serif text-3xl font-bold">Customers</h1>
            <p className="text-muted-foreground mt-1">
              Each customer has a unique ID, document folders, and quotation history.
            </p>
          </div>
          <CustomerDirectory customers={customers} />
        </div>
      </div>
      <Footer />
    </main>
  )
}
