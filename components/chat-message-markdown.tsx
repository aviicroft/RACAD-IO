import React from "react"
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

export function ChatMessageMarkdown({ role, content, timestamp, metadata, onFAQSelect }: ChatMessageProps) {
  const [isClient, setIsClient] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isPlayingTTS, setIsPlayingTTS] = useState(false)
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)
  const [showActions, setShowActions] = useState(false)
  const [copiedCodeBlocks, setCopiedCodeBlocks] = useState<Set<string>>(new Set())
  
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

  // Copy code block functionality
  const handleCopyCodeBlock = async (code: string, language: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCodeBlocks(prev => new Set(prev).add(`${language}-${code.slice(0, 20)}`))
      setTimeout(() => {
        setCopiedCodeBlocks(prev => {
          const newSet = new Set(prev)
          newSet.delete(`${language}-${code.slice(0, 20)}`)
          return newSet
        })
      }, 2000)
    } catch (err) {
      console.error('Failed to copy code: ', err)
    }
  }

  // Custom components for Markdown rendering
  const markdownComponents = {
    // Code blocks with syntax highlighting and copy button
    code: ({ inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '')
      const language = match ? match[1] : 'text'
      const code = String(children).replace(/\n$/, '')
      const isCopied = copiedCodeBlocks.has(`${language}-${code.slice(0, 20)}`)

      if (inline) {
        return (
          <code className="px-1.5 py-0.5 bg-[#1e1f22] text-[#e06c75] rounded text-sm font-mono">
            {children}
          </code>
        )
      }

      // For block code, use a proper container
      return (
        <div className="relative group">
          {/* Copy button */}
          <button
            onClick={() => handleCopyCodeBlock(code, language)}
            className="absolute top-2 right-2 p-1.5 rounded bg-[#2b2d31] hover:bg-[#3a3d42] transition-colors opacity-0 group-hover:opacity-100 z-10"
            title="Copy code"
          >
            {isCopied ? (
              <Check className="h-3.5 w-3.5 text-green-400" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-[#888]" />
            )}
          </button>
          
          {/* Language label */}
          <div className="absolute top-2 left-2 px-2 py-1 rounded bg-[#1e1f22] text-[#888] text-xs font-mono z-10">
            {language}
          </div>
          
          {/* Code content */}
          <SyntaxHighlighter
            style={oneDark}
            language={language}
            PreTag="div"
            className="rounded-lg !mt-0 !mb-0"
            customStyle={{
              margin: 0,
              padding: '2.5rem 1rem 1rem 1rem',
              background: '#1e1f22',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              lineHeight: '1.5'
            }}
            {...props}
          >
            {code}
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
    
    // Headings with proper styling
    h1: ({ children, ...props }: any) => (
      <h1 className="text-2xl font-bold text-white mb-4 mt-6 first:mt-0" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: any) => (
      <h2 className="text-xl font-bold text-white mb-3 mt-5 first:mt-0" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: any) => (
      <h3 className="text-lg font-bold text-white mb-2 mt-4 first:mt-0" {...props}>
        {children}
      </h3>
    ),
    
    // Lists with proper indentation
    ul: ({ children, ...props }: any) => (
      <ul className="list-disc list-inside space-y-1 mb-4 ml-4" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: any) => (
      <ol className="list-decimal list-inside space-y-1 mb-4 ml-4" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }: any) => (
      <li className="text-[#e1e1e1] leading-relaxed" {...props}>
        {children}
      </li>
    ),
    
    // Blockquotes with left border
    blockquote: ({ children, ...props }: any) => (
      <blockquote className="border-l-4 border-accent/50 pl-4 py-2 my-4 bg-[#1e1f22]/30 rounded-r-lg italic text-[#b0b0b0]" {...props}>
        {children}
      </blockquote>
    ),
    
    // Tables with proper styling
    table: ({ children, ...props }: any) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border-collapse border border-[#444] rounded-lg" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }: any) => (
      <thead className="bg-[#1e1f22]" {...props}>
        {children}
      </thead>
    ),
    th: ({ children, ...props }: any) => (
      <th className="border border-[#444] px-4 py-2 text-left font-semibold text-white" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }: any) => (
      <td className="border border-[#444] px-4 py-2 text-[#e1e1e1]" {...props}>
        {children}
      </td>
    ),
    
    // Paragraphs with proper spacing - handle block-level children
    p: ({ children, ...props }: any) => {
      // Check if children contain block-level elements
      const hasBlockChildren = React.Children.toArray(children).some((child: any) => {
        if (React.isValidElement(child)) {
          const tagName = typeof child.type === 'string' ? child.type.toLowerCase() : String(child.type)
          return ['div', 'pre', 'blockquote', 'table', 'ul', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)
        }
        return false
      })

      // If paragraph contains block elements, render as a div instead
      if (hasBlockChildren) {
        return (
          <div className="mb-3 last:mb-0 text-[#e1e1e1] leading-relaxed" {...props}>
            {children}
          </div>
        )
      }

      // Regular paragraph
      return (
        <p className="mb-3 last:mb-0 text-[#e1e1e1] leading-relaxed" {...props}>
          {children}
        </p>
      )
    },
    
    // Strong text
    strong: ({ children, ...props }: any) => (
      <strong className="font-bold text-white" {...props}>
        {children}
      </strong>
    ),
    
    // Emphasis text
    em: ({ children, ...props }: any) => (
      <em className="italic text-[#f0f0f0]" {...props}>
        {children}
      </em>
    ),
    
    // Strikethrough text
    del: ({ children, ...props }: any) => (
      <del className="line-through text-[#888]" {...props}>
        {children}
      </del>
    ),
    
    // Horizontal rule
    hr: ({ ...props }: any) => (
      <hr className="border-t border-[#444] my-6" {...props} />
    ),
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
            {/* Markdown Content */}
            <div className="prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap break-words font-medium">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
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
