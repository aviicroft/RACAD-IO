import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export interface JWTPayload {
  userId: string
  username: string
  role: string
  iat: number
  exp: number
}

export function withAuthAppRouter<T extends unknown[]>(handler: (req: NextRequest & { user: JWTPayload }, ...args: T) => Promise<NextResponse>) {
  return async (req: NextRequest, ...args: T) => {
    try {
      const cookieStore = await cookies()
      const token = cookieStore.get('jwt')?.value

      if (!token) {
        return NextResponse.json({ error: 'Access denied. No token provided.' }, { status: 401 })
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production') as JWTPayload
      
      // Add user info to request context
      const requestWithUser = req as NextRequest & { user: JWTPayload }
      requestWithUser.user = decoded
      
      return handler(requestWithUser, ...args)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 401 })
    }
  }
}

export function withRoleAppRouter(requiredRole: string) {
  return (handler: (req: NextRequest, context: unknown) => Promise<NextResponse>) => {
    return withAuthAppRouter(async (req: NextRequest, context: unknown) => {
      const requestWithUser = req as NextRequest & { user: JWTPayload }
      if (requestWithUser.user?.role !== requiredRole && requestWithUser.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Access denied. Insufficient permissions.' }, { status: 403 })
      }
      
      return handler(req, context)
    })
  }
}

export function withOptionalAuthAppRouter(handler: (req: NextRequest & { user?: JWTPayload }, ...args: unknown[]) => Promise<NextResponse>) {
  return async (req: NextRequest, ...args: unknown[]) => {
    try {
      const cookieStore = await cookies()
      const token = cookieStore.get('jwt')?.value

      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production') as JWTPayload
        
        // Add user info to request context
        const requestWithUser = req as NextRequest & { user: JWTPayload }
        requestWithUser.user = decoded
        
        return handler(requestWithUser, ...args)
      }
      
      // No token, continue without authentication
      const requestWithUser = req as NextRequest & { user?: JWTPayload }
      return handler(requestWithUser, ...args)
    } catch (error) {
      console.error('Optional auth middleware error:', error)
      // Continue without authentication
      const requestWithUser = req as NextRequest & { user?: JWTPayload }
      return handler(requestWithUser, ...args)
    }
  }
}
