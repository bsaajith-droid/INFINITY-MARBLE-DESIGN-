"use client"

import { useState } from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { materials } from "@/lib/materials-data"
import {
  Sparkles,
  Loader2,
  Download,
  RefreshCw,
  Wand2,
  ImageIcon,
  Home,
  Bath,
  UtensilsCrossed,
  Building2,
} from "lucide-react"

const roomTypes = [
  { id: "living-room", name: "Living Room", icon: Home },
  { id: "bathroom", name: "Bathroom", icon: Bath },
  { id: "kitchen", name: "Kitchen", icon: UtensilsCrossed },
  { id: "lobby", name: "Hotel Lobby", icon: Building2 },
]

const styles = [
  { id: "modern-luxury", name: "Modern Luxury" },
  { id: "classic-elegance", name: "Classic Elegance" },
  { id: "minimalist", name: "Minimalist" },
  { id: "contemporary", name: "Contemporary" },
  { id: "art-deco", name: "Art Deco" },
  { id: "mediterranean", name: "Mediterranean" },
]

export default function VisualizerPage() {
  const [selectedRoom, setSelectedRoom] = useState("living-room")
  const [selectedMaterial, setSelectedMaterial] = useState("calacatta-gold")
  const [selectedStyle, setSelectedStyle] = useState("modern-luxury")
  const [customPrompt, setCustomPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)

    const material = materials.find((m) => m.id === selectedMaterial)
    const room = roomTypes.find((r) => r.id === selectedRoom)
    const style = styles.find((s) => s.id === selectedStyle)

    try {
      const response = await fetch("/api/visualize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: customPrompt || `Beautiful ${material?.name || "marble"} flooring and wall cladding`,
          roomType: room?.name || "luxury room",
          material: `${material?.name || "marble"} from ${material?.origin || "Italy"}`,
          style: style?.name || "modern luxury",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate image")
      }

      const data = await response.json()
      setGeneratedImage(data.imageUrl)
    } catch (err) {
      setError("Failed to generate visualization. Please check your API key and try again.")
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async () => {
    if (!generatedImage) return
    
    try {
      const response = await fetch(generatedImage)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `infinity-marble-visualization-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error("Download failed:", err)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-20 lg:pt-24 pb-20">
        {/* Hero */}
        <section className="py-12 lg:py-20 bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-6">
                <Sparkles className="h-4 w-4 text-gold" />
                <span className="text-sm text-gold">AI-Powered Design</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold">
                Interior Design Visualizer
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground text-lg">
                See how our premium materials would look in your space. Select a room type, material, and style to generate a stunning visualization.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Controls */}
              <div className="space-y-6">
                {/* Room Type */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="font-serif flex items-center gap-2">
                      <Home className="h-5 w-5 text-gold" />
                      Room Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {roomTypes.map((room) => (
                        <Button
                          key={room.id}
                          variant={selectedRoom === room.id ? "default" : "outline"}
                          onClick={() => setSelectedRoom(room.id)}
                          className={`h-auto py-4 flex flex-col gap-2 ${
                            selectedRoom === room.id
                              ? "bg-gold text-background hover:bg-gold-light"
                              : "border-border hover:border-gold"
                          }`}
                        >
                          <room.icon className="h-6 w-6" />
                          <span>{room.name}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Material */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="font-serif">Select Material</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                      {materials.slice(0, 8).map((material) => (
                        <Button
                          key={material.id}
                          variant={selectedMaterial === material.id ? "default" : "outline"}
                          onClick={() => setSelectedMaterial(material.id)}
                          className={`h-auto py-3 justify-start text-left ${
                            selectedMaterial === material.id
                              ? "bg-gold text-background hover:bg-gold-light"
                              : "border-border hover:border-gold"
                          }`}
                        >
                          <div>
                            <p className="font-medium">{material.name}</p>
                            <p className="text-xs opacity-70">{material.category}</p>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Style */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="font-serif">Design Style</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {styles.map((style) => (
                        <Button
                          key={style.id}
                          variant={selectedStyle === style.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedStyle(style.id)}
                          className={
                            selectedStyle === style.id
                              ? "bg-gold text-background hover:bg-gold-light"
                              : "border-border hover:border-gold"
                          }
                        >
                          {style.name}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Custom Prompt */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="font-serif flex items-center gap-2">
                      <Wand2 className="h-5 w-5 text-gold" />
                      Custom Description (Optional)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="Add specific details like 'gold accents', 'fireplace', 'floor-to-ceiling windows'..."
                      className="bg-secondary border-border"
                      rows={3}
                    />
                  </CardContent>
                </Card>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-gold text-background hover:bg-gold-light min-h-[56px] text-lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Visualization
                    </>
                  )}
                </Button>
              </div>

              {/* Preview */}
              <div>
                <Card className="bg-card border-border sticky top-24">
                  <CardHeader>
                    <CardTitle className="font-serif flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-gold" />
                      Visualization Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative aspect-video bg-secondary rounded-lg overflow-hidden">
                      {generatedImage ? (
                        <>
                          <Image
                            src={generatedImage || "/placeholder.svg"}
                            alt="Generated interior visualization"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute bottom-4 right-4 flex gap-2">
                            <Button
                              size="sm"
                              onClick={handleDownload}
                              className="bg-background/80 backdrop-blur-sm text-foreground hover:bg-background"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleGenerate}
                              disabled={isGenerating}
                              className="bg-gold/80 backdrop-blur-sm text-background hover:bg-gold"
                            >
                              <RefreshCw className={`h-4 w-4 mr-1 ${isGenerating ? "animate-spin" : ""}`} />
                              Regenerate
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                          {isGenerating ? (
                            <>
                              <Loader2 className="h-12 w-12 animate-spin text-gold mb-4" />
                              <p>Creating your visualization...</p>
                              <p className="text-sm mt-2">This may take a few seconds</p>
                            </>
                          ) : (
                            <>
                              <ImageIcon className="h-12 w-12 mb-4" />
                              <p>Your visualization will appear here</p>
                              <p className="text-sm mt-2">Select options and click Generate</p>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {error && (
                      <div className="mt-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                        {error}
                      </div>
                    )}

                    {generatedImage && (
                      <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
                        <h4 className="font-medium text-foreground mb-2">Generation Details</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Room: {roomTypes.find((r) => r.id === selectedRoom)?.name}</p>
                          <p>Material: {materials.find((m) => m.id === selectedMaterial)?.name}</p>
                          <p>Style: {styles.find((s) => s.id === selectedStyle)?.name}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="py-12 bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold mb-8 text-center">Tips for Best Results</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  title: "Be Specific",
                  description: "Add details like 'floor-to-ceiling windows', 'gold fixtures', or 'natural light' for more accurate results.",
                },
                {
                  title: "Try Different Styles",
                  description: "Experiment with various design styles to see how the same material looks in different aesthetics.",
                },
                {
                  title: "Combine Materials",
                  description: "Mention complementary materials in your description to see sophisticated combinations.",
                },
              ].map((tip) => (
                <Card key={tip.title} className="bg-card border-border">
                  <CardContent className="p-6">
                    <h3 className="font-serif text-lg font-semibold text-gold mb-2">{tip.title}</h3>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
