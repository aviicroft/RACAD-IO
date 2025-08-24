import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'
import { IUser } from './models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

// Ensure JWT_SECRET is always a string for TypeScript
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
}

export interface JWTPayload {
  userId: string
  username: string
  email: string
  role: string
  iat: number
  exp: number
}

/**
 * Generate JWT token for user
 */
export function generateToken(user: IUser): string {
  const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
    userId: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role
  }

  return (jwt as any).sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  })
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}
/**
 * Extract token from request headers
 */
export function extractToken(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  // Also check cookies for JWT
  const token = req.cookies?.jwt
  return token || null
}

/**
 * JWT middleware for protecting routes
 */
export function withAuth(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<unknown>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = extractToken(req)
      
      if (!token) {
        return res.status(401).json({ 
          error: 'Access denied. No token provided.' 
        })
      }

      const decoded = verifyToken(token)
      if (!decoded) {
        return res.status(401).json({ 
          error: 'Invalid or expired token.' 
        })
      }

      // Add user info to request
      req.user = decoded
      
      return handler(req, res)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return res.status(500).json({ 
        error: 'Internal server error during authentication.' 
      })
    }
  }
}

/**
 * Optional auth middleware - doesn't block if no token
 */
export function withOptionalAuth(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<unknown>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = extractToken(req)
      
      if (token) {
        const decoded = verifyToken(token)
        if (decoded) {
          req.user = decoded
        }
      }
      
      return handler(req, res)
    } catch (error) {
      console.error('Optional auth middleware error:', error)
      // Continue without authentication
      return handler(req, res)
    }
  }
}

/**
 * Role-based access control middleware
 */
export function withRole(requiredRole: string) {
  return (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<unknown>) => {
    return withAuth(async (req: NextApiRequest, res: NextApiResponse) => {
      if (req.user?.role !== requiredRole && req.user?.role !== 'admin') {
        return res.status(403).json({ 
          error: 'Access denied. Insufficient permissions.' 
        })
      }
      
      return handler(req, res)
    })
  }
}

// Extend NextApiRequest to include user
declare module 'next' {
  interface NextApiRequest {
    user?: JWTPayload
  }
}

