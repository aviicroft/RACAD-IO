"use client"

import { useState } from 'react'
import { programService, Program } from '@/lib/services/program-service'
import { ProgramInfo } from './program-info'
import { Sparkles, Target, GraduationCap, CheckCircle } from 'lucide-react'

export function ProgramRecommendations() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [recommendations, setRecommendations] = useState<Program[]>([])
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)

  const interestOptions = [
    'Programming',
    'Artificial Intelligence',
    'Data Science',
    'Cybersecurity',
    'Web Development',
    'Mobile Apps',
    'Cloud Computing',
    'Machine Learning',
    'Networking',
    'Database Management',
    'Software Engineering',
    'Hardware',
    'IoT',
    'Robotics',
    'Business Analytics',
    'Research',
    'Startup',
    'Entrepreneurship'
  ]

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  const getRecommendations = () => {
    if (selectedInterests.length === 0) {
      setRecommendations([])
      return
    }
    
    const results = programService.getRecommendations(selectedInterests)
    setRecommendations(results)
  }

  const handleProgramSelect = (program: Program) => {
    setSelectedProgram(program)
  }

  const handleCloseProgram = () => {
    setSelectedProgram(null)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4 flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-accent" />
          Program Recommendations
        </h1>
        <p className="text-muted-foreground text-lg">
          Tell us about your interests and we&apos;ll recommend the best programs for you!
        </p>
      </div>

      {/* Interest Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-accent" />
          Select Your Interests
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {interestOptions.map((interest) => (
            <button
              key={interest}
              onClick={() => handleInterestToggle(interest)}
              className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                selectedInterests.includes(interest)
                  ? 'bg-accent text-accent-foreground border-accent shadow-lg scale-105'
                  : 'bg-card text-foreground border-border hover:bg-accent/10 hover:border-accent/30 hover:scale-102'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
        
        <div className="mt-6">
          <button
            onClick={getRecommendations}
            disabled={selectedInterests.length === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              selectedInterests.length === 0
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'discord-button-primary hover:scale-105'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            Get Recommendations ({selectedInterests.length} selected)
          </button>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-accent" />
            Recommended Programs ({recommendations.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((program, index) => (
              <div
                key={index}
                onClick={() => handleProgramSelect(program)}
                className="discord-card hover:shadow-xl transition-all duration-300 cursor-pointer p-6 border border-border hover:border-accent/30 group"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full discord-gradient flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-accent transition-colors">
                        {program.name}
                      </h3>
                      <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full border border-accent/20">
                        Recommended
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {program.overview}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="font-medium">Duration:</span>
                    <span className="ml-2 text-foreground">
                      {program.name.includes('M.Sc') ? '2 Years' : '3 Years'}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="font-medium">Entry Salary:</span>
                    <span className="ml-2 text-accent font-semibold">
                      {program.salary_scope.india.entry_level}
                    </span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <h4 className="text-sm font-medium text-foreground mb-2">Relevant Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {program.skills_gained.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full border border-accent/20"
                      >
                        {skill.split(' ')[0]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Recommendations */}
      {recommendations.length === 0 && selectedInterests.length > 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground/30 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-medium text-muted-foreground mb-2">No recommendations yet</h3>
          <p className="text-muted-foreground">
            Click &quot;Get Recommendations&quot; to see programs that match your interests.
          </p>
        </div>
      )}

      {/* Program Details Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="discord-card max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <ProgramInfo program={selectedProgram} onClose={handleCloseProgram} />
          </div>
        </div>
      )}
    </div>
  )
}
