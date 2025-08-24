"use client"

import { useState } from "react"
import { LoginForm } from "@/components/login-form"
import { useRouter } from "next/navigation"

export default function LoginDemoPage() {
  const [loginStatus, setLoginStatus] = useState<string>("")
  const router = useRouter()

  const handleEmailLogin = async (identifier: string, password: string) => {
    setLoginStatus("🔄 Authenticating...")
    
    // Simulate email login process
    setTimeout(() => {
      if (identifier === "demo@example.com" && password === "demo123") {
        setLoginStatus("✅ Login successful! Redirecting...")
        setTimeout(() => {
          router.push("/demo")
        }, 2000)
      } else {
        setLoginStatus("❌ Invalid credentials. Try demo@example.com / demo123")
      }
    }, 1500)
  }

  const handleForgotPassword = () => {
    setLoginStatus("📧 Password reset email sent! (Demo)")
  }

  const handleSignUp = () => {
    setLoginStatus("📝 Sign up functionality coming soon!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Status Bar */}
      {loginStatus && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white shadow-lg">
            {loginStatus}
          </div>
        </div>
      )}

      {/* Demo Info */}
      <div className="absolute top-4 left-4 z-10">
        <div className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30 backdrop-blur-sm">
          <p className="text-sm font-medium">Demo Credentials:</p>
          <p className="text-xs">Email: demo@example.com</p>
          <p className="text-xs">Password: demo123</p>
        </div>
      </div>

      <LoginForm
        onEmailLogin={handleEmailLogin}
        onForgotPassword={handleForgotPassword}
        onSignUp={handleSignUp}
      />
    </div>
  )
}
