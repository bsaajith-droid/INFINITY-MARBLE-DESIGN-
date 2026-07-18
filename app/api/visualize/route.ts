import { type NextRequest, NextResponse } from "next/server"
import { experimental_generateImage as generateImage } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { prompt, roomType, material, style } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Create an enhanced prompt for interior design visualization
    const enhancedPrompt = `Professional interior design photo of a ${roomType || "luxury room"} featuring ${material || "marble"} surfaces. ${prompt}. Style: ${style || "modern luxury"}. High-end architectural photography, photorealistic, natural lighting, elegant and sophisticated design.`

    const { image } = await generateImage({
      model: "openai/gpt-image-1",
      prompt: enhancedPrompt,
      size: "1536x1024",
    })

    // Return a data URL so the client can render and download it directly
    const imageUrl = `data:${image.mediaType ?? "image/png"};base64,${image.base64}`

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error("[v0] Error generating visualization:", error)
    return NextResponse.json({ error: "Failed to generate visualization" }, { status: 500 })
  }
}
