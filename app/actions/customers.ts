"use server"

import { auth } from "@/lib/auth"
import { db, pool } from "@/lib/db"
import { customers, quotations, customerDocuments } from "@/lib/db/schema"
import { and, desc, eq } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { formatCode } from "@/lib/customer-constants"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

function newId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}

// ---------------- Customers ----------------

export async function getCustomers() {
  const userId = await getUserId()
  return db
    .select()
    .from(customers)
    .where(eq(customers.userId, userId))
    .orderBy(desc(customers.createdAt))
}

export async function getCustomer(id: string) {
  const userId = await getUserId()
  const [customer] = await db
    .select()
    .from(customers)
    .where(and(eq(customers.id, id), eq(customers.userId, userId)))
  return customer ?? null
}

export async function createCustomer(input: {
  name: string
  mobile: string
  email?: string
  address?: string
  notes?: string
}) {
  const userId = await getUserId()
  if (!input.name?.trim() || !input.mobile?.trim()) {
    throw new Error("Name and mobile number are required")
  }

  // Atomically generate the next sequential customer number
  const { rows } = await pool.query<{ nextval: string }>(
    "SELECT nextval('customer_number_seq') AS nextval",
  )
  const customerNumber = Number(rows[0].nextval)
  const customerCode = formatCode("CUST", customerNumber)

  const id = newId("cust")
  await db.insert(customers).values({
    id,
    userId,
    customerNumber,
    customerCode,
    name: input.name.trim(),
    mobile: input.mobile.trim(),
    email: input.email?.trim() || null,
    address: input.address?.trim() || null,
    notes: input.notes?.trim() || null,
  })

  revalidatePath("/dashboard/customers")
  return { id, customerCode }
}

export async function updateCustomer(
  id: string,
  input: { name: string; mobile: string; email?: string; address?: string; notes?: string },
) {
  const userId = await getUserId()
  await db
    .update(customers)
    .set({
      name: input.name.trim(),
      mobile: input.mobile.trim(),
      email: input.email?.trim() || null,
      address: input.address?.trim() || null,
      notes: input.notes?.trim() || null,
      updatedAt: new Date(),
    })
    .where(and(eq(customers.id, id), eq(customers.userId, userId)))
  revalidatePath(`/dashboard/customers/${id}`)
  revalidatePath("/dashboard/customers")
}

export async function deleteCustomer(id: string) {
  const userId = await getUserId()
  // Remove related records first (no FK cascade on app tables)
  await db.delete(quotations).where(and(eq(quotations.customerId, id), eq(quotations.userId, userId)))
  await db
    .delete(customerDocuments)
    .where(and(eq(customerDocuments.customerId, id), eq(customerDocuments.userId, userId)))
  await db.delete(customers).where(and(eq(customers.id, id), eq(customers.userId, userId)))
  revalidatePath("/dashboard/customers")
}

// ---------------- Quotations ----------------

export type QuotationItemInput = {
  name: string
  quantity: number
  unitPrice: number
}

export async function getQuotationsForCustomer(customerId: string) {
  const userId = await getUserId()
  return db
    .select()
    .from(quotations)
    .where(and(eq(quotations.customerId, customerId), eq(quotations.userId, userId)))
    .orderBy(desc(quotations.createdAt))
}

export async function getAllQuotations() {
  const userId = await getUserId()
  return db
    .select()
    .from(quotations)
    .where(eq(quotations.userId, userId))
    .orderBy(desc(quotations.createdAt))
}

export async function createQuotation(input: {
  customerId: string
  projectName?: string
  items: QuotationItemInput[]
  notes?: string
}) {
  const userId = await getUserId()

  // Confirm the customer belongs to this user
  const [customer] = await db
    .select()
    .from(customers)
    .where(and(eq(customers.id, input.customerId), eq(customers.userId, userId)))
  if (!customer) throw new Error("Customer not found")

  const items = (input.items ?? []).filter((i) => i.name?.trim())
  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)

  // New quotation number for every quote — even for the same customer
  const { rows } = await pool.query<{ nextval: string }>(
    "SELECT nextval('quotation_number_seq') AS nextval",
  )
  const quotationNumber = Number(rows[0].nextval)
  const quotationCode = formatCode("QT", quotationNumber)

  const id = newId("qt")
  await db.insert(quotations).values({
    id,
    userId,
    customerId: input.customerId,
    quotationNumber,
    quotationCode,
    projectName: input.projectName?.trim() || null,
    items,
    subtotal: subtotal.toFixed(2),
    total: subtotal.toFixed(2),
    status: "draft",
    notes: input.notes?.trim() || null,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  })

  revalidatePath(`/dashboard/customers/${input.customerId}`)
  return { id, quotationCode }
}

export async function updateQuotationStatus(id: string, customerId: string, status: string) {
  const userId = await getUserId()
  await db
    .update(quotations)
    .set({
      status,
      paidAt: status === "paid" ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(and(eq(quotations.id, id), eq(quotations.userId, userId)))
  revalidatePath(`/dashboard/customers/${customerId}`)
}

export async function deleteQuotation(id: string, customerId: string) {
  const userId = await getUserId()
  await db.delete(quotations).where(and(eq(quotations.id, id), eq(quotations.userId, userId)))
  revalidatePath(`/dashboard/customers/${customerId}`)
}

// ---------------- Documents ----------------

export async function getDocumentsForCustomer(customerId: string) {
  const userId = await getUserId()
  return db
    .select()
    .from(customerDocuments)
    .where(and(eq(customerDocuments.customerId, customerId), eq(customerDocuments.userId, userId)))
    .orderBy(desc(customerDocuments.createdAt))
}

export async function addDocument(input: {
  customerId: string
  folder: string
  fileName: string
  fileUrl: string
  fileSize: number
  contentType?: string
}) {
  const userId = await getUserId()
  const id = newId("doc")
  await db.insert(customerDocuments).values({
    id,
    userId,
    customerId: input.customerId,
    folder: input.folder,
    fileName: input.fileName,
    fileUrl: input.fileUrl,
    fileSize: input.fileSize,
    contentType: input.contentType || null,
  })
  revalidatePath(`/dashboard/customers/${input.customerId}`)
  return { id }
}

export async function deleteDocument(id: string, customerId: string) {
  const userId = await getUserId()
  await db
    .delete(customerDocuments)
    .where(and(eq(customerDocuments.id, id), eq(customerDocuments.userId, userId)))
  revalidatePath(`/dashboard/customers/${customerId}`)
}
