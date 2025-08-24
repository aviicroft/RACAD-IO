import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import Chat from '@/lib/models/Chat'
import User from '@/lib/models/User'
import { loggingService } from '@/lib/services/logging-service'

// Save chat message
export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const cookieStore = await cookies()
    const token = cookieStore.get('jwt')?.value

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const user = await User.findById(decoded.userId)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { sessionId, role, message, metadata } = body

    if (!sessionId || !role || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const chatMessage = new Chat({
      userId: user._id,
      sessionId,
      role,
      message,
      metadata: metadata || {}
    })

    await chatMessage.save()

    // Log chat message
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    await loggingService.logChatMessage(
      user._id.toString(),
      user.username,
      sessionId,
      message.length,
      ipAddress
    )

    return NextResponse.json({
      message: 'Chat message saved successfully',
      chat: chatMessage
    })

  } catch (error) {
    console.error('Save chat error:', error)
    return NextResponse.json(
      { error: 'Failed to save chat message' },
      { status: 500 }
    )
  }
}

// Get user's chat sessions
export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const cookieStore = await cookies()
    const token = cookieStore.get('jwt')?.value

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const user = await User.findById(decoded.userId)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (sessionId) {
      // Get specific session messages
      const chats = await Chat.find({ userId: user._id, sessionId })
        .sort({ createdAt: 1 })
        .select('-__v')

      return NextResponse.json({
        chats,
        sessionId
      })
    } else {
      // Get all user's chat sessions grouped by sessionId
      const chatSessions = await Chat.aggregate([
        { $match: { userId: user._id } },
        {
          $group: {
            _id: '$sessionId',
            lastMessage: { $last: '$message' },
            messageCount: { $sum: 1 },
            createdAt: { $min: '$createdAt' },
            updatedAt: { $max: '$createdAt' }
          }
        },
        { $sort: { updatedAt: -1 } },
        {
          $project: {
            sessionId: '$_id',
            title: { $substr: ['$lastMessage', 0, 50] },
            messageCount: '$messageCount',
            createdAt: '$createdAt',
            updatedAt: '$updatedAt'
          }
        }
      ])

      return NextResponse.json({
        sessions: chatSessions
      })
    }

  } catch (error) {
    console.error('Get chats error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve chat history' },
      { status: 500 }
    )
  }
}

// Delete chat session and all its messages
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect()
    
    const cookieStore = await cookies()
    const token = cookieStore.get('jwt')?.value

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const user = await User.findById(decoded.userId)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    // Delete all chat messages for this session
    const deleteResult = await Chat.deleteMany({ 
      userId: user._id, 
      sessionId 
    })

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Log the deletion
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    await loggingService.logChatMessage(
      user._id.toString(),
      user.username,
      sessionId,
      0, // No message content for deletion
      ipAddress
    )

    return NextResponse.json({
      message: 'Chat session deleted successfully',
      deletedCount: deleteResult.deletedCount
    })

  } catch (error) {
    console.error('Delete chat session error:', error)
    return NextResponse.json(
      { error: 'Failed to delete chat session' },
      { status: 500 }
    )
  }
}