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

    const { username, email, password } = body

    // Enhanced validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      )
    }

    // Username validation
    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters long' },
        { status: 400 }
      )
    }

    if (username.length > 30) {
      return NextResponse.json(
        { error: 'Username cannot exceed 30 characters' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Password validation
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists (case-insensitive)
    const existingUser = await User.findOne({
      $or: [
        { username: { $regex: new RegExp(`^${username}$`, 'i') } },
        { email: { $regex: new RegExp(`^${email}$`, 'i') } }
      ]
    })

    if (existingUser) {
      if (existingUser.email.toLowerCase() === email.toLowerCase()) {
        return NextResponse.json(
          { error: 'This email is already registered. Please use a different email or try logging in.' },
          { status: 409 }
        )
      }
      if (existingUser.username.toLowerCase() === username.toLowerCase()) {
        return NextResponse.json(
          { error: 'This username is already taken. Please choose a different username.' },
          { status: 409 }
        )
      }
    }

    // Hash password
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Create user with lowercase username and email
    const user = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      passwordHash,
      lastLogin: new Date()
    })

    await user.save()

    // Log successful registration
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    await loggingService.logUserRegister(user._id.toString(), user.username, user.email, ipAddress, userAgent)

    // Generate JWT token
    const token = generateToken(user)

    // Return user data (without password) and token
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    }

    const response = NextResponse.json({
      message: 'Account created successfully! Welcome aboard!',
      user: userResponse,
      token
    }, { status: 201 })

    // Set HTTP-only cookie with JWT
    response.cookies.set('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    return response

  } catch (error) {
    console.error('Registration error:', error)
    
    // Handle Mongoose validation errors
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError' && 'errors' in error) {
      const errorObj = error as { errors: Record<string, { message: string }> }
      const validationErrors = Object.values(errorObj.errors).map((err) => err.message)
      return NextResponse.json(
        { error: `Validation failed: ${validationErrors.join(', ')}` },
        { status: 400 }
      )
    }

    // Handle duplicate key errors
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000 && 'keyPattern' in error) {
      const errorObj = error as { keyPattern: Record<string, unknown> }
      const field = Object.keys(errorObj.keyPattern)[0]
      if (field === 'username') {
        return NextResponse.json(
          { error: 'This username is already taken. Please choose a different username.' },
          { status: 409 }
        )
      }
      if (field === 'email') {
        return NextResponse.json(
          { error: 'This email is already registered. Please use a different email or try logging in.' },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Registration failed. Please try again later.' },
      { status: 500 }
    )
  }
}
