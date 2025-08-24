
import { cn } from "@/lib/utils"
import { Bot, User, ExternalLink, Lightbulb, Copy, Share2, Volume2, ThumbsUp, ThumbsDown, Check, MessageSquare } from "lucide-react"
import { useState, useEffect } from "react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface RelatedFAQ {
  question: string
  answer: string
  category: string
  link: string
}

// Custom Markdown components
const MarkdownComponents = {
  // Code blocks with syntax highlighting and copy button
  code: ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '')
    const language = match ? match[1] : ''
    const codeString = String(children).replace(/\n$/, '')
    
    if (inline) {
      return (
        <code className="px-1.5 py-0.5 bg-muted/50 text-accent rounded text-sm font-mono" {...props}>
          {children}
        </code>
      )
    }
    
    return (
      <div className="relative group">
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => {
              navigator.clipboard.writeText(codeString)
              // You could add a toast notification here
            }}
            className="p-1.5 rounded bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Copy code"
          >
            <Copy className="h-3 w-3" />
          </button>
        </div>
        <SyntaxHighlighter
          style={oneDark}
          language={language}
          PreTag="div"
          className="rounded-lg text-sm"
          customStyle={{
            margin: 0,
            background: 'transparent'
          }}
          {...props}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    )
  },
  
  // Links with external link icon
  a: ({ href, children, ...props }: any) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent hover:text-accent/80 underline transition-colors inline-flex items-center gap-1 font-medium"
      {...props}
    >
      {children}
      <ExternalLink className="h-3 w-3 inline ml-1" />
    </a>
  ),
  
  // Lists
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc list-inside space-y-1 my-2" {...props}>
      {children}
    </ul>
  ),
  
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal list-inside space-y-1 my-2" {...props}>
      {children}
    </ol>
  ),
  
  li: ({ children, ...props }: any) => (
    <li className="text-sm" {...props}>
      {children}
    </li>
  ),
  
  // Headings
  h1: ({ children, ...props }: any) => (
    <h1 className="text-lg font-bold my-3" {...props}>
      {children}
    </h1>
  ),
  
  h2: ({ children, ...props }: any) => (
    <h2 className="text-base font-semibold my-2" {...props}>
      {children}
    </h2>
  ),
  
  h3: ({ children, ...props }: any) => (
    <h3 className="text-sm font-semibold my-2" {...props}>
      {children}
    </h3>
  ),
  
  // Blockquotes
  blockquote: ({ children, ...props }: any) => (
    <blockquote className="border-l-4 border-accent/50 pl-4 my-3 italic text-muted-foreground" {...props}>
      {children}
    </blockquote>
  ),
  
  // Paragraphs
  p: ({ children, ...props }: any) => (
    <p className="my-2" {...props}>
      {children}
    </p>
  ),
  
  // Strong (bold)
  strong: ({ children, ...props }: any) => (
    <strong className="font-semibold" {...props}>
      {children}
    </strong>
  ),
  
  // Emphasis (italic)
  em: ({ children, ...props }: any) => (
    <em className="italic" {...props}>
      {children}
    </em>
  )
}

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  timestamp?: Date
  metadata?: {
    confidence?: number
    source?: string
    category?: string
    link?: string
    relatedFAQs?: RelatedFAQ[]
    reasoning?: string
  }
  onFAQSelect?: (faq: RelatedFAQ) => void
}

export function ChatMessage({ role, content, timestamp, metadata, onFAQSelect }: ChatMessageProps) {
  const [isClient, setIsClient] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isPlayingTTS, setIsPlayingTTS] = useState(false)
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)
  const [showActions, setShowActions] = useState(false)
  
  const isUser = role === "user"
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Copy to clipboard functionality
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  // Share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Chat Response',
          text: content,
          url: window.location.href
        })
      } catch (err) {
        console.error('Error sharing: ', err)
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(content)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy text: ', err)
      }
    }
  }

  // Text-to-Speech functionality
  const handleTTS = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingTTS) {
        speechSynthesis.cancel()
        setIsPlayingTTS(false)
      } else {
        const utterance = new SpeechSynthesisUtterance(content)
        utterance.onend = () => setIsPlayingTTS(false)
        utterance.onerror = () => setIsPlayingTTS(false)
        speechSynthesis.speak(utterance)
        setIsPlayingTTS(true)
      }
    }
  }

  // Feedback functionality
  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(feedback === type ? null : type)
    // Here you could send feedback to your backend
    console.log(`Feedback: ${type}`)
  }
  
  return (
    <div className={cn(
      "flex w-full animate-in fade-in-up duration-500",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "flex max-w-[85%] gap-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        {/* Avatar */}
        <div className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-lg",
          isUser 
            ? "discord-gradient" 
            : "bg-[#2b2d31] text-white"
        )}>
          {isUser ? (
            <User className="h-5 w-5 text-white" />
          ) : (
            <Bot className="h-5 w-5" />
          )}
        </div>
        
        {/* Message Bubble */}
        <div className={cn(
          "relative group",
          isUser ? "flex flex-col items-end" : "flex flex-col items-start"
        )}>
          <div 
            className={cn(
              "relative px-4 py-3 rounded-2xl shadow-lg max-w-full transition-all duration-200",
              isUser 
                ? "user-message hover:shadow-xl" 
                : "bot-message"
            )}
            onMouseEnter={() => !isUser && setShowActions(true)}
            onMouseLeave={() => !isUser && setShowActions(false)}
          >
            <div className="text-sm leading-relaxed break-words font-medium">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={MarkdownComponents}
              >
                {content}
              </ReactMarkdown>
            </div>
            
            {/* Interactive Actions Row - Only for bot messages */}
            {!isUser && (
              <div className={cn(
                "flex items-center gap-1 mt-3 pt-3 border-t border-[#444]/30 transition-all duration-200",
                showActions ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
              )}>
                {/* Copy Button */}
                <button
                  onClick={handleCopy}
                  className={cn(
                    "p-1.5 rounded-lg hover:bg-[#444]/50 transition-all duration-150 group/action action-button",
                    isCopied && "copy-success"
                  )}
                  title="Copy to clipboard"
                >
                  {isCopied ? (
                    <Check className="h-3.5 w-3.5 text-green-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-[#888] group-hover/action:text-white" />
                  )}
                </button>

                {/* Divider */}
                <div className="w-px h-4 bg-[#444]/50" />

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="p-1.5 rounded-lg hover:bg-[#444]/50 transition-all duration-150 group/action action-button"
                  title="Share response"
                >
                  <Share2 className="h-3.5 w-3.5 text-[#888] group-hover/action:text-white" />
                </button>

                {/* Divider */}
                <div className="w-px h-4 bg-[#444]/50" />

                {/* TTS Button */}
                <button
                  onClick={handleTTS}
                  className="p-1.5 rounded-lg hover:bg-[#444]/50 transition-all duration-150 group/action relative action-button"
                  title="Text to speech"
                >
                  <Volume2 className={cn(
                    "h-3.5 w-3.5 transition-all duration-150",
                    isPlayingTTS 
                      ? "text-blue-400 tts-pulse" 
                      : "text-[#888] group-hover/action:text-white"
                  )} />
                  {isPlayingTTS && (
                    <div className="absolute inset-0 rounded-lg bg-blue-400/20 animate-ping" />
                  )}
                </button>

                {/* Divider */}
                <div className="w-px h-4 bg-[#444]/50" />

                {/* Feedback Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleFeedback('up')}
                    className={cn(
                      "p-1.5 rounded-lg transition-all duration-150 group/action action-button",
                      feedback === 'up' 
                        ? "feedback-active-up" 
                        : "hover:bg-[#444]/50"
                    )}
                    title="Helpful"
                  >
                    <ThumbsUp className={cn(
                      "h-3.5 w-3.5 transition-all duration-150",
                      feedback === 'up' 
                        ? "text-green-400" 
                        : "text-[#888] group-hover/action:text-white"
                    )} />
                  </button>

                  <button
                    onClick={() => handleFeedback('down')}
                    className={cn(
                      "p-1.5 rounded-lg transition-all duration-150 group/action action-button",
                      feedback === 'down' 
                        ? "feedback-active-down" 
                        : "hover:bg-[#444]/50"
                    )}
                    title="Not helpful"
                  >
                    <ThumbsDown className={cn(
                      "h-3.5 w-3.5 transition-all duration-150",
                      feedback === 'down' 
                        ? "text-red-400" 
                        : "text-[#888] group-hover/action:text-white"
                    )} />
                  </button>
                </div>
              </div>
            )}
            
            {/* Metadata for bot messages */}
            {!isUser && metadata && (
              <div className="mt-3 space-y-2">
                {/* Confidence indicator */}
                {metadata.confidence && (
                  <div className="flex items-center gap-2 text-xs text-[#888]">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-accent"></div>
                      <span>Confidence: {Math.round(metadata.confidence * 100)}%</span>
                    </div>
                    {metadata.source && (
                      <span className="text-xs px-2 py-1 bg-[#444]/50 rounded-full">
                        {metadata.source === 'ai_generated' ? '🤖 AI Generated' : 
                         metadata.source === 'faq_enhanced' ? '📚 FAQ Enhanced' :
                         metadata.source === 'conversational' ? '💬 Chat' :
                         metadata.source === 'creative' ? '🎨 Creative' :
                         metadata.source === 'fallback' ? 'ℹ️ General Info' : 
                         metadata.source === 'special_response' ? '💖 Special Response' :
                         metadata.source}
                      </span>
                    )}
                  </div>
                )}
                
                {/* Category and link - only show for FAQ responses */}
                {metadata.source === 'faq' && metadata.category && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 bg-accent/20 text-accent rounded-full">
                      {metadata.category}
                    </span>
                    {metadata.link && (
                      <a
                        href={metadata.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-accent hover:text-accent/80 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Learn More
                      </a>
                    )}
                  </div>
                )}
                
                {/* AI Reasoning - show for AI-generated responses */}
                {metadata.reasoning && (
                  <div className="mt-3 p-3 bg-accent/10 rounded-lg border border-accent/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-accent"></div>
                      <span className="text-xs font-medium text-accent">AI Reasoning:</span>
                    </div>
                    <div className="text-xs text-[#888]">
                      {metadata.reasoning}
                    </div>
                  </div>
                )}
                
                {/* Related FAQs */}
                {metadata.relatedFAQs && metadata.relatedFAQs.length > 0 && (
                  <div className="mt-3 p-3 bg-[#444]/30 rounded-lg border border-[#444]/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-3 w-3 text-accent" />
                      <span className="text-xs font-medium text-white">
                        {metadata.source === 'conversational' ? 'You might also want to know:' : 'Related Questions:'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {metadata.relatedFAQs.slice(0, 2).map((faq, index) => (
                        <div key={index} className="space-y-2">
                          {/* Related Question Button - Acts like chat */}
                          <button
                            onClick={() => {
                              if (onFAQSelect) {
                                onFAQSelect(faq)
                              } else {
                                // Fallback: log to console if no callback provided
                                console.log('FAQ clicked:', faq.question)
                              }
                            }}
                            className="w-full text-left p-2 rounded-lg hover:bg-[#555]/50 transition-colors group cursor-pointer border border-transparent hover:border-accent/30"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[#888] group-hover:text-white transition-colors">•</span>
                              <span className="text-xs text-[#888] group-hover:text-white transition-colors flex-1">
                                {faq.question}
                              </span>
                              <MessageSquare className="h-3 w-3 text-[#666] group-hover:text-accent transition-colors opacity-0 group-hover:opacity-100" />
                            </div>
                          </button>
                          
                          {/* Learn More Link - Redirects to college website */}
                          {faq.link && (
                            <div className="ml-4">
                              <a
                                href={faq.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-accent hover:text-accent/80 transition-colors inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-accent/10 transition-all"
                              >
                                <ExternalLink className="h-2.5 w-2.5 mr-1" />
                                Learn More
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Timestamp */}
          {timestamp && isClient && (
            <div className="message-timestamp">
              {timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
