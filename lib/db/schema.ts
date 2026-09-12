import { pgTable, text, timestamp, boolean, numeric, integer, jsonb } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  origin: text('origin'),
  image: text('image').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull().default('0'),
  unit: text('unit').notNull().default('piece'),
  finish: text('finish'),
  application: text('application'),
  description: text('description'),
  inStock: boolean('inStock').notNull().default(true),
  stockQuantity: integer('stockQuantity').notNull().default(0),
  featured: boolean('featured').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const customers = pgTable('customers', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  customerNumber: integer('customerNumber').notNull(),
  customerCode: text('customerCode').notNull(),
  name: text('name').notNull(),
  mobile: text('mobile').notNull(),
  email: text('email'),
  address: text('address'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const quotations = pgTable('quotations', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  customerId: text('customerId').notNull(),
  quotationNumber: integer('quotationNumber').notNull(),
  quotationCode: text('quotationCode').notNull(),
  projectName: text('projectName'),
  items: jsonb('items').notNull().default([]),
  subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull().default('0'),
  total: numeric('total', { precision: 12, scale: 2 }).notNull().default('0'),
  status: text('status').notNull().default('draft'),
  notes: text('notes'),
  paidAt: timestamp('paidAt'),
  validUntil: timestamp('validUntil'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const customerDocuments = pgTable('customer_documents', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  customerId: text('customerId').notNull(),
  folder: text('folder').notNull(),
  fileName: text('fileName').notNull(),
  fileUrl: text('fileUrl').notNull(),
  fileSize: integer('fileSize').notNull().default(0),
  contentType: text('contentType'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
