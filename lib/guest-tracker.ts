interface GuestSession {
  messageCount: number
  lastReset: Date
}

class GuestTracker {
  private sessions: Map<string, GuestSession> = new Map()
  private readonly GUEST_LIMIT = 3

  private cleanupOldSessions() {
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.lastReset < oneDayAgo) {
        this.sessions.delete(sessionId)
      }
    }
  }

  checkLimit(sessionId: string): { allowed: boolean; remaining: number; limit: number } {
    this.cleanupOldSessions()
    
    const now = new Date()
    const session = this.sessions.get(sessionId)
    
    if (!session) {
      // New session
      this.sessions.set(sessionId, {
        messageCount: 0,
        lastReset: now
      })
      return {
        allowed: true,
        remaining: this.GUEST_LIMIT,
        limit: this.GUEST_LIMIT
      }
    }

    // Check if 24 hours have passed since last reset
    const hoursSinceReset = (now.getTime() - session.lastReset.getTime()) / (1000 * 60 * 60)
    
    if (hoursSinceReset >= 24) {
      // Reset counter
      session.messageCount = 0
      session.lastReset = now
    }

    const remaining = Math.max(0, this.GUEST_LIMIT - session.messageCount)
    const allowed = remaining > 0

    return {
      allowed,
      remaining,
      limit: this.GUEST_LIMIT
    }
  }

  incrementCount(sessionId: string): boolean {
    const limitCheck = this.checkLimit(sessionId)
    
    if (!limitCheck.allowed) {
      return false
    }

    const session = this.sessions.get(sessionId)!
    session.messageCount += 1
    return true
  }

  getSessionInfo(sessionId: string): { messageCount: number; lastReset: Date; limit: number } {
    this.cleanupOldSessions()
    
    const session = this.sessions.get(sessionId)
    if (!session) {
      return {
        messageCount: 0,
        lastReset: new Date(),
        limit: this.GUEST_LIMIT
      }
    }

    return {
      messageCount: session.messageCount,
      lastReset: session.lastReset,
      limit: this.GUEST_LIMIT
    }
  }

  // For debugging and monitoring
  getAllSessions(): Map<string, GuestSession> {
    this.cleanupOldSessions()
    return new Map(this.sessions)
  }
}

// Export singleton instance
export const guestTracker = new GuestTracker()
