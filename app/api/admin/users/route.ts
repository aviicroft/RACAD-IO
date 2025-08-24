import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'
import { loggingService } from '@/lib/services/logging-service'

interface JWTPayload {
  userId: string
  username: string
  email: string
  role: string
  iat: number
  exp: number
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'

// Verify admin token
async function verifyAdminToken(req: NextRequest): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('jwt')?.value
    
    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    
    if (decoded.role !== 'admin') {
      return null
    }

    return decoded
  } catch {
    return null
  }
}

// GET - List all users
export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdminToken(req)
    if (!admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    await dbConnect()

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role')
    const status = searchParams.get('status')

    // Build query
    const query: Record<string, unknown> = {}
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }
    
    if (role && role !== 'all') {
      query.role = role
    }
    
    if (status === 'active') {
      query.isActive = true
    } else if (status === 'inactive') {
      query.isActive = false
    }

    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-passwordHash')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query)
    ])

    // Log admin action
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    await loggingService.logAdminAction(
      admin.userId,
      admin.username,
      'VIEW_USERS',
      undefined,
      `Viewed user list (page ${page}, ${users.length} users)`,
      ipAddress
    )

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Admin users API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new user
export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdminToken(req)
    if (!admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    await dbConnect()

    const { username, email, password, role = 'user' } = await req.json()

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Username, email, and password are required' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email or username already exists' }, { status: 409 })
    }

    // Create user
    const bcryptjs = await import('bcryptjs')
    const passwordHash = await bcryptjs.default.hash(password, 12)

    const newUser = await User.create({
      username,
      email,
      passwordHash,
      role,
      isActive: true,
      messageCount: 0,
      lastReset: new Date()
    })

    // Log admin action
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    await loggingService.logAdminAction(
      admin.userId,
      admin.username,
      'CREATE_USER',
      `${username} (${email})`,
      `Created new user with role: ${role}`,
      ipAddress
    )

    // Return user without password hash
    const userResponse = await User.findById(newUser._id).select('-passwordHash').lean()

    return NextResponse.json({ user: userResponse }, { status: 201 })
  } catch (error) {
    console.error('Admin create user error:', error)
    
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError' && 'errors' in error) {
      const errorObj = error as { errors: Record<string, { message: string }> }
      const validationErrors = Object.values(errorObj.errors).map((err) => err.message)
      return NextResponse.json(
        { error: `Validation failed: ${validationErrors.join(', ')}` },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
