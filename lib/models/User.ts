import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  _id: string
  username: string
  email: string
  passwordHash?: string
  avatar?: string
  bio?: string
  role: 'user' | 'admin' | 'premium'
  isActive: boolean
  messageCount: number
  lastReset: Date
  createdAt: Date
  lastLogin: Date
  lastLoginIP?: string
  updatedAt: Date
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    validate: {
      validator: function(email: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
      },
      message: 'Please enter a valid email address'
    }
  },
  passwordHash: {
    type: String,
    required: [true, 'Password hash is required']
  },
  avatar: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'premium'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  messageCount: {
    type: Number,
    default: 0,
    min: 0
  },
  lastReset: {
    type: Date,
    default: Date.now
  },
  lastLoginIP: {
    type: String,
    default: null
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  toJSON: {
    transform: function(doc, ret) {
      if ('passwordHash' in ret) {
        delete ret.passwordHash // Never return password hash
      }
      return ret
    }
  }
})

// Indexes for performance (including unique constraints)
UserSchema.index({ email: 1 }, { unique: true })
UserSchema.index({ username: 1 }, { unique: true })
UserSchema.index({ createdAt: -1 })

// Add a method to find user by username or email
UserSchema.statics.findByUsernameOrEmail = function(identifier: string) {
  return this.findOne({
    $or: [
      { username: identifier.toLowerCase() },
      { email: identifier.toLowerCase() }
    ]
  })
}

// Compound index for common queries
UserSchema.index({ isActive: 1, role: 1 })

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
