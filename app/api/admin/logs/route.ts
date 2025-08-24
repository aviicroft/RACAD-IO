import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import SystemLog from '@/lib/models/SystemLog'
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

// GET - Get system logs
export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdminToken(req)
    if (!admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    await dbConnect()

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '100')
    const severity = searchParams.get('severity')
    const action = searchParams.get('action')
    const userId = searchParams.get('userId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build query
    const query: {
      severity?: string;
      action?: { $regex: string; $options: string };
      $or?: Array<{ userId: string } | { adminId: string }>;
      timestamp?: {
        $gte?: Date;
        $lte?: Date;
      };
    } = {}
    
    if (severity && severity !== 'all') {
      query.severity = severity
    }
    
    if (action) {
      query.action = { $regex: action, $options: 'i' }
    }
    
    if (userId) {
      query.$or = [
        { userId: userId },
        { adminId: userId }
      ]
    }
    
    if (startDate || endDate) {
      query.timestamp = {}
      if (startDate) {
        query.timestamp.$gte = new Date(startDate)
      }
      if (endDate) {
        query.timestamp.$lte = new Date(endDate)
      }
    }

    const skip = (page - 1) * limit

    const [logs, total] = await Promise.all([
      SystemLog.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'username email')
        .populate('adminId', 'username email')
        .lean(),
      SystemLog.countDocuments(query)
    ])

    // Process logs to ensure proper structure
    const processedLogs = logs.map(log => {
      const processedLog = { ...log }
      
      // Handle populated userId field
      if (log.userId && typeof log.userId === 'object' && log.userId.username) {
        processedLog.user = {
          username: log.userId.username,
          email: log.userId.email || ''
        }
        processedLog.userId = log.userId._id || log.userId
      }
      
      // Handle populated adminId field
      if (log.adminId && typeof log.adminId === 'object' && log.adminId.username) {
        processedLog.admin = {
          username: log.adminId.username,
          email: log.adminId.email || ''
        }
        processedLog.adminId = log.adminId._id || log.adminId
      }
      
      return processedLog
    })

    // Log admin action
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    await loggingService.logAdminAction(
      admin.userId,
      admin.username,
      'VIEW_LOGS',
      undefined,
      `Viewed system logs (page ${page}, ${logs.length} logs, total: ${total})`,
      ipAddress
    )

    return NextResponse.json({
      logs: processedLogs,
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
    console.error('Admin logs API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Clear logs (with filters)
export async function DELETE(req: NextRequest) {
  try {
    const admin = await verifyAdminToken(req)
    if (!admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    await dbConnect()

    const { severity, olderThan } = await req.json()

    const query: Record<string, unknown> = {}
    
    if (severity && severity !== 'all') {
      query.severity = severity
    }
    
    if (olderThan) {
      query.timestamp = { $lt: new Date(olderThan) }
    }

    const deletedCount = await SystemLog.deleteMany(query)

    // Log this action
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    await loggingService.logAdminAction(
      admin.userId,
      admin.username,
      'CLEAR_LOGS',
      undefined,
      `Cleared ${deletedCount.deletedCount} system logs`,
      ipAddress
    )

    return NextResponse.json({ 
      message: 'Logs cleared successfully',
      deletedCount: deletedCount.deletedCount
    })
  } catch (error) {
    console.error('Admin clear logs error:', error)
    return NextResponse.json({ error: 'Failed to clear logs' }, { status: 500 })
  }
}
