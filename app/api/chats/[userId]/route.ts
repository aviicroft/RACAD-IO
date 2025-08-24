import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Chat from '@/lib/models/Chat'
import { withAuthAppRouter, JWTPayload } from '@/lib/auth-app-router'

async function handler(
  req: NextRequest & { user: JWTPayload },
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await dbConnect()
    const { userId } = await params

    if (req.method === 'GET') {
      const { searchParams } = new URL(req.url)
      const limit = parseInt(searchParams.get('limit') || '50')
      const offset = parseInt(searchParams.get('offset') || '0')
      const sessionId = searchParams.get('sessionId')
      const role = searchParams.get('role')

      // Validate user access (users can only access their own chats)
      if (req.user?.userId !== userId && req.user?.role !== 'admin') {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        )
      }

      // Build query
      const query: { userId: string; sessionId?: string; role?: string } = { userId }
      if (sessionId) query.sessionId = sessionId
      if (role && ['user', 'assistant'].includes(role)) query.role = role

      // Get chat history with pagination
      const chats = await Chat.find(query)
        .sort({ createdAt: -1 }) // Most recent first
        .limit(limit)
        .skip(offset)
        .select('-__v')
        .populate('userId', 'username email avatar')

      // Get total count for pagination
      const total = await Chat.countDocuments(query)

      return NextResponse.json({
        chats,
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      })

    } else if (req.method === 'DELETE') {
      // Delete specific chat messages (optional feature)
      const { messageIds } = await req.json()

      if (!Array.isArray(messageIds) || messageIds.length === 0) {
        return NextResponse.json(
          { error: 'Message IDs array is required' },
          { status: 400 }
        )
      }

      // Validate user access
      if (req.user?.userId !== userId && req.user?.role !== 'admin') {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        )
      }

      // Delete messages
      const result = await Chat.deleteMany({
        _id: { $in: messageIds },
        userId
      })

      return NextResponse.json({
        message: 'Chat messages deleted successfully',
        deletedCount: result.deletedCount
      })

    } else {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      )
    }

  } catch (error) {
    console.error('Chat history API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
export const GET = withAuthAppRouter(handler)
export const DELETE = withAuthAppRouter(handler)

