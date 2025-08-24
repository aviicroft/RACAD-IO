import bcrypt from 'bcryptjs'
import User, { IUser } from '../models/User'

export class UserService {
  /**
   * Create a new user
   */
  static async createUser(userData: {
    username: string
    email: string
    password: string
    avatar?: string
    bio?: string
  }): Promise<IUser> {
    const { username, email, password, avatar, bio } = userData

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    })

    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error('Email already registered')
      }
      if (existingUser.username === username) {
        throw new Error('Username already taken')
      }
    }

    // Hash password
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Create user
    const user = new User({
      username,
      email,
      passwordHash,
      avatar,
      bio,
      lastLogin: new Date()
    })

    await user.save()
    return user
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email, isActive: true })
  }

  /**
   * Find user by username
   */
  static async findByUsername(username: string): Promise<IUser | null> {
    return User.findOne({ username, isActive: true })
  }

  /**
   * Find user by ID
   */
  static async findById(userId: string): Promise<IUser | null> {
    return User.findById(userId)
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    userId: string,
    updates: Partial<{
      username: string
      email: string
      avatar: string
      bio: string
    }>
  ): Promise<IUser | null> {
    // Check if username/email is already taken by another user
    if (updates.username || updates.email) {
      const existingUser = await User.findOne({
        $and: [
          { _id: { $ne: userId } },
          {
            $or: [
              ...(updates.username ? [{ username: updates.username }] : []),
              ...(updates.email ? [{ email: updates.email }] : [])
            ]
          }
        ]
      })

      if (existingUser) {
        if (existingUser.username === updates.username) {
          throw new Error('Username already taken')
        }
        if (existingUser.email === updates.email) {
          throw new Error('Email already taken')
        }
      }
    }

    return User.findByIdAndUpdate(
      userId,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
  }

  /**
   * Update last login
   */
  static async updateLastLogin(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { lastLogin: new Date() })
  }

  /**
   * Change password
   */
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    const user = await User.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect')
    }

    // Hash new password
    const saltRounds = 12
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds)

    // Update password
    await User.findByIdAndUpdate(userId, { passwordHash: newPasswordHash })
    return true
  }

  /**
   * Deactivate user account
   */
  static async deactivateAccount(userId: string): Promise<boolean> {
    await User.findByIdAndUpdate(userId, { isActive: false })
    return true
  }

  /**
   * Get user statistics
   */
  static async getUserStats(userId: string): Promise<{
    totalChats: number
    lastActive: Date
    accountAge: number
  }> {
    const user = await User.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    // You can add more stats here by querying the Chat collection
    const accountAge = Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24))

    return {
      totalChats: 0, // TODO: Implement chat count
      lastActive: user.lastLogin,
      accountAge
    }
  }
}
