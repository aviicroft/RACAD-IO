import Chat, { IChat } from '../models/Chat'
import { Types } from 'mongoose'

export interface ChatMessage {
  userId: string
  sessionId: string
  role: 'user' | 'assistant'
  message: string
  metadata?: Record<string, unknown>
}

export interface ChatHistoryOptions {
  limit?: number
  offset?: number
  sessionId?: string
  role?: 'user' | 'assistant'
  startDate?: Date
  endDate?: Date
}

export class ChatService {
  /**
   * Save a chat message
   */
  static async saveMessage(chatData: ChatMessage): Promise<IChat> {
    const chat = new Chat(chatData)
    await chat.save()
    return chat
  }

  /**
   * Save multiple chat messages (for batch operations)
   */
  static async saveMessages(messages: ChatMessage[]): Promise<IChat[]> {
    const chats = messages.map(msg => new Chat(msg))
    const savedChats = await Chat.insertMany(chats)
    return savedChats
  }

  /**
   * Get chat history for a user
   */
  static async getChatHistory(
    userId: string,
    options: ChatHistoryOptions = {}
  ): Promise<{
    chats: IChat[]
    total: number
    hasMore: boolean
  }> {
    const {
      limit = 50,
      offset = 0,
      sessionId,
      role,
      startDate,
      endDate
    } = options

    // Build query
    const query: {
      userId: Types.ObjectId;
      sessionId?: string;
      role?: string;
      createdAt?: {
        $gte?: Date;
        $lte?: Date;
      };
    } = { userId: new Types.ObjectId(userId) }
    
    if (sessionId) query.sessionId = sessionId
    if (role) query.role = role
    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) query.createdAt.$gte = startDate
      if (endDate) query.createdAt.$lte = endDate
    }

    // Get chats with pagination
    const chats = await Chat.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .select('-__v')

    // Get total count
    const total = await Chat.countDocuments(query)

    return {
      chats,
      total,
      hasMore: offset + limit < total
    }
  }

  /**
   * Get chat history for a specific session
   */
  static async getSessionHistory(
    userId: string,
    sessionId: string,
    limit: number = 100
  ): Promise<IChat[]> {
    return Chat.find({
      userId: new Types.ObjectId(userId),
      sessionId
    })
      .sort({ createdAt: 1 }) // Chronological order for session
      .limit(limit)
      .select('-__v')
  }

  /**
   * Get recent sessions for a user
   */
  static async getRecentSessions(
    userId: string,
    limit: number = 10
  ): Promise<Array<{
    sessionId: string
    lastMessage: string
    lastMessageTime: Date
    messageCount: number
  }>> {
    const sessions = await Chat.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$sessionId',
          lastMessage: { $first: '$message' },
          lastMessageTime: { $first: '$createdAt' },
          messageCount: { $sum: 1 }
        }
      },
      { $sort: { lastMessageTime: -1 } },
      { $limit: limit }
    ])

    return sessions.map(session => ({
      sessionId: session._id,
      lastMessage: session.lastMessage,
      lastMessageTime: session.lastMessageTime,
      messageCount: session.messageCount
    }))
  }

  /**
   * Search chat messages
   */
  static async searchMessages(
    userId: string,
    query: string,
    options: {
      limit?: number
      offset?: number
      sessionId?: string
    } = {}
  ): Promise<{
    chats: IChat[]
    total: number
    hasMore: boolean
  }> {
    const { limit = 20, offset = 0, sessionId } = options

    // Build search query
    const searchQuery: {
      userId: Types.ObjectId;
      $text: { $search: string };
      sessionId?: string;
    } = {
      userId: new Types.ObjectId(userId),
      $text: { $search: query }
    }

    if (sessionId) searchQuery.sessionId = sessionId

    // Get search results
    const chats = await Chat.find(searchQuery)
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .skip(offset)
      .select('-__v')

    // Get total count
    const total = await Chat.countDocuments(searchQuery)

    return {
      chats,
      total,
      hasMore: offset + limit < total
    }
  }

  /**
   * Delete chat messages
   */
  static async deleteMessages(
    userId: string,
    messageIds: string[]
  ): Promise<number> {
    const result = await Chat.deleteMany({
      _id: { $in: messageIds.map(id => new Types.ObjectId(id)) },
      userId: new Types.ObjectId(userId)
    })

    return result.deletedCount || 0
  }

  /**
   * Delete entire session
   */
  static async deleteSession(
    userId: string,
    sessionId: string
  ): Promise<number> {
    const result = await Chat.deleteMany({
      userId: new Types.ObjectId(userId),
      sessionId
    })

    return result.deletedCount || 0
  }

  /**
   * Get chat statistics for a user
   */
  static async getUserChatStats(userId: string): Promise<{
    totalMessages: number
    totalSessions: number
    averageMessagesPerSession: number
    mostActiveSession: string | null
    lastActivity: Date | null
  }> {
    const stats = await Chat.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalMessages: { $sum: 1 },
          totalSessions: { $addToSet: '$sessionId' },
          lastActivity: { $max: '$createdAt' }
        }
      },
      {
        $project: {
          totalMessages: 1,
          totalSessions: { $size: '$totalSessions' },
          lastActivity: 1
        }
      }
    ])

    if (stats.length === 0) {
      return {
        totalMessages: 0,
        totalSessions: 0,
        averageMessagesPerSession: 0,
        mostActiveSession: null,
        lastActivity: null
      }
    }

    const stat = stats[0]
    const averageMessagesPerSession = stat.totalSessions > 0 
      ? Math.round(stat.totalMessages / stat.totalSessions * 100) / 100 
      : 0

    // Get most active session
    const sessionStats = await Chat.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$sessionId',
          messageCount: { $sum: 1 }
        }
      },
      { $sort: { messageCount: -1 } },
      { $limit: 1 }
    ])

    const mostActiveSession = sessionStats.length > 0 ? sessionStats[0]._id : null

    return {
      totalMessages: stat.totalMessages,
      totalSessions: stat.totalSessions,
      averageMessagesPerSession,
      mostActiveSession,
      lastActivity: stat.lastActivity
    }
  }

  /**
   * Export chat data for a user (for GDPR compliance)
   */
  static async exportUserData(userId: string): Promise<{
    user: string
    chats: IChat[]
    exportDate: Date
  }> {
    const chats = await Chat.find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: 1 })
      .select('-__v')

    return {
      user: userId,
      chats,
      exportDate: new Date()
    }
  }
}
