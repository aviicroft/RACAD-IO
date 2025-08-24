import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Mic, Trash2, Paperclip } from "lucide-react"
import { useState } from "react"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({ onSendMessage, disabled, placeholder = "Type your message..." }: ChatInputProps) {
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const message = input.trim()
    if (message && !disabled) {
      onSendMessage(message)
      setInput("")
    }
  }

  const handleClearChat = () => {
    // This could be implemented to clear the current chat
    console.log("Clear chat functionality")
  }

  const handleVoiceInput = () => {
    // This could be implemented for voice input
    console.log("Voice input functionality")
  }

  return (
    <div className="border-t border-border glass-input">
      <form onSubmit={handleSubmit} className="flex items-center gap-3 p-4 max-w-4xl mx-auto">
        {/* Left side - Optional buttons */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleVoiceInput}
            className="h-10 w-10 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-full transition-all duration-200 hover-glow"
            title="Voice Input"
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all duration-200 hover-glow"
            title="Attach File"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Center - Input field */}
        <div className="flex-1">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="h-12 discord-input focus:ring-2 focus:ring-ring/20 transition-all duration-200"
          />
        </div>
        
        {/* Right side - Send and Clear buttons */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClearChat}
            className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all duration-200 hover-glow"
            title="Clear Chat"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            type="submit"
            size="icon"
            disabled={disabled || !input.trim()}
            className="h-12 w-12 discord-button rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group hover-glow"
            title="Send Message"
          >
            <Send className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
          </Button>
        </div>
      </form>
    </div>
  )
}
