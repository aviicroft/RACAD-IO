"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Mail, Lock, Bot, Eye, EyeOff, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface LoginFormProps {
  onEmailLogin?: (identifier: string, password: string) => Promise<void>
  onForgotPassword?: () => void
  onSignUp?: () => void
}

export function LoginForm({ 
  onEmailLogin, 
  onForgotPassword, 
  onSignUp 
}: LoginFormProps) {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Check for login errors in URL params
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const errorParam = urlParams.get('error')
    if (errorParam) {
      switch (errorParam) {
        case 'login_failed':
          setError('Login failed. Please check your credentials.')
          break
        case 'user_not_found':
          setError('User not found. Please check your username/email.')
          break
        case 'invalid_password':
          setError('Invalid password. Please try again.')
          break
        case 'account_disabled':
          setError('Account is disabled. Please contact support.')
          break
        default:
          setError('An error occurred during login.')
      }
      // Clear the error from URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier || !password) {
      setError("Please fill in all fields")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")
    
    try {
      if (onEmailLogin) {
        await onEmailLogin(identifier, password)
        setSuccess("Login successful! Redirecting...")
      } else {
        console.log("Username/Email login:", { identifier, password })
        // Implement your login logic here
      }
    } catch (error) {
      console.error("Login error:", error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Login failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => {
    setError("")
  }

  const clearSuccess = () => {
    setSuccess("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-animated relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md glass-gradient border-white/20 shadow-2xl animate-in fade-in-up duration-700">
        <CardHeader className="text-center space-y-4">
          {/* App Logo */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 gradient-blue-pink rounded-2xl flex items-center justify-center shadow-lg">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div className="absolute inset-0 gradient-blue-pink rounded-2xl blur-xl opacity-50 animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-white">
              Welcome back
            </CardTitle>
            <CardDescription className="text-gray-300">
              Sign in to your AI ChatBot account
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                ×
              </button>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span>{success}</span>
              </div>
              <button
                onClick={clearSuccess}
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                ×
              </button>
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-sm font-medium text-gray-300">
                Username or Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="identifier"
                  type="text"
                  placeholder="Enter your username or email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="pl-10 h-12 glass-input border-white/20 text-white placeholder:text-gray-300 rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all duration-300"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-12 h-12 glass-input border-white/20 text-white placeholder:text-gray-300 rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all duration-300"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-pink-400 hover:text-pink-300 transition-colors hover:underline"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>

            {/* Email Login Button */}
            <Button
              type="submit"
              disabled={isLoading || !identifier || !password}
              className="w-full h-12 gradient-button text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center">
                            <span className="text-gray-400">Don&apos;t have an account? </span>
            <button
              onClick={onSignUp}
              className="text-pink-400 hover:text-pink-300 font-medium transition-colors hover:underline"
              disabled={isLoading}
            >
              Sign up
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
