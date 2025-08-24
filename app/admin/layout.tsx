"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    console.log('Admin layout - Auth state:', { user, loading: isLoading, userRole: user?.role })
    
    if (!isLoading) {
      if (!user) {
        console.log('Admin layout - No user, redirecting to login')
        router.push('/login?redirect=/admin')
      } else if (user.role !== 'admin') {
        console.log('Admin layout - User is not admin, redirecting to home')
        router.push('/')
      } else {
        console.log('Admin layout - User is admin, allowing access')
        setIsAuthorized(true)
      }
    }
  }, [user, isLoading, router])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authorization...</p>
        </div>
      </div>
    )
  }

  // Show loading while redirecting
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  // Render admin content if authorized
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}
