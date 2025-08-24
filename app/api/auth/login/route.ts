import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'
import { generateToken } from '@/lib/auth'
import { loggingService } from '@/lib/services/logging-service'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    // Check if request has body
    if (!request.body) {
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      )
    }

    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Username/Email and password are required' },
        { status: 400 }
      )
    }

    // Find user by username or email (case-insensitive)
    const user = await User.findOne({
      $or: [
        { username: email.toLowerCase() },
        { email: email.toLowerCase() }
      ]
    }).select('+passwordHash')
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username/email or password' },
        { status: 401 }
      )
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated. Please contact support.' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    
    if (!isPasswordValid) {
      // Log failed login attempt
      const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      const userAgent = request.headers.get('user-agent') || 'unknown'
      
      await loggingService.logLoginAttempt(email, false, ipAddress, userAgent, 'Invalid password')
      
      return NextResponse.json(
        { error: 'Invalid username/email or password' },
        { status: 401 }
      )
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

    // Update last login and IP address
    user.lastLogin = now
    user.lastLoginIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    await user.save()

    // Generate JWT token
    const token = generateToken(user)

    // Log successful login
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    await loggingService.logUserLogin(user._id.toString(), user.username, ipAddress, userAgent)

    // Return user data (without password) and token
    const userResponse = {
      _id: user._id,
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

    const response = NextResponse.json({
      message: 'Login successful',
      user: userResponse,
      token
    })

    // Set HTTP-only cookie with JWT
    response.cookies.set('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    
    // Log more details for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}
