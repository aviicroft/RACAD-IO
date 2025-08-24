import { createSystemLog, LOG_ACTIONS } from '@/lib/system-logger'

interface LogAction {
  action: string
  userId?: string
  username?: string
  details: string
  severity: 'info' | 'warning' | 'error' | 'success'
  ipAddress?: string
  userAgent?: string
  metadata?: Record<string, unknown>
}

interface DiscordWebhookPayload {
  embeds: Array<{
    title: string
    description: string
    color: number
    fields: Array<{
      name: string
      value: string
      inline?: boolean
    }>
    timestamp: string
    footer: {
      text: string
    }
  }>
}

class LoggingService {
  private discordWebhookUrl: string
  private isEnabled: boolean

  constructor() {
    this.discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/1409066599624998942/h1Bph4iEIWvyqjjoCpdHL8u89nV4ltY3pmvR0j7imXX-E7uxeBcsmEgTOeUVMpSyytYi'
    this.isEnabled = process.env.ENABLE_DISCORD_LOGGING !== 'false'
  }

  /**
   * Log an action to both database and Discord
   */
  async logAction(logData: LogAction): Promise<void> {
    try {
      // Log to database
      await this.logToDatabase(logData)
      
      // Log to Discord webhook
      if (this.isEnabled) {
        await this.logToDiscord(logData)
      }
    } catch (error) {
      console.error('Logging service error:', error)
    }
  }

  /**
   * Log to database using system logger
   */
  private async logToDatabase(logData: LogAction): Promise<void> {
    try {
      await createSystemLog({
        action: logData.action as keyof typeof LOG_ACTIONS,
        userId: logData.userId,
        details: logData.details,
        severity: logData.severity,
        ipAddress: logData.ipAddress,
        userAgent: logData.userAgent,
        metadata: logData.metadata
      })
    } catch (error) {
      console.error('Database logging error:', error)
    }
  }

  /**
   * Log to Discord webhook
   */
  private async logToDiscord(logData: LogAction): Promise<void> {
    try {
      const payload: DiscordWebhookPayload = {
        embeds: [
          {
            title: this.getDiscordTitle(logData.action),
            description: logData.details,
            color: this.getDiscordColor(logData.severity),
            fields: this.getDiscordFields(logData),
            timestamp: new Date().toISOString(),
            footer: {
              text: 'College Chatbot Admin Logs'
            }
          }
        ]
      }

      const response = await fetch(this.discordWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        console.error('Discord webhook failed:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Discord logging error:', error)
    }
  }

  /**
   * Get Discord embed title based on action
   */
  private getDiscordTitle(action: string): string {
    const actionMap: Record<string, string> = {
      'USER_LOGIN': '🔐 User Login',
      'USER_LOGOUT': '🚪 User Logout',
      'USER_REGISTER': '📝 User Registration',
      'USER_UPDATE': '✏️ User Update',
      'USER_DELETE': '🗑️ User Deletion',
      'CHAT_MESSAGE': '💬 Chat Message',
      'ADMIN_ACTION': '⚡ Admin Action',
      'SYSTEM_ERROR': '❌ System Error',
      'SECURITY_ALERT': '🚨 Security Alert',
      'DATA_EXPORT': '📊 Data Export',
      'SETTINGS_CHANGE': '⚙️ Settings Change',
      'BACKUP_CREATED': '💾 Backup Created',
      'USER_ROLE_CHANGE': '👑 Role Change',
      'API_ACCESS': '🔌 API Access',
      'FILE_UPLOAD': '📁 File Upload',
      'DATABASE_OPERATION': '🗄️ Database Operation',
      'EMAIL_SENT': '📧 Email Sent',
      'PASSWORD_RESET': '🔑 Password Reset',
      'LOGIN_ATTEMPT': '🔍 Login Attempt',
      'RATE_LIMIT_EXCEEDED': '⏰ Rate Limit Exceeded'
    }
    return actionMap[action] || `📋 ${action}`
  }

  /**
   * Get Discord embed color based on severity
   */
  private getDiscordColor(severity: string): number {
    const colorMap: Record<string, number> = {
      'success': 0x00ff00, // Green
      'info': 0x0099ff,    // Blue
      'warning': 0xffaa00, // Orange
      'error': 0xff0000     // Red
    }
    return colorMap[severity] || 0x999999 // Gray default
  }

  /**
   * Get Discord embed fields
   */
  private getDiscordFields(logData: LogAction): Array<{ name: string; value: string; inline?: boolean }> {
    const fields = []

    if (logData.username) {
      fields.push({
        name: '👤 User',
        value: logData.username,
        inline: true
      })
    }

    if (logData.userId) {
      fields.push({
        name: '🆔 User ID',
        value: logData.userId,
        inline: true
      })
    }

    fields.push({
      name: '📊 Severity',
      value: logData.severity.toUpperCase(),
      inline: true
    })

    if (logData.ipAddress) {
      fields.push({
        name: '🌐 IP Address',
        value: logData.ipAddress,
        inline: true
      })
    }

    if (logData.metadata && Object.keys(logData.metadata).length > 0) {
      const metadataStr = Object.entries(logData.metadata)
        .map(([key, value]) => `**${key}**: ${value}`)
        .join('\n')
      
      if (metadataStr.length < 1024) { // Discord field value limit
        fields.push({
          name: '📋 Metadata',
          value: metadataStr,
          inline: false
        })
      }
    }

    return fields
  }

  // Convenience methods for common actions
  async logUserLogin(userId: string, username: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.logAction({
      action: 'USER_LOGIN',
      userId,
      username,
      details: `User ${username} logged in successfully`,
      severity: 'success',
      ipAddress,
      userAgent
    })
  }

  async logUserLogout(userId: string, username: string, ipAddress?: string): Promise<void> {
    await this.logAction({
      action: 'USER_LOGOUT',
      userId,
      username,
      details: `User ${username} logged out`,
      severity: 'info',
      ipAddress
    })
  }

  async logUserRegister(userId: string, username: string, email: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.logAction({
      action: 'USER_REGISTER',
      userId,
      username,
      details: `New user registered: ${username} (${email})`,
      severity: 'success',
      ipAddress,
      userAgent
    })
  }

  async logUserUpdate(userId: string, username: string, changes: Record<string, unknown>, ipAddress?: string): Promise<void> {
    await this.logAction({
      action: 'USER_UPDATE',
      userId,
      username,
      details: `User ${username} profile updated`,
      severity: 'info',
      ipAddress,
      metadata: { changes }
    })
  }

  async logUserDelete(userId: string, username: string, deletedBy: string, ipAddress?: string): Promise<void> {
    await this.logAction({
      action: 'USER_DELETE',
      userId,
      username,
      details: `User ${username} deleted by ${deletedBy}`,
      severity: 'warning',
      ipAddress
    })
  }

  async logChatMessage(userId: string, username: string, sessionId: string, messageLength: number, ipAddress?: string): Promise<void> {
    await this.logAction({
      action: 'CHAT_MESSAGE',
      userId,
      username,
      details: `Chat message sent in session ${sessionId}`,
      severity: 'info',
      ipAddress,
      metadata: { sessionId, messageLength }
    })
  }

  async logAdminAction(adminId: string, adminUsername: string, action: string, target?: string, details?: string, ipAddress?: string): Promise<void> {
    await this.logAction({
      action: 'ADMIN_ACTION',
      userId: adminId,
      username: adminUsername,
      details: `Admin ${adminUsername} performed: ${action}${target ? ` on ${target}` : ''}${details ? ` - ${details}` : ''}`,
      severity: 'info',
      ipAddress,
      metadata: { adminAction: action, target, details }
    })
  }

  async logSecurityAlert(userId: string, username: string, alert: string, ipAddress?: string, metadata?: Record<string, unknown>): Promise<void> {
    await this.logAction({
      action: 'SECURITY_ALERT',
      userId,
      username,
      details: `Security alert: ${alert}`,
      severity: 'error',
      ipAddress,
      metadata
    })
  }

  async logSystemError(error: string, context?: string, metadata?: Record<string, unknown>): Promise<void> {
    await this.logAction({
      action: 'SYSTEM_ERROR',
      details: `System error: ${error}${context ? ` in ${context}` : ''}`,
      severity: 'error',
      metadata
    })
  }

  async logLoginAttempt(email: string, success: boolean, ipAddress?: string, userAgent?: string, reason?: string): Promise<void> {
    await this.logAction({
      action: 'LOGIN_ATTEMPT',
      details: `Login attempt for ${email}: ${success ? 'SUCCESS' : 'FAILED'}${reason ? ` - ${reason}` : ''}`,
      severity: success ? 'success' : 'warning',
      ipAddress,
      userAgent,
      metadata: { email, success, reason }
    })
  }

  async logRateLimitExceeded(userId: string, username: string, endpoint: string, ipAddress?: string): Promise<void> {
    await this.logAction({
      action: 'RATE_LIMIT_EXCEEDED',
      userId,
      username,
      details: `Rate limit exceeded for endpoint: ${endpoint}`,
      severity: 'warning',
      ipAddress,
      metadata: { endpoint }
    })
  }
}

// Export singleton instance
export const loggingService = new LoggingService()

// Export individual methods for convenience
export const {
  logUserLogin,
  logUserLogout,
  logUserRegister,
  logUserUpdate,
  logUserDelete,
  logChatMessage,
  logAdminAction,
  logSecurityAlert,
  logSystemError,
  logLoginAttempt,
  logRateLimitExceeded
} = loggingService
