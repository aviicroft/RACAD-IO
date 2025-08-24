"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { LoginForm } from "@/components/login-form"
import { SignupForm } from "@/components/signup-form"

function LoginPageContent() {
  const [isSignup, setIsSignup] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'

  const handleEmailLogin = async (identifier: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, password })
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Login successful:", data)
        // Redirect to the intended destination or main page
        window.location.href = redirectTo
      } else {
        const errorData = await response.json()
        console.error("Login failed:", errorData.error)
        throw new Error(errorData.error || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error // Re-throw to let the form handle it
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = () => {
    console.log("Forgot password clicked")
    // Implement forgot password functionality
    alert("Forgot password functionality coming soon!")
  }

  const handleSignUp = () => {
    setIsSignup(true)
  }

  const handleBackToLogin = () => {
    setIsSignup(false)
  }

  const handleEmailSignup = async (username: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Signup successful:", data)
        // Switch back to login form
        setIsSignup(false)
        // Show success message (the form will handle this)
        return
      } else {
        const errorData = await response.json()
        console.error("Signup failed:", errorData.error)
        throw new Error(errorData.error || "Signup failed")
      }
    } catch (error) {
      console.error("Signup error:", error)
      throw error // Re-throw to let the form handle it
    } finally {
      setIsLoading(false)
    }
  }

  if (isSignup) {
    return (
      <SignupForm
        onEmailSignup={handleEmailSignup}
        onBackToLogin={handleBackToLogin}
      />
    )
  }

  return (
    <LoginForm
      onEmailLogin={handleEmailLogin}
      onForgotPassword={handleForgotPassword}
      onSignUp={handleSignUp}
    />
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  )
}
