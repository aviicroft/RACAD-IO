import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import User from '@/lib/models/User'
import Chat from '@/lib/models/Chat'
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

// GET - Get dashboard statistics
export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdminToken(req)
    if (!admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    await dbConnect()

    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Get basic user statistics
    const [totalUsers, activeUsers, newUsersToday] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ createdAt: { $gte: startOfToday } })
    ])

    // Get message statistics
    const [totalMessages, messagesToday, messagesThisWeek] = await Promise.all([
      Chat.countDocuments({}),
      Chat.countDocuments({ createdAt: { $gte: startOfToday } }),
      Chat.countDocuments({ createdAt: { $gte: startOfWeek } })
    ])

    // Get system error count
    const systemErrors = await SystemLog.countDocuments({
      severity: 'error',
      timestamp: { $gte: startOfToday }
    })

    // Calculate average messages per day
    const messagesPerDay = Math.round(messagesThisWeek / 7)

    // Get user growth data for the last 30 days
    const userGrowthData = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ])

    // Get message activity data for the last 7 days
    const messageActivityData = await Chat.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfWeek }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ])

    // Get top users by message count
    const topUsers = await User.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $sort: { messageCount: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          username: 1,
          email: 1,
          messageCount: 1,
          role: 1,
          createdAt: 1
        }
      }
    ])

    // Get role distribution
    const roleDistribution = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ])

    // Get recent activity (last 24 hours)
    const recentActivity = await SystemLog.find({
      timestamp: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) }
    })
    .sort({ timestamp: -1 })
    .limit(20)
    .populate('userId', 'username')
    .populate('adminId', 'username')
    .lean()

    // Get chat session statistics
    const sessionStats = await Chat.aggregate([
      {
        $group: {
          _id: '$sessionId',
          messageCount: { $sum: 1 },
          userId: { $first: '$userId' },
          createdAt: { $min: '$createdAt' }
        }
      },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          avgMessagesPerSession: { $avg: '$messageCount' },
          uniqueUsers: { $addToSet: '$userId' }
        }
      }
    ])

    const sessionStatsResult = sessionStats[0] || {
      totalSessions: 0,
      avgMessagesPerSession: 0,
      uniqueUsers: []
    }

    // Log admin action
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    await loggingService.logAdminAction(
      admin.userId,
      admin.username,
      'VIEW_STATS',
      undefined,
      `Viewed dashboard statistics (${totalUsers} users, ${totalMessages} messages)`,
      ipAddress
    )

    return NextResponse.json({
      overview: {
        totalUsers,
        activeUsers,
        newUsersToday,
        totalMessages,
        messagesToday,
        messagesPerDay,
        systemErrors,
        totalSessions: sessionStatsResult.totalSessions,
        avgMessagesPerSession: Math.round(sessionStatsResult.avgMessagesPerSession || 0),
        uniqueActiveUsers: sessionStatsResult.uniqueUsers.length
      },
      charts: {
        userGrowth: userGrowthData,
        messageActivity: messageActivityData,
        roleDistribution: roleDistribution.map(role => ({
          role: role._id,
          count: role.count,
          percentage: Math.round((role.count / totalUsers) * 100)
        }))
      },
      insights: {
        topUsers,
        recentActivity
      },
      // Backward compatibility with the frontend
      totalUsers,
      activeUsers,
      totalMessages,
      newUsersToday,
      messagesPerDay,
      systemErrors
    })
  } catch (error) {
    console.error('Admin stats API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
