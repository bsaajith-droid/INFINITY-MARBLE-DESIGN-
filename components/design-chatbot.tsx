"use client"

import { useEffect, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Sparkles, Loader2 } from "lucide-react"

export function DesignChatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isLoading = status === "streaming" || status === "submitted"

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput("")
  }

  return (
    <>
      {/* Floating toggle button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-background shadow-lg hover:bg-gold-light transition-colors"
          aria-label="Open design assistant chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-5 right-5 z-50 flex w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-xl border border-gold/30 bg-card shadow-2xl"
          role="dialog"
          aria-label="Design assistant"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gold" />
              <div>
                <p className="font-serif text-sm font-semibold text-foreground">Design Assistant</p>
                <p className="text-xs text-muted-foreground">INFINITY MARBLE DESIGN</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4" style={{ maxHeight: "50vh", minHeight: "16rem" }}>
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-muted-foreground py-10">
                <Sparkles className="h-8 w-8 text-gold/60" />
                <p className="text-sm text-pretty">
                  Ask me anything about marble, granite, or tiles for your space.
                </p>
                <p className="text-xs">e.g. &quot;Which marble is best for a bathroom floor?&quot;</p>
              </div>
            )}
            <div className="flex flex-col gap-3">
              {messages.map((message) => {
                const text = message.parts
                  .filter((p): p is { type: "text"; text: string } => p.type === "text")
                  .map((p) => p.text)
                  .join("")
                if (!text) return null
                return (
                  <div
                    key={message.id}
                    className={
                      message.role === "user"
                        ? "self-end max-w-[85%] rounded-lg bg-gold px-3 py-2 text-sm text-background"
                        : "self-start max-w-[85%] rounded-lg bg-secondary px-3 py-2 text-sm text-foreground whitespace-pre-wrap"
                    }
                  >
                    {text}
                  </div>
                )
              })}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="self-start rounded-lg bg-secondary px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-gold" />
                </div>
              )}
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border p-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about materials..."
              className="bg-secondary/50 border-border"
              aria-label="Chat message"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="shrink-0 bg-gold text-background hover:bg-gold-light"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  )
}
