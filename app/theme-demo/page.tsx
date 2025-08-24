"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ThemeDemoPage() {
  const [inputValue, setInputValue] = useState("")

  return (
    <div className="min-h-screen gradient-animated p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold gradient-text mb-4">
          Blue, Black & Pink Theme
        </h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Experience our beautiful gradient theme with glass morphism effects, 
          animated backgrounds, and professional styling
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-center mb-12">
        <Link
          href="/"
          className="px-6 py-3 gradient-card text-white rounded-xl hover:scale-105 transition-all duration-300 border border-white/20 backdrop-blur-sm shadow-lg mx-2"
        >
          🏠 Home
        </Link>
        <Link
          href="/login"
          className="px-6 py-3 gradient-card text-white rounded-xl hover:scale-105 transition-all duration-300 border border-white/20 backdrop-blur-sm shadow-lg mx-2"
        >
          🔐 Login
        </Link>
        <Link
          href="/demo"
          className="px-6 py-3 gradient-card text-white rounded-xl hover:scale-105 transition-all duration-300 border border-white/20 backdrop-blur-sm shadow-lg mx-2"
        >
          🎨 Chat Demo
        </Link>
      </div>

      {/* Gradient Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <Card className="glass-gradient border-white/20 shadow-2xl hover:scale-105 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white">Gradient Background</CardTitle>
            <CardDescription className="text-gray-300">
              Beautiful animated gradient background
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-32 gradient-bg rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">Gradient BG</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-gradient border-white/20 shadow-2xl hover:scale-105 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white">Blue to Pink</CardTitle>
            <CardDescription className="text-gray-300">
              Smooth blue to pink gradient
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-32 gradient-blue-pink rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">Blue → Pink</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-gradient border-white/20 shadow-2xl hover:scale-105 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white">Pink to Blue</CardTitle>
            <CardDescription className="text-gray-300">
              Reverse gradient effect
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-32 gradient-pink-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">Pink → Blue</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Buttons Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card className="glass-gradient border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white">Gradient Buttons</CardTitle>
            <CardDescription className="text-gray-300">
              Interactive buttons with hover effects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full h-12 gradient-button">
              Primary Gradient Button
            </Button>
            <Button className="w-full h-12 gradient-button hover:gradient-glow-hover">
              Button with Glow Effect
            </Button>
            <Button className="w-full h-12 gradient-border bg-transparent text-white hover:gradient-glow">
              Border Gradient Button
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-gradient border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white">Form Elements</CardTitle>
            <CardDescription className="text-gray-300">
              Styled inputs and labels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="demo-input" className="text-white">Sample Input</Label>
              <Input
                id="demo-input"
                placeholder="Type something..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="glass-input border-white/20 text-white placeholder:text-gray-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
              />
            </div>
            <div className="h-12 glass-input border-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white">Glass Input Style</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Effects Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card className="glass-gradient border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white">Glow Effects</CardTitle>
            <CardDescription className="text-gray-300">
              Beautiful glow and shadow effects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-32 gradient-card rounded-lg flex items-center justify-center gradient-glow">
              <span className="text-white font-semibold">Glow Effect</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-gradient border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white">Glass Morphism</CardTitle>
            <CardDescription className="text-gray-300">
              Modern glass effect with backdrop blur
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-32 glass-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">Glass Effect</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Text Effects */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold gradient-text mb-4">
          Gradient Text Effects
        </h2>
        <p className="text-xl text-white/80">
          Beautiful text with gradient backgrounds
        </p>
      </div>

      {/* Footer */}
      <div className="text-center">
        <div className="inline-block px-8 py-4 gradient-card rounded-2xl border border-white/20">
          <p className="text-white font-semibold">
            🎨 Theme Demo Complete - Your app now has a stunning gradient design!
          </p>
        </div>
      </div>
    </div>
  )
}
