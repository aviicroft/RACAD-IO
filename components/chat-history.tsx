import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Trash2, Clock, Bot, User, LogOut, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"

interface ChatSession {
  id: string
  title: string
  timestamp: Date
  messageCount: number
}

interface ChatHistoryProps {
  sessions: ChatSession[]
  activeSessionId?: string
  onSelectSession: (sessionId: string) => void
  onDeleteSession: (sessionId: string) => void
  onNewChat: () => void
  onLogout?: () => void
  deletingSession?: string | null
}

export function ChatHistory({ 
  sessions, 
  activeSessionId, 
  onSelectSession, 
  onDeleteSession, 
  onNewChat,
  onLogout,
  deletingSession
}: ChatHistoryProps) {
  const [isClient, setIsClient] = useState(false)
  const { user } = useAuth()
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  return (
    <div className="flex flex-col h-full">
      {/* Header with New Chat button */}
      <div className="p-6 border-b border-border glass">
        <Button 
          onClick={onNewChat} 
          className="w-full discord-button-primary font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover-glow-primary"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>
      
      {/* Sessions list */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {sessions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Bot className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium mb-2 text-foreground">No chat history yet</p>
              <p className="text-xs text-muted-foreground">Start a new conversation!</p>
            </div>
          ) : (
            sessions.map((session) => (
              <Card
                key={session.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-lg border-0 shadow-sm discord-card hover:bg-muted/50 backdrop-blur-sm",
                  activeSessionId === session.id && "ring-2 ring-accent bg-muted/50 shadow-xl"
                )}
                onClick={() => onSelectSession(session.id)}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-medium line-clamp-2 text-foreground">
                      {session.title}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all duration-200 hover-glow"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm(`Are you sure you want to delete "${session.title}"? This action cannot be undone.`)) {
                          onDeleteSession(session.id)
                        }
                      }}
                      disabled={deletingSession === session.id}
                    >
                      {deletingSession === session.id ? (
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {session.messageCount} messages
                    </span>
                    {isClient && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {session.timestamp.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
      
      {/* User Section - Bottom */}
      <div className="p-4 border-t border-border glass">
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200">
          <div className="h-8 w-8 rounded-full discord-gradient flex items-center justify-center shadow-lg">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user ? user.username : "Guest User"}
            </p>
            <p className="text-xs text-muted-foreground">
              {user ? "Logged In" : "Demo Mode"}
            </p>
          </div>
        </div>
        
        {/* Admin Dashboard Button - Only for admins */}
        {user && user.role === 'admin' && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
            onClick={() => window.location.href = "/admin"}
          >
            <Shield className="h-4 w-4 mr-2" />
            Admin Dashboard
          </Button>
        )}
        
        {/* Login/Logout Button */}
        {user ? (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
            onClick={() => window.location.href = "/login"}
          >
            <User className="h-4 w-4 mr-2" />
            Sign In
          </Button>
        )}
      </div>
    </div>
  )
}
