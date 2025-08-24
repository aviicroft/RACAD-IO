"use client"

import { useState } from 'react'
import { programService, departments, Program } from '@/lib/services/program-service'
import { ProgramInfo } from './program-info'
import { ChevronDown, ChevronRight, Users, BookOpen, GraduationCap, Building2 } from 'lucide-react'

export function DepartmentView() {
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set())
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)

  const toggleDepartment = (departmentId: string) => {
    const newExpanded = new Set(expandedDepartments)
    if (newExpanded.has(departmentId)) {
      newExpanded.delete(departmentId)
    } else {
      newExpanded.add(departmentId)
    }
    setExpandedDepartments(newExpanded)
  }

  const handleProgramSelect = (program: Program) => {
    setSelectedProgram(program)
  }

  const handleCloseProgram = () => {
    setSelectedProgram(null)
  }

  const getProgramsByDepartment = (departmentId: string) => {
    return programService.getProgramsByDepartment(departmentId)
  }

  const getProgramCount = (departmentId: string) => {
    return programService.getProgramCountByDepartment(departmentId)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4 flex items-center gap-3">
          <Building2 className="h-8 w-8 text-accent" />
          Our Academic Departments
        </h1>
        <p className="text-muted-foreground text-lg">
          Explore programs across our 10 specialized departments, each designed to provide cutting-edge education and career opportunities.
        </p>
      </div>

      {/* Department Grid */}
      <div className="space-y-6">
        {departments.map((department) => {
          const isExpanded = expandedDepartments.has(department.id)
          const programs = getProgramsByDepartment(department.id)
          const programCount = getProgramCount(department.id)

          return (
            <div key={department.id} className="discord-card border border-border">
              {/* Department Header */}
              <div 
                className="p-6 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => toggleDepartment(department.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{department.icon}</div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-foreground mb-2">
                        {department.name}
                      </h2>
                      <p className="text-muted-foreground mb-3">
                        {department.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {programCount} Program{programCount !== 1 ? 's' : ''}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {programs.filter(p => p.level === 'undergraduate').length} UG, {programs.filter(p => p.level === 'postgraduate').length} PG
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-accent" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>

              {/* Department Programs */}
              {isExpanded && (
                <div className="border-t border-border p-6 bg-muted/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {programs.map((program, index) => (
                      <div
                        key={index}
                        onClick={() => handleProgramSelect(program)}
                        className="discord-card hover:shadow-lg transition-all duration-300 cursor-pointer p-4 border border-border hover:border-accent/30 group"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="h-8 w-8 rounded-full discord-gradient flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <GraduationCap className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-accent transition-colors">
                              {program.name}
                            </h3>
                            <span className={`px-2 py-1 text-xs rounded-full border ${
                              program.level === 'undergraduate' 
                                ? 'bg-blue-100 text-blue-800 border-blue-200' 
                                : 'bg-purple-100 text-purple-800 border-purple-200'
                            }`}>
                              {program.level === 'undergraduate' ? 'UG' : 'PG'}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                          {program.overview}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span className="font-medium">Entry Salary:</span>
                            <span className="ml-2 text-accent font-semibold">
                              {program.salary_scope.india.entry_level}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {program.core_subjects.slice(0, 2).map((subject, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full border border-accent/20"
                              >
                                {subject.split(' ')[0]}
                              </span>
                            ))}
                            {program.core_subjects.length > 2 && (
                              <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                                +{program.core_subjects.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {programs.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No programs available in this department yet.</p>
                      <p className="text-sm">Check back soon for new programs!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Program Details Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="discord-card max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <ProgramInfo program={selectedProgram} onClose={handleCloseProgram} />
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-12">
        <div className="discord-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
            Department Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {departments.map((dept) => {
              const count = getProgramCount(dept.id)
              return (
                <div key={dept.id} className="text-center">
                  <div className="text-2xl mb-1">{dept.icon}</div>
                  <div className="text-sm font-medium text-foreground">{dept.name.split(' ').slice(-1)[0]}</div>
                  <div className="text-lg font-bold text-accent">{count}</div>
                  <div className="text-xs text-muted-foreground">Programs</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
