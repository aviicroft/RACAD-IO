"use client"

import { useState } from 'react'
import { ProgramSearch } from '@/components/program-search'
import { ProgramRecommendations } from '@/components/program-recommendations'
import { DepartmentView } from '@/components/department-view'
import { Bot, GraduationCap, Search, Sparkles, Building2 } from 'lucide-react'

export default function ProgramsPage() {
  const [activeTab, setActiveTab] = useState<'browse' | 'departments' | 'recommendations'>('departments')

  return (
    <div className="min-h-screen discord-gradient">
      {/* Header */}
      <div className="glass-header border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-full discord-gradient flex items-center justify-center shadow-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Academic Programs</h1>
              <p className="text-xl text-muted-foreground">
                Explore our comprehensive range of programs across 10 specialized departments designed for the future.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="glass-header border-b border-border">
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('departments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'departments'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
              }`}
            >
              <Building2 className="h-4 w-4" />
              Departments
            </button>
            <button
              onClick={() => setActiveTab('browse')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'browse'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
              }`}
            >
              <Search className="h-4 w-4" />
              Browse All Programs
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'recommendations'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              Get Recommendations
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="py-8">
        {activeTab === 'departments' && <DepartmentView />}
        {activeTab === 'browse' && <ProgramSearch />}
        {activeTab === 'recommendations' && <ProgramRecommendations />}
      </div>

      {/* Footer Info */}
      <div className="glass-header border-t border-border mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="discord-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-accent" />
                Program Categories
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Computer Science & Technology</li>
                <li>• Business & Commerce</li>
                <li>• Science & Mathematics</li>
                <li>• Arts & Humanities</li>
                <li>• Management & Design</li>
              </ul>
            </div>
            <div className="discord-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Bot className="h-5 w-5 text-accent" />
                Career Support
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Industry Partnerships</li>
                <li>• Internship Programs</li>
                <li>• Placement Assistance</li>
                <li>• Career Counseling</li>
                <li>• Alumni Network</li>
              </ul>
            </div>
            <div className="discord-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                Why Choose Us
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Industry-Relevant Curriculum</li>
                <li>• Expert Faculty</li>
                <li>• Modern Infrastructure</li>
                <li>• Research Opportunities</li>
                <li>• Global Recognition</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
