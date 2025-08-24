import { NextRequest, NextResponse } from 'next/server'
import { loggingService } from '@/lib/services/logging-service'

export async function POST(request: NextRequest) {
  try {
    // Get user info from token before clearing it
    const token = request.cookies.get('jwt')?.value
    let userId: string | undefined
    let username: string | undefined
    
    if (token) {
      try {
        const jwt = await import('jsonwebtoken')
        const decoded = jwt.default.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production') as { userId: string; username: string }
        userId = decoded.userId
        username = decoded.username
      } catch {
        // Token invalid, continue with logout
      }
    }

    const response = NextResponse.json({
      message: 'Logout successful'
    })

    // Clear the JWT cookie
    response.cookies.set('jwt', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      expires: new Date(0) // Set to past date
    })

    // Log logout if we have user info
    if (userId && username) {
      const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      await loggingService.logUserLogout(userId, username, ipAddress)
    }

    return response

  } catch (error) {
    console.error('Logout error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
