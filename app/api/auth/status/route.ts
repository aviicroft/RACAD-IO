import { NextRequest, NextResponse } from 'next/server'
import { withOptionalAuthAppRouter } from '@/lib/auth-app-router'
import { checkMessageLimit } from '@/lib/middleware/message-limits'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'

async function handler(req: NextRequest & { user?: { userId: string; username: string; role: string } }) {
  try {
    await dbConnect()

    if (req.method !== 'GET') {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      )
    }

    // Check message limits
    const limitCheck = await checkMessageLimit(req)
    
    if (req.user?.userId) {
      // Authenticated user
      const user = await User.findById(req.user.userId).select('-passwordHash')
      
      if (!user) {
        return NextResponse.json({
          authenticated: false,
          error: 'User not found'
        }, { status: 404 })
      }

      return NextResponse.json({
        authenticated: true,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          bio: user.bio,
          messageCount: user.messageCount,
          lastReset: user.lastReset,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        },
        limits: {
          remaining: limitCheck.remaining,
          limit: limitCheck.limit,
          isUnlimited: limitCheck.limit === -1
        }
      })
    } else {
      // Guest user
      return NextResponse.json({
        authenticated: false,
        limits: {
          remaining: limitCheck.remaining,
          limit: limitCheck.limit,
          isUnlimited: false
        },
        message: 'Sign up to get more messages per day!'
      })
    }

  } catch (error) {
    console.error('Status check error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
export const GET = withOptionalAuthAppRouter(handler)

