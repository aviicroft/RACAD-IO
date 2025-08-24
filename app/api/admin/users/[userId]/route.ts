import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'
import Chat from '@/lib/models/Chat'
import { createSystemLog } from '@/lib/system-logger'

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

// GET - Get user details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const admin = await verifyAdminToken(req)
    if (!admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    await dbConnect()
    const { userId } = await params

    const user = await User.findById(userId).select('-passwordHash').lean() as {
      _id: string;
      username: string;
      email: string;
      role: string;
      isActive: boolean;
      messageCount: number;
      lastReset: Date;
      createdAt: Date;
      lastLogin?: Date;
      avatar?: string;
      bio?: string;
    } | null
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user's chat statistics
    const chatStats = await Chat.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          totalMessages: { $sum: 1 },
          lastMessage: { $max: '$createdAt' },
          sessionsCount: { $addToSet: '$sessionId' }
        }
      }
    ])

    const stats = chatStats[0] || { totalMessages: 0, lastMessage: null, sessionsCount: [] }

    await createSystemLog({
      action: 'ADMIN_VIEW_USER_DETAILS',
      adminId: admin.userId,
      userId: userId,
      details: `Admin ${admin.username} viewed details for user: ${user.username}`,
      severity: 'info'
    })

    return NextResponse.json({
      user,
      stats: {
        totalMessages: stats.totalMessages,
        totalSessions: stats.sessionsCount.length,
        lastMessage: stats.lastMessage
      }
    })
  } catch (error) {
    console.error('Admin user details error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Update user
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const admin = await verifyAdminToken(req)
    if (!admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    await dbConnect()
    const { userId } = await params
    const updates = await req.json()

    // Don't allow updating sensitive fields directly
    const allowedUpdates = ['username', 'email', 'role', 'isActive', 'messageCount']
    const sanitizedUpdates: Record<string, unknown> = {}
    
    for (const key of allowedUpdates) {
      if (key in updates) {
        sanitizedUpdates[key] = updates[key]
      }
    }

    if (Object.keys(sanitizedUpdates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Prevent admins from demoting themselves
    if (userId === admin.userId && sanitizedUpdates.role && sanitizedUpdates.role !== 'admin') {
      return NextResponse.json({ error: 'Cannot change your own admin role' }, { status: 400 })
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      sanitizedUpdates,
      { new: true, runValidators: true }
    ).select('-passwordHash')

    await createSystemLog({
      action: 'ADMIN_UPDATE_USER',
      adminId: admin.userId,
      userId: userId,
      details: `Admin ${admin.username} updated user ${user.username}: ${JSON.stringify(sanitizedUpdates)}`,
      severity: 'info'
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('Admin update user error:', error)
    
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError' && 'errors' in error) {
      const errorObj = error as { errors: Record<string, { message: string }> }
      const validationErrors = Object.values(errorObj.errors).map((err) => err.message)
      return NextResponse.json(
        { error: `Validation failed: ${validationErrors.join(', ')}` },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

// DELETE - Delete user
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const admin = await verifyAdminToken(req)
    if (!admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    await dbConnect()
    const { userId } = await params

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Prevent admins from deleting themselves
    if (userId === admin.userId) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
    }

    // Prevent deleting other admins (optional security measure)
    if (user.role === 'admin') {
      return NextResponse.json({ error: 'Cannot delete admin accounts' }, { status: 400 })
    }

    // Delete user's chat history first
    await Chat.deleteMany({ userId: userId })

    // Delete the user
    await User.findByIdAndDelete(userId)

    await createSystemLog({
      action: 'ADMIN_DELETE_USER',
      adminId: admin.userId,
      userId: userId,
      details: `Admin ${admin.username} deleted user: ${user.username} (${user.email})`,
      severity: 'warning'
    })

    return NextResponse.json({ 
      message: 'User deleted successfully',
      deletedUser: {
        id: userId,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Admin delete user error:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
