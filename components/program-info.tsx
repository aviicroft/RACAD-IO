"use client"

import { useState } from 'react'
import { Program } from '@/lib/services/program-service'
import { X, BookOpen, Briefcase, DollarSign, Code, GraduationCap, Sparkles } from 'lucide-react'

interface ProgramInfoProps {
  program: Program
  onClose?: () => void
}

export function ProgramInfo({ program, onClose }: ProgramInfoProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'careers' | 'salary' | 'skills'>('overview')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'careers', label: 'Career Paths', icon: Briefcase },
    { id: 'salary', label: 'Salary & Scope', icon: DollarSign },
    { id: 'skills', label: 'Skills & Tools', icon: Code }
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-full discord-gradient flex items-center justify-center shadow-lg">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{program.name}</h2>
            <p className="text-muted-foreground text-lg">{program.overview}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-xl hover:bg-muted/50 p-2 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-accent" />
                Core Subjects
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {program.core_subjects.map((subject, index) => (
                  <div key={index} className="bg-muted/50 px-3 py-2 rounded-md text-foreground border border-border">
                    {subject}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                Future Scope
              </h3>
              <p className="text-muted-foreground leading-relaxed">{program.future_scope.replace(/'/g, '&apos;')}</p>
            </div>
          </div>
        )}

        {activeTab === 'careers' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-accent" />
                Career Opportunities in India
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {program.career_opportunities.india.map((career, index) => (
                  <div key={index} className="bg-accent/10 px-3 py-2 rounded-md text-accent border border-accent/20">
                    {career}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-accent" />
                International Career Opportunities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {program.career_opportunities.international.map((career, index) => (
                  <div key={index} className="bg-accent/10 px-3 py-2 rounded-md text-accent border border-accent/20">
                    {career}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'salary' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-accent" />
                Salary Scope in India
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="discord-card p-4 border border-accent/20">
                  <h4 className="font-medium text-foreground mb-2">Entry Level</h4>
                  <p className="text-2xl font-bold text-accent">{program.salary_scope.india.entry_level}</p>
                </div>
                <div className="discord-card p-4 border border-accent/20">
                  <h4 className="font-medium text-foreground mb-2">Mid Level</h4>
                  <p className="text-2xl font-bold text-accent">{program.salary_scope.india.mid_level}</p>
                </div>
                <div className="discord-card p-4 border border-accent/20">
                  <h4 className="font-medium text-foreground mb-2">Senior Level</h4>
                  <p className="text-2xl font-bold text-accent">{program.salary_scope.india.senior_level}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-accent" />
                International Salary Scope
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="discord-card p-4 border border-accent/20">
                  <h4 className="font-medium text-foreground mb-2">Entry Level</h4>
                  <p className="text-2xl font-bold text-accent">{program.salary_scope.international.entry_level}</p>
                </div>
                <div className="discord-card p-4 border border-accent/20">
                  <h4 className="font-medium text-foreground mb-2">Mid Level</h4>
                  <p className="text-2xl font-bold text-accent">{program.salary_scope.international.mid_level}</p>
                </div>
                <div className="discord-card p-4 border border-accent/20">
                  <h4 className="font-medium text-foreground mb-2">Senior Level</h4>
                  <p className="text-2xl font-bold text-accent">{program.salary_scope.international.senior_level}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Code className="h-5 w-5 text-accent" />
                Skills You&apos;ll Gain
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {program.skills_gained.map((skill, index) => (
                  <div key={index} className="bg-accent/10 px-3 py-2 rounded-md text-accent border border-accent/20">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Code className="h-5 w-5 text-accent" />
                Tools & Technologies
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {program.tools_and_technologies.map((tool, index) => (
                  <div key={index} className="bg-accent/10 px-3 py-2 rounded-md text-accent border border-accent/20">
                    {tool}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
