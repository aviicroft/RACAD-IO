import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '../auth'
import User from '../models/User'
import dbConnect from '../mongodb'
import { guestTracker } from '../guest-tracker'

export interface MessageLimitConfig {
  guestLimit: number
  userLimit: number
  premiumLimit: number
}

const DEFAULT_LIMITS: MessageLimitConfig = {
  guestLimit: 3,
  userLimit: 20,
  premiumLimit: -1 // -1 means unlimited
}

export async function checkMessageLimit(
  request: NextRequest,
  limits: MessageLimitConfig = DEFAULT_LIMITS
): Promise<{ allowed: boolean; remaining: number; limit: number; error?: string }> {
  try {
    await dbConnect()
    
    // Extract JWT token from cookies
    const token = request.cookies.get('jwt')?.value
    
    if (!token) {
      // Guest user - check against guest limit
      const guestLimit = guestTracker.checkLimit('guest-session') // You can pass actual sessionId here
      return {
        allowed: guestLimit.allowed,
        remaining: guestLimit.remaining,
        limit: guestLimit.limit
      }
    }

    // Verify token and get user
    const payload = verifyToken(token)
    if (!payload) {
      return {
        allowed: false,
        remaining: 0,
        limit: limits.guestLimit,
        error: 'Invalid token'
      }
    }

    const user = await User.findById(payload.userId)
    if (!user || !user.isActive) {
      return {
        allowed: false,
        remaining: 0,
        limit: limits.guestLimit,
        error: 'User not found or inactive'
      }
    }

    // Check and reset message count if needed (24-hour reset)
    const now = new Date()
    const lastReset = new Date(user.lastReset)
    const hoursSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60)
    
    if (hoursSinceReset >= 24) {
      user.messageCount = 0
      user.lastReset = now
      await user.save()
    }

    // Determine user's limit based on role
    let userLimit: number
    switch (user.role) {
      case 'premium':
        userLimit = limits.premiumLimit
        break
      case 'admin':
        userLimit = limits.premiumLimit // Admins get unlimited
        break
      default:
        userLimit = limits.userLimit
    }

    // Check if user has exceeded their limit
    if (userLimit === -1) {
      // Unlimited
      return {
        allowed: true,
        remaining: -1,
        limit: -1
      }
    }

    const remaining = Math.max(0, userLimit - user.messageCount)
    const allowed = remaining > 0

    return {
      allowed,
      remaining,
      limit: userLimit
    }

  } catch (error) {
    console.error('Message limit check error:', error)
    return {
      allowed: false,
      remaining: 0,
      limit: limits.guestLimit,
      error: 'Failed to check message limit'
    }
  }
}

export async function incrementMessageCount(userId: string): Promise<void> {
  try {
    await dbConnect()
    
    const user = await User.findById(userId)
    if (user) {
      user.messageCount += 1
      await user.save()
    }
  } catch (error) {
    console.error('Failed to increment message count:', error)
  }
}

export async function getGuestMessageCount(sessionId: string): Promise<number> {
  const sessionInfo = guestTracker.getSessionInfo(sessionId)
  return sessionInfo.messageCount
}

export function incrementGuestMessageCount(sessionId: string): boolean {
  return guestTracker.incrementCount(sessionId)
}
