import mongoose, { Document, Schema } from 'mongoose'

export interface ISystemLog extends Document {
  action: string
  userId?: string
  adminId?: string
  details: string
  severity: 'info' | 'warning' | 'error' | 'success'
  timestamp: Date
  ipAddress?: string
  userAgent?: string
  metadata?: Record<string, unknown>
}

const SystemLogSchema = new Schema<ISystemLog>({
  action: {
    type: String,
    required: [true, 'Action is required'],
    trim: true,
    maxlength: [100, 'Action cannot exceed 100 characters']
  },
  userId: {
    type: String,
    ref: 'User',
    default: null
  },
  adminId: {
    type: String,
    ref: 'User',
    default: null
  },
  details: {
    type: String,
    required: [true, 'Details are required'],
    maxlength: [1000, 'Details cannot exceed 1000 characters']
  },
  severity: {
    type: String,
    enum: ['info', 'warning', 'error', 'success'],
    default: 'info'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: false // We use our own timestamp field
})

// Indexes for performance
SystemLogSchema.index({ action: 1 })
SystemLogSchema.index({ severity: 1 })
SystemLogSchema.index({ userId: 1 })
SystemLogSchema.index({ adminId: 1 })

// Compound indexes for common queries
SystemLogSchema.index({ severity: 1, timestamp: -1 })
SystemLogSchema.index({ action: 1, timestamp: -1 })

// TTL index to automatically delete old logs (optional - keeps last 90 days)
SystemLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 })

export default mongoose.models.SystemLog || mongoose.model<ISystemLog>('SystemLog', SystemLogSchema)
