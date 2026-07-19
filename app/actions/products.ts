"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { and, desc, eq } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { del } from "@vercel/blob"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

export type ProductInput = {
  name: string
  category: string
  origin: string
  image: string
  price: number
  unit: string
  finish: string
  application: string
  description: string
  inStock: boolean
  stockQuantity: number
  featured: boolean
}

// Public read — used by the materials catalog. No auth required.
export async function getPublicProducts() {
  return db.select().from(products).orderBy(desc(products.createdAt))
}

// Admin read — only the signed-in admin's products.
export async function getMyProducts() {
  const userId = await getUserId()
  return db
    .select()
    .from(products)
    .where(eq(products.userId, userId))
    .orderBy(desc(products.createdAt))
}

export async function createProduct(input: ProductInput) {
  const userId = await getUserId()
  const id = `prod_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

  await db.insert(products).values({
    id,
    userId,
    name: input.name,
    category: input.category,
    origin: input.origin || null,
    image: input.image,
    price: String(input.price),
    unit: input.unit,
    finish: input.finish || null,
    application: input.application || null,
    description: input.description || null,
    inStock: input.inStock,
    stockQuantity: input.stockQuantity,
    featured: input.featured,
  })

  revalidatePath("/materials")
  revalidatePath("/dashboard/products")
  return { id }
}

export async function deleteProduct(id: string) {
  const userId = await getUserId()
  const [row] = await db
    .select()
    .from(products)
    .where(and(eq(products.id, id), eq(products.userId, userId)))

  if (row) {
    await db.delete(products).where(and(eq(products.id, id), eq(products.userId, userId)))
    // Clean up the blob image if it lives in our store.
    if (row.image?.includes("blob.vercel-storage.com")) {
      try {
        await del(row.image)
      } catch (e) {
        console.error("Failed to delete blob:", e)
      }
    }
  }

  revalidatePath("/materials")
  revalidatePath("/dashboard/products")
}
