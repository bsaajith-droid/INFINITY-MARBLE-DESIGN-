export const DOCUMENT_TYPES = [
  { key: "quotation", label: "Quotation" },
  { key: "invoice", label: "Invoice" },
] as const

export type DocumentTypeKey = (typeof DOCUMENT_TYPES)[number]["key"]

export function documentTypeLabel(key: string): string {
  return DOCUMENT_TYPES.find((f) => f.key === key)?.label ?? key
}

/** Days before a quotation's valid-until date to start warning about expiry */
export const EXPIRY_WARNING_DAYS = 7

export const QUOTATION_STATUSES = [
  { key: "draft", label: "Draft" },
  { key: "sent", label: "Sent" },
  { key: "accepted", label: "Accepted" },
  { key: "paid", label: "Paid" },
  { key: "cancelled", label: "Cancelled" },
] as const

export type QuotationStatus = (typeof QUOTATION_STATUSES)[number]["key"]

/** Format a sequential number into a padded code, e.g. 1 -> CUST-0001 */
export function formatCode(prefix: string, num: number): string {
  return `${prefix}-${String(num).padStart(4, "0")}`
}
