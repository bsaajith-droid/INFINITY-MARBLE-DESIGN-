"use server"

import { generateText } from "ai"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { nvidia, NVIDIA_CHAT_MODEL } from "@/lib/nvidia"

type DescriptionInput = {
  name: string
  category: string
  origin?: string
  finish?: string
}

export async function generateProductDescription(input: DescriptionInput): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")

  if (!input.name.trim()) throw new Error("Enter a product name first")

  const details = [
    `Product name: ${input.name}`,
    `Category: ${input.category.replace(/-/g, " ")}`,
    input.origin ? `Origin: ${input.origin}` : null,
    input.finish ? `Finish/Size: ${input.finish}` : null,
  ]
    .filter(Boolean)
    .join("\n")

  const { text } = await generateText({
    model: nvidia(NVIDIA_CHAT_MODEL),
    system:
      "You write elegant, concise product descriptions for INFINITY MARBLE DESIGN, a luxury marble, granite, and porcelain tiles company in Doha, Qatar. Write 2-3 sentences, sophisticated but factual tone, highlighting craftsmanship, material qualities, and suitability for luxury interiors. No headings, no bullet points, no quotes around the text, no invented measurements or prices.",
    prompt: `Write a product description for:\n${details}`,
  })

  return text.trim()
}
