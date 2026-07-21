import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CustomerDetail } from "@/components/customer-detail"
import {
  getCustomer,
  getQuotationsForCustomer,
  getDocumentsForCustomer,
} from "@/app/actions/customers"
import { ArrowLeft } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const customer = await getCustomer(id)
  if (!customer) notFound()

  const [quotations, documents] = await Promise.all([
    getQuotationsForCustomer(id),
    getDocumentsForCustomer(id),
  ])

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 lg:pt-24 pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard/customers"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Customers
          </Link>
          <CustomerDetail
            customer={customer}
            quotations={quotations}
            documents={documents}
          />
        </div>
      </div>
      <Footer />
    </main>
  )
}
