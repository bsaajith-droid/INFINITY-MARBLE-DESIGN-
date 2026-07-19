"use client"

import { useEffect, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Loader2, Sparkles } from "lucide-react"

function messageText(parts: { type: string; text?: string }[] | undefined) {
  if (!parts) return ""
  return parts
    .filter((p) => p.type === "text")
    .map((p) => p.text ?? "")
    .join("")
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const busy = status === "streaming" || status === "submitted"

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || busy) return
    sendMessage({ text })
    setInput("")
  }

  return (
    <>
      {/* Floating toggle button */}
      <Button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close design assistant" : "Open design assistant"}
        className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-gold text-background hover:bg-gold-light shadow-lg"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Design assistant chat"
          className="fixed bottom-24 right-5 z-50 flex w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-xl border border-gold/30 bg-card shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border bg-secondary/50 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15">
              <Sparkles className="h-4 w-4 text-gold" />
            </div>
            <div>
              <p className="font-serif text-sm font-semibold text-foreground">Design Assistant</p>
              <p className="text-xs text-muted-foreground">INFINITY MARBLE DESIGN</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4" style={{ maxHeight: "50vh", minHeight: "16rem" }}>
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                <Sparkles className="h-6 w-6 text-gold" />
                <p className="text-pretty">
                  Ask me anything about marble, granite, porcelain tiles, or vanities for your space.
                </p>
              </div>
            )}
            <div className="flex flex-col gap-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={
                    m.role === "user"
                      ? "ml-8 self-end rounded-lg rounded-br-sm bg-gold px-3 py-2 text-sm text-background"
                      : "mr-8 self-start rounded-lg rounded-bl-sm bg-secondary px-3 py-2 text-sm leading-relaxed text-foreground"
                  }
                >
                  {messageText(m.parts as { type: string; text?: string }[])}
                </div>
              ))}
              {busy && messages[messages.length - 1]?.role === "user" && (
                <div className="mr-8 flex items-center gap-2 self-start rounded-lg bg-secondary px-3 py-2 text-sm text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking...
                </div>
              )}
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border p-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Best marble for a bathroom?"
              className="border-border bg-secondary/50"
              aria-label="Chat message"
            />
            <Button
              type="submit"
              size="icon"
              disabled={busy || !input.trim()}
              aria-label="Send message"
              className="shrink-0 bg-gold text-background hover:bg-gold-light"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  )
}
