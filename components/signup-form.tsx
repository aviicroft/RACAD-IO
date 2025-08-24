"use client"

import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Mail, Lock, Bot, ArrowRight, Eye, EyeOff, User, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SignupFormProps {
  onEmailSignup?: (username: string, email: string, password: string) => Promise<void>
  onBackToLogin?: () => void
}

export function SignupForm({ 
  onEmailSignup, 
  onBackToLogin 
}: SignupFormProps) {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({})

  // Debounced username availability check
  useEffect(() => {
    if (username.length < 3) {
      setUsernameStatus('idle')
      return
    }

    const timer = setTimeout(async () => {
      setUsernameStatus('checking')
      try {
        const response = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username)}`)
        if (response.ok) {
          const data = await response.json()
          setUsernameStatus(data.available ? 'available' : 'taken')
        } else {
          setUsernameStatus('idle')
        }
      } catch (error) {
        console.error('Username check failed:', error)
        setUsernameStatus('idle')
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [username])

  // Real-time validation
  useEffect(() => {
    const errors: {[key: string]: string} = {}
    
    // Username validation
    if (username.length > 0 && username.length < 3) {
      errors.username = 'Username must be at least 3 characters'
    }
    if (username.length > 30) {
      errors.username = 'Username cannot exceed 30 characters'
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username) && username.length > 0) {
      errors.username = 'Username can only contain letters, numbers, underscores, and hyphens'
    }
    
    // Email validation
    if (email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    // Password validation
    if (password.length > 0 && password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    
    // Confirm password validation
    if (confirmPassword.length > 0 && password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
    
    setValidationErrors(errors)
  }, [username, email, password, confirmPassword])

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear previous messages
    setError("")
    setSuccess("")
    
    // Check for validation errors
    if (Object.keys(validationErrors).length > 0) {
      setError("Please fix the validation errors above")
      return
    }
    
    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }
    
    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }
    
    if (usernameStatus === 'taken') {
      setError("Username is already taken")
      return
    }

    setIsLoading(true)
    
    try {
      if (onEmailSignup) {
        await onEmailSignup(username, email, password)
        setSuccess("Account created successfully! Welcome aboard!")
        // Clear form
        setUsername("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setUsernameStatus('idle')
      } else {
        console.log("Email signup:", { username, email, password })
        // Implement your signup logic here
      }
    } catch (error) {
      console.error("Signup error:", error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Signup failed. Please try again.")
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

  const isFormValid = () => {
    return username && email && password && confirmPassword && 
           password === confirmPassword && 
           usernameStatus !== 'taken' && 
           Object.keys(validationErrors).length === 0
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-animated relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Signup Card */}
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
              Create Account
            </CardTitle>
            <CardDescription className="text-gray-300">
              Join AI ChatBot and start chatting
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
                <CheckCircle className="w-4 h-4" />
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
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-300">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`pl-10 h-12 glass-input border-white/20 text-white placeholder:text-gray-300 rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all duration-300 ${
                    usernameStatus === 'available' ? 'border-green-400 focus:border-green-400' :
                    usernameStatus === 'taken' ? 'border-red-400 focus:border-red-400' : ''
                  }`}
                  required
                  disabled={isLoading}
                />
                {/* Username status indicator */}
                {usernameStatus === 'checking' && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-pink-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {usernameStatus === 'available' && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                )}
                {usernameStatus === 'taken' && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                )}
              </div>
              {/* Username status message */}
              {usernameStatus === 'available' && (
                <p className="text-sm text-green-400">✓ Username is available!</p>
              )}
              {usernameStatus === 'taken' && (
                <p className="text-sm text-red-400">✗ Username is already taken</p>
              )}
              {validationErrors.username && (
                <p className="text-sm text-red-400">{validationErrors.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 glass-input border-white/20 text-white placeholder:text-gray-300 rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all duration-300"
                  required
                  disabled={isLoading}
                />
              </div>
              {validationErrors.email && (
                <p className="text-sm text-red-400">{validationErrors.email}</p>
              )}
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
                  placeholder="Create a password"
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
              {validationErrors.password && (
                <p className="text-sm text-red-400">{validationErrors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-12 h-12 glass-input border-white/20 text-white placeholder:text-gray-300 rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all duration-300"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-sm text-red-400">{validationErrors.confirmPassword}</p>
              )}
            </div>

            {/* Email Signup Button */}
            <Button
              type="submit"
              disabled={!isFormValid() || isLoading}
              className="w-full h-12 gradient-button text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </div>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          {/* Back to Login Link */}
          <div className="text-center">
            <span className="text-gray-400">Already have an account? </span>
            <button
              onClick={onBackToLogin}
              className="text-pink-400 hover:text-pink-300 font-medium transition-colors hover:underline"
              disabled={isLoading}
            >
              Sign in
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
