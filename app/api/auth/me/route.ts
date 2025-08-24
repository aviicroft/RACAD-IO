import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const cookieStore = await cookies()
    const token = cookieStore.get('jwt')?.value
    
    console.log('Auth/me - Token found:', !!token)

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production') as { userId: string; role: string }
    console.log('Auth/me - Token decoded:', { userId: decoded.userId, role: decoded.role })
    
    const user = await User.findById(decoded.userId).select('-passwordHash')
    console.log('Auth/me - User found:', { found: !!user, role: user?.role })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        messageCount: user.messageCount,
        lastReset: user.lastReset,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        lastLoginIP: user.lastLoginIP
      }
    })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
  }
}
