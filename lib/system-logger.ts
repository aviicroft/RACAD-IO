import dbConnect from './mongodb'
import SystemLog from './models/SystemLog'

interface LogEntry {
  action: string
  userId?: string
  adminId?: string
  details: string
  severity?: 'info' | 'warning' | 'error' | 'success'
  ipAddress?: string
  userAgent?: string
  metadata?: Record<string, unknown>
}

export async function createSystemLog(entry: LogEntry): Promise<void> {
  try {
    await dbConnect()
    
    await SystemLog.create({
      action: entry.action,
      userId: entry.userId,
      adminId: entry.adminId,
      details: entry.details,
      severity: entry.severity || 'info',
      timestamp: new Date(),
      ipAddress: entry.ipAddress,
      userAgent: entry.userAgent,
      metadata: entry.metadata || {}
    })
  } catch (error) {
    // Don't throw errors from logging to avoid breaking the main flow
    console.error('Failed to create system log:', error)
  }
}

// Predefined log actions for consistency
export const LOG_ACTIONS = {
  // User actions
  USER_REGISTER: 'USER_REGISTER',
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  USER_UPDATE: 'USER_UPDATE',
  USER_DELETE: 'USER_DELETE',
  USER_PROFILE_UPDATE: 'USER_PROFILE_UPDATE',
  USER_PASSWORD_CHANGE: 'USER_PASSWORD_CHANGE',
  USER_ROLE_CHANGE: 'USER_ROLE_CHANGE',
  
  // Chat actions
  CHAT_MESSAGE: 'CHAT_MESSAGE',
  CHAT_MESSAGE_SENT: 'CHAT_MESSAGE_SENT',
  CHAT_SESSION_STARTED: 'CHAT_SESSION_STARTED',
  CHAT_SESSION_ENDED: 'CHAT_SESSION_ENDED',
  
  // Admin actions
  ADMIN_ACTION: 'ADMIN_ACTION',
  ADMIN_LOGIN: 'ADMIN_LOGIN',
  ADMIN_VIEW_USERS: 'ADMIN_VIEW_USERS',
  ADMIN_VIEW_USER_DETAILS: 'ADMIN_VIEW_USER_DETAILS',
  ADMIN_CREATE_USER: 'ADMIN_CREATE_USER',
  ADMIN_UPDATE_USER: 'ADMIN_UPDATE_USER',
  ADMIN_DELETE_USER: 'ADMIN_DELETE_USER',
  ADMIN_CLEAR_LOGS: 'ADMIN_CLEAR_LOGS',
  ADMIN_SYSTEM_SETTINGS_CHANGE: 'ADMIN_SYSTEM_SETTINGS_CHANGE',
  ADMIN_EXPORT_DATA: 'ADMIN_EXPORT_DATA',
  ADMIN_VIEW_LOGS: 'ADMIN_VIEW_LOGS',
  
  // System actions
  SYSTEM_ERROR: 'SYSTEM_ERROR',
  SYSTEM_WARNING: 'SYSTEM_WARNING',
  API_ERROR: 'API_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  AUTH_FAILURE: 'AUTH_FAILURE',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  
  // Security actions
  SECURITY_ALERT: 'SECURITY_ALERT',
  SUSPICIOUS_ACTIVITY: 'SUSPICIOUS_ACTIVITY',
  BRUTE_FORCE_ATTEMPT: 'BRUTE_FORCE_ATTEMPT',
  UNAUTHORIZED_ACCESS: 'UNAUTHORIZED_ACCESS',
  LOGIN_ATTEMPT: 'LOGIN_ATTEMPT',
  
  // Data operations
  DATA_EXPORT: 'DATA_EXPORT',
  DATA_IMPORT: 'DATA_IMPORT',
  BACKUP_CREATED: 'BACKUP_CREATED',
  SETTINGS_CHANGE: 'SETTINGS_CHANGE',
  
  // API operations
  API_ACCESS: 'API_ACCESS',
  FILE_UPLOAD: 'FILE_UPLOAD',
  DATABASE_OPERATION: 'DATABASE_OPERATION',
  
  // Communication
  EMAIL_SENT: 'EMAIL_SENT',
  PASSWORD_RESET: 'PASSWORD_RESET'
} as const

// Helper functions for common log entries
export async function logUserAction(
  action: string,
  userId: string,
  details: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await createSystemLog({
    action,
    userId,
    details,
    severity: 'info',
    metadata
  })
}

export async function logAdminAction(
  action: string,
  adminId: string,
  details: string,
  userId?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await createSystemLog({
    action,
    adminId,
    userId,
    details,
    severity: 'info',
    metadata
  })
}

export async function logError(
  action: string,
  details: string,
  userId?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await createSystemLog({
    action,
    userId,
    details,
    severity: 'error',
    metadata
  })
}

export async function logWarning(
  action: string,
  details: string,
  userId?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await createSystemLog({
    action,
    userId,
    details,
    severity: 'warning',
    metadata
  })
}

export async function logSecurityEvent(
  action: string,
  details: string,
  ipAddress?: string,
  userAgent?: string,
  userId?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await createSystemLog({
    action,
    userId,
    details,
    severity: 'warning',
    ipAddress,
    userAgent,
    metadata
  })
}
