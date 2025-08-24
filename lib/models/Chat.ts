import mongoose, { Document, Schema } from 'mongoose'

export interface IChat extends Document {
  userId: mongoose.Types.ObjectId
  sessionId: string
  role: 'user' | 'assistant'
  message: string
  metadata?: {
    tone?: string
    tts?: boolean
    source?: string
    confidence?: number
    category?: string
    relatedFAQs?: Array<{
      question: string
      answer: string
      category: string
      link?: string
    }>
    reasoning?: string
    [key: string]: unknown // Allow additional metadata fields
  }
  createdAt: Date
  updatedAt: Date
}

const ChatSchema = new Schema<IChat>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  sessionId: {
    type: String,
    required: [true, 'Session ID is required'],
    index: true
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: [true, 'Role is required']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [10000, 'Message cannot exceed 10,000 characters']
  },
  metadata: {
    tone: {
      type: String,
      enum: ['professional', 'casual', 'friendly', 'formal', 'funny'],
      default: 'professional'
    },
    tts: {
      type: Boolean,
      default: false
    },
    source: {
      type: String,
      enum: ['ai_generated', 'faq_enhanced', 'conversational', 'creative', 'fallback', 'special_response'],
      default: 'ai_generated'
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.8
    },
    category: {
      type: String,
      default: 'general'
    },
    relatedFAQs: [{
      question: {
        type: String,
        required: true
      },
      answer: {
        type: String,
        required: true
      },
      category: {
        type: String,
        required: true
      },
      link: {
        type: String
      }
    }],
    reasoning: {
      type: String,
      maxlength: [1000, 'Reasoning cannot exceed 1,000 characters']
    }
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret: any) {
      // Convert ObjectId to string for JSON serialization
      if (ret.userId) {
        ret.userId = ret.userId.toString()
      }
      return ret
    }
  }
})

// Indexes for performance
ChatSchema.index({ userId: 1, sessionId: 1 })
ChatSchema.index({ userId: 1, createdAt: -1 })
ChatSchema.index({ sessionId: 1, createdAt: -1 })
ChatSchema.index({ role: 1 })
ChatSchema.index({ 'metadata.source': 1 })
ChatSchema.index({ 'metadata.category': 1 })

// Compound indexes for common queries
ChatSchema.index({ userId: 1, role: 1, createdAt: -1 })
ChatSchema.index({ sessionId: 1, role: 1, createdAt: -1 })

// Text index for message search (optional)
ChatSchema.index({ message: 'text' })

export default mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema)
