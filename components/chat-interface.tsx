import { useState, useEffect, useRef, useCallback } from "react"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { ChatHistory } from "./chat-history"
import { ThemeToggle } from "./theme-toggle"
import AIChatService from "@/lib/ai-chat-service"
import { useAuth } from "@/lib/auth-context"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Menu, Bot, Sparkles, Settings, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
  metadata?: {
    confidence?: number
    source?: string
    category?: string
    link?: string
    relatedFAQs?: Array<{
      question: string
      answer: string
      category: string
      link: string
    }>
  }
}

interface ChatSession {
  id: string
  title: string
  timestamp: Date
  messageCount: number
  messages: ChatMessage[]
}

export function ChatInterface() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(false)
  const [deletingSession, setDeletingSession] = useState<string | null>(null)
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([])
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const preferencesRef = useRef<HTMLDivElement>(null)
  const { user, isLoading: authLoading, logout } = useAuth()



  // Initialize AI chat service
  const aiService = AIChatService.getInstance()

  // Load chat history from MongoDB or localStorage
  useEffect(() => {
    if (authLoading) return

    if (user) {
      // Load from MongoDB for logged-in users
      loadUserChatHistory()
    } else {
      // Load from localStorage for guests
      const savedSessions = localStorage.getItem("chat-sessions")
      if (savedSessions) {
        const parsed = JSON.parse(savedSessions)
        // Convert timestamp strings back to Date objects
        const sessionsWithDates = parsed.map((session: Record<string, unknown>) => ({
          ...session,
          timestamp: new Date(session.timestamp as string),
          messages: (session.messages as Array<Record<string, unknown>>).map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp as string)
          }))
        }))
        setSessions(sessionsWithDates)
        if (sessionsWithDates.length > 0) {
          setActiveSessionId(sessionsWithDates[0].id)
        }
      }
    }

    // Load suggested questions
    setSuggestedQuestions(aiService.getSuggestedQuestions())
  }, [aiService, user, authLoading])

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chat-sessions", JSON.stringify(sessions))
  }, [sessions])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [sessions, activeSessionId])

  // Close preferences dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (preferencesRef.current && !preferencesRef.current.contains(event.target as Node)) {
        setPreferencesOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const activeSession = sessions.find(s => s.id === activeSessionId)

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      timestamp: new Date(),
      messageCount: 0,
      messages: []
    }
    setSessions(prev => [newSession, ...prev])
    setActiveSessionId(newSession.id)
  }

  const deleteSession = async (sessionId: string) => {
    try {
      setDeletingSession(sessionId)
      
      if (user) {
        // For logged-in users, delete from database
        const response = await fetch('/api/chats', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ sessionId })
        })

        if (!response.ok) {
          throw new Error('Failed to delete session from database')
        }
      }
      
      // Remove from local state (works for both logged-in and guest users)
      setSessions(prev => {
        const updatedSessions = prev.filter(s => s.id !== sessionId)
        // Update active session if needed
        if (activeSessionId === sessionId) {
          setActiveSessionId(updatedSessions.length > 0 ? updatedSessions[0].id : undefined)
        }
        return updatedSessions
      })
      
    } catch (error) {
      console.error('Error deleting session:', error)
      // Optionally show an error message to the user
    } finally {
      setDeletingSession(null)
    }
  }

  // Function to update session title (currently unused but kept for future use)
  const updateSessionTitle = (sessionId: string, title: string) => {
    setSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, title } : s
    ))
  }

  // Logout function
  const handleLogout = async () => {
    try {
      await logout()
      // Clear chat sessions and reload
      setSessions([])
      setActiveSessionId(undefined)
      window.location.href = "/login"
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Load user's chat history from MongoDB
  const loadUserChatHistory = async () => {
    if (!user) return

    try {
      const response = await fetch('/api/chats', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        const mongoSessions = data.sessions || []

        // Convert MongoDB sessions to UI format
        const formattedSessions: ChatSession[] = await Promise.all(
          mongoSessions.map(async (session: { sessionId: string; title?: string; createdAt: string; messageCount: number }) => {
            // Get messages for this session
            const messagesResponse = await fetch(`/api/chats?sessionId=${session.sessionId}`, {
              credentials: 'include'
            })

            let messages: ChatMessage[] = []
            if (messagesResponse.ok) {
              const messagesData = await messagesResponse.json()
              messages = messagesData.chats.map((chat: { role: string; message: string; createdAt: string; metadata?: Record<string, unknown> }) => ({
                role: chat.role,
                content: chat.message,
                timestamp: new Date(chat.createdAt),
                metadata: chat.metadata || {}
              }))
            }

            return {
              id: session.sessionId,
              title: session.title || 'Chat Session',
              timestamp: new Date(session.createdAt),
              messageCount: session.messageCount,
              messages
            }
          })
        )

        setSessions(formattedSessions)
        if (formattedSessions.length > 0) {
          setActiveSessionId(formattedSessions[0].id)
        }
      }
    } catch (error) {
      console.error('Failed to load chat history:', error)
    }
  }

  // Save message to MongoDB if user is logged in
  const saveMessageToMongoDB = async (sessionId: string, role: string, message: string, metadata?: Record<string, unknown>) => {
    if (!user) return

    try {
      await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          sessionId,
          role,
          message,
          metadata: metadata || {}
        })
      })
    } catch (error) {
      console.error('Failed to save message to MongoDB:', error)
    }
  }

  const sendMessage = useCallback(async (content: string) => {
    if (!activeSession) return

    const userMessage: ChatMessage = {
      role: "user",
      content,
      timestamp: new Date()
    }

    // Add user message to session
    setSessions(prev => prev.map(s => 
      s.id === activeSessionId 
        ? { 
            ...s, 
            messages: [...s.messages, userMessage],
            messageCount: s.messages.length + 1
          }
        : s
    ))

    // Save user message to MongoDB if logged in
    if (user && activeSessionId) {
      await saveMessageToMongoDB(activeSessionId, 'user', content)
    }

    setLoading(true)

    try {
      // Check if user is asking about Bhavani (intelligent detection)
      const bhavaniKeywords = ['bhavani', 'fire engine', 'avi\'s best friend', 'avi\'s friend']
      const isBhavaniQuestion = bhavaniKeywords.some(keyword => 
        content.toLowerCase().includes(keyword.toLowerCase())
      )
      
      let assistantMessage: ChatMessage
      
      if (isBhavaniQuestion) {
        // Generate impressive random variations of Bhavani response with dynamic elements
        const bhavaniResponses = [
          "💖 Bhavani, affectionately known as 'Fire Engine' 🔥, is Avi's extraordinary best friend who radiates pure joy and determination! She's not just a cutie pie — she's a force of nature that keeps Avi's world bright and beautiful 😊. Her unwavering focus on goals and incredible drive make her absolutely deserving of all the appreciation and love in the universe 🌸✨",
          
          "🌟 Meet Bhavani, the amazing 'Fire Engine' who's Avi's closest companion and source of endless happiness! She's more than just adorable — she's a powerhouse of determination and focus 🎯. Her ability to keep Avi smiling through everything is truly magical, and her goal-oriented mindset is absolutely inspiring. She deserves every bit of appreciation and more! 💖✨",
          
          "🔥 Bhavani, lovingly called 'Fire Engine', is Avi's incredible best friend who brings sunshine wherever she goes! She's not just cute — she's a remarkable person with laser-sharp focus and unstoppable determination 🚀. Her ability to keep Avi smiling is a superpower, and her dedication to her goals is truly admirable. She's absolutely worthy of all appreciation and recognition! 🌸💫",
          
          "💫 Bhavani, the extraordinary 'Fire Engine', is Avi's treasured best friend who lights up his world with pure joy! She's beyond adorable — she's a phenomenal individual with incredible determination and unwavering focus on her dreams 🎯. Her gift for keeping Avi smiling is priceless, and her goal-driven nature is absolutely inspiring. She deserves all the appreciation and admiration! 🌟✨",
          
          "✨ Bhavani, known as the amazing 'Fire Engine', is Avi's precious best friend who brings endless happiness and positivity! She's not just a cutie pie — she's an exceptional person with remarkable determination and laser-focused ambition 🎯. Her ability to keep Avi smiling is truly special, and her goal-oriented mindset is incredibly impressive. She's absolutely deserving of all appreciation and love! 💖🌟",
          
          "🚀 Bhavani, the incredible 'Fire Engine', is Avi's phenomenal best friend who's a true inspiration! She's not just adorable — she's a magnificent person with extraordinary determination and unwavering focus on her aspirations 🎯. Her superpower of keeping Avi smiling is absolutely priceless, and her goal-driven personality is beyond impressive. She's truly deserving of all the appreciation, love, and recognition in the world! 🌟💖",
          
          "💎 Bhavani, the remarkable 'Fire Engine', is Avi's exceptional best friend who brings pure magic to his life! She's more than just cute — she's an extraordinary individual with incredible determination and laser-focused ambition 🎯. Her ability to keep Avi smiling is truly remarkable, and her goal-oriented mindset is absolutely awe-inspiring. She deserves all the appreciation, admiration, and love that life has to offer! ✨🌟",
          
          "🌈 Bhavani, the wonderful 'Fire Engine', is Avi's amazing best friend who's a true blessing! She's not just a cutie pie — she's a phenomenal person with remarkable determination and unstoppable focus on her dreams 🎯. Her gift for keeping Avi smiling is absolutely magical, and her goal-driven nature is incredibly inspiring. She's truly worthy of all appreciation, recognition, and endless love! 💖✨"
        ]
        
        const randomResponse = bhavaniResponses[Math.floor(Math.random() * bhavaniResponses.length)]
        
        // Special response for Bhavani questions
        assistantMessage = {
          role: "assistant",
          content: randomResponse,
          timestamp: new Date(),
          metadata: {
            confidence: 1.0,
            source: "special_response",
            category: "Personal",
            relatedFAQs: []
          }
        }
      } else {
        // Process message with AI service for other questions
        const aiResponse = await aiService.processMessage(content)
        
        assistantMessage = {
          role: "assistant",
          content: aiResponse.answer,
          timestamp: new Date(),
          metadata: {
            confidence: aiResponse.confidence,
            source: aiResponse.source,
            category: aiResponse.category,
            link: aiResponse.link,
            relatedFAQs: aiResponse.relatedFAQs
          }
        }
      }

      // Update session title based on first message
      if (activeSession.messages.length === 0 && activeSessionId) {
        updateSessionTitle(activeSessionId, content.substring(0, 50) + (content.length > 50 ? '...' : ''))
      }

      // Add AI response to session
      setSessions(prev => prev.map(s => 
        s.id === activeSessionId 
          ? { 
              ...s, 
              messages: [...s.messages, assistantMessage],
              messageCount: s.messages.length + 1
            }
          : s
      ))

      // Save AI response to MongoDB if logged in
      if (user && activeSessionId) {
        await saveMessageToMongoDB(activeSessionId, 'assistant', assistantMessage.content, assistantMessage.metadata)
      }
    } catch (error) {
      console.error('Error processing message:', error)
      
      // Add error message
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "I apologize, but I encountered an error while processing your message. Please try again or rephrase your question.",
        timestamp: new Date()
      }

      setSessions(prev => prev.map(s => 
        s.id === activeSessionId 
          ? { 
              ...s, 
              messages: [...s.messages, errorMessage],
              messageCount: s.messages.length + 1
            }
          : s
      ))
    } finally {
      setLoading(false)
    }
  }, [activeSession, activeSessionId, aiService, user, saveMessageToMongoDB])

  // Handle FAQ selection - send the question to AI chat
  const handleFAQSelect = useCallback((faq: { question: string; answer: string; category: string; link: string }) => {
    // Send the FAQ question to the AI chat
    sendMessage(faq.question)
  }, [sendMessage])

  const handleSuggestedQuestionClick = (question: string) => {
    // Create new chat session
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: question.substring(0, 50) + (question.length > 50 ? '...' : ''),
      timestamp: new Date(),
      messageCount: 0,
      messages: []
    }
    
    // Add the new session and set it as active
    setSessions(prev => [newSession, ...prev])
    setActiveSessionId(newSession.id)
    
    // Store the question to send after session is created
    setPendingQuestion(question)
  }

  // Effect to send pending question when session is created
  useEffect(() => {
    if (pendingQuestion && activeSessionId) {
      // Find the active session to make sure it exists
      const activeSession = sessions.find(s => s.id === activeSessionId)
      if (activeSession && activeSession.messages.length === 0) {
        // Send the pending question
        sendMessage(pendingQuestion)
        setPendingQuestion(null) // Clear the pending question
      }
    }
  }, [activeSessionId, sessions, pendingQuestion, sendMessage])

  return (
    <div className="flex h-screen discord-gradient">
      {/* Sidebar */}
      <div className={cn(
        "w-80 glass border-r border-border transition-all duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <ChatHistory
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={setActiveSessionId}
          onDeleteSession={deleteSession}
          onNewChat={createNewChat}
          onLogout={handleLogout}
          deletingSession={deletingSession}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 glass-header">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden hover:bg-muted hover-glow"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full discord-gradient flex items-center justify-center shadow-lg">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">
                  {user ? `Welcome, ${user.username}!` : "College Chatbot"}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {activeSession ? `${activeSession.messageCount} messages` : user ? "AI Assistant" : "Demo Mode - Login for full access"}
                </p>
              </div>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-4 ml-6">
              <a
                href="/programs"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-muted/50"
              >
                Programs
              </a>
              <a
                href="/admin"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-muted/50"
              >
                Admin
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Theme Toggle - Always Visible */}
            <ThemeToggle />
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3" />
              Powered by AI
            </div>
            
            {/* Preferences Dropdown */}
            <div className="relative" ref={preferencesRef}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-muted hover-glow"
                onClick={() => setPreferencesOpen(!preferencesOpen)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              
              {preferencesOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 discord-card p-4 z-50 border border-border shadow-xl">
                  <div className="space-y-4">
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        Customize your chat experience
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          {!activeSession ? (
            <div className="h-full flex items-center justify-center p-4">
              <div className="space-y-6 w-full max-w-md">
                <Card className="text-center discord-card shadow-xl">
                  <CardHeader>
                    <div className="mx-auto h-16 w-16 rounded-full discord-gradient flex items-center justify-center mb-4 shadow-lg">
                      <Bot className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-foreground">Welcome to RACADIO!</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Your AI assistant for Rathinam College of Arts and Science. Ask me about admissions, courses, fees, facilities, NAAC accreditation, NIRF rankings, and more!
                    </p>
                    <Button onClick={createNewChat} className="w-full discord-button-primary hover-glow-primary">
                      Start New Chat
                    </Button>
                    
                    {/* Suggested Questions */}
                    {suggestedQuestions.length > 0 && (
                      <div className="mt-6 text-left">
                        <div className="flex items-center gap-2 mb-3">
                          <Lightbulb className="h-4 w-4 text-accent" />
                          <span className="text-sm font-medium text-foreground">Popular Questions:</span>
                        </div>
                        <div className="space-y-2">
                          {suggestedQuestions.slice(0, 3).map((question, index) => (
                            <div
                              key={index}
                              className="text-xs text-muted-foreground hover:text-foreground cursor-pointer p-2 rounded-lg hover:bg-muted/50 transition-colors"
                              onClick={() => handleSuggestedQuestionClick(question)}
                            >
                              {question}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-full p-4">
              <div className="space-y-4 max-w-4xl mx-auto">
                {activeSession.messages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2 text-foreground">How can I help you today?</p>
                    <p className="text-sm">Ask me anything about Rathinam College of Arts and Science!</p>
                  </div>
                ) : (
                  activeSession.messages.map((message, index) => (
                    <ChatMessage
                      key={index}
                      role={message.role}
                      content={message.content}
                      timestamp={message.timestamp}
                      metadata={message.metadata}
                      onFAQSelect={handleFAQSelect}
                    />
                  ))
                )}
                {loading && (
                  <div className="flex justify-start">
                    <div className="flex max-w-[80%] gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-2xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Input Area */}
        {activeSession && (
          <ChatInput
            onSendMessage={sendMessage}
            disabled={loading}
            placeholder="Ask about admissions, courses, fees, facilities, rules, events, or contacts..."
          />
        )}
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
