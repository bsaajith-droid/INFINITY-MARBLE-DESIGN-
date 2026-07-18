import { type NextRequest, NextResponse } from "next/server"
import * as fal from "@fal-ai/serverless-client"

fal.config({
  credentials: process.env.FAL_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { prompt, roomType, material, style } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Create an enhanced prompt for interior design visualization
    const enhancedPrompt = `Professional interior design photo of a ${roomType || "luxury room"} featuring ${material || "marble"} surfaces. ${prompt}. Style: ${style || "modern luxury"}. High-end architectural photography, photorealistic, 8K quality, natural lighting, elegant and sophisticated design.`

    const result = await fal.subscribe("fal-ai/flux/schnell", {
      input: {
        prompt: enhancedPrompt,
        image_size: "landscape_16_9",
        num_inference_steps: 4,
        num_images: 1,
      },
    })

    const imageUrl = result.images?.[0]?.url

    if (!imageUrl) {
      throw new Error("No image generated")
    }

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error("Error generating visualization:", error)
    return NextResponse.json(
      { error: "Failed to generate visualization" },
      { status: 500 }
    )
  }
}
