"use client"

import { useState, useEffect } from 'react'
import { programService, Program, departments } from '@/lib/services/program-service'
import { ProgramInfo } from './program-info'
import { Search, GraduationCap, Building2 } from 'lucide-react'

export function ProgramSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [programs, setPrograms] = useState<Program[]>([])
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [showAllPrograms, setShowAllPrograms] = useState(true)

  const levels = [
    'All Levels',
    'Undergraduate',
    'Postgraduate'
  ]

  useEffect(() => {
    if (searchQuery) {
      const results = programService.searchPrograms(searchQuery)
      setPrograms(results)
      setShowAllPrograms(false)
    } else if (selectedDepartment && selectedDepartment !== 'All Departments') {
      const results = programService.getProgramsByDepartment(selectedDepartment)
      setPrograms(results)
      setShowAllPrograms(false)
    } else if (selectedLevel && selectedLevel !== 'All Levels') {
      const level = selectedLevel.toLowerCase() as 'undergraduate' | 'postgraduate'
      const results = programService.getProgramsByLevel(level)
      setPrograms(results)
      setShowAllPrograms(false)
    } else {
      const allPrograms = programService.getAllPrograms()
      setPrograms(allPrograms)
      setShowAllPrograms(true)
    }
  }, [searchQuery, selectedDepartment, selectedLevel])

  const handleProgramSelect = (program: Program) => {
    setSelectedProgram(program)
  }

  const handleCloseProgram = () => {
    setSelectedProgram(null)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedDepartment('')
    setSelectedLevel('')
    setPrograms(programService.getAllPrograms())
    setShowAllPrograms(true)
  }

  const getDepartmentName = (departmentId: string) => {
    const dept = departments.find(d => d.id === departmentId)
    return dept ? dept.name.split(' ').slice(-1)[0] : departmentId
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Search and Filters */}
      <div className="discord-card p-6 mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Search className="h-6 w-6 text-accent" />
          Search & Browse Programs
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search programs, subjects, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
            />
          </div>

          {/* Department Filter */}
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all appearance-none cursor-pointer"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div className="relative">
            <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all appearance-none cursor-pointer"
            >
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {(searchQuery || selectedDepartment || selectedLevel) && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchQuery && (
                           <span className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full border border-accent/20">
               Search: &quot;{searchQuery}&quot;
             </span>
            )}
            {selectedDepartment && selectedDepartment !== 'All Departments' && (
              <span className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full border border-accent/20">
                Department: {getDepartmentName(selectedDepartment)}
              </span>
            )}
            {selectedLevel && selectedLevel !== 'All Levels' && (
              <span className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full border border-accent/20">
                Level: {selectedLevel}
              </span>
            )}
            <button
              onClick={clearFilters}
              className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full border border-border hover:bg-muted/80 transition-colors"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {programs.length} of {programService.getTotalProgramCount()} programs
          </div>
          {!showAllPrograms && (
            <button
              onClick={() => {
                setPrograms(programService.getAllPrograms())
                setShowAllPrograms(true)
              }}
              className="text-sm text-accent hover:text-accent/80 transition-colors"
            >
              View All Programs
            </button>
          )}
        </div>
      </div>

      {/* Programs Grid */}
      {programs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, index) => (
            <div
              key={index}
              onClick={() => handleProgramSelect(program)}
              className="discord-card hover:shadow-lg transition-all duration-300 cursor-pointer p-6 border border-border hover:border-accent/30 group"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="h-10 w-10 rounded-full discord-gradient flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                    {program.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs rounded-full border ${
                      program.level === 'undergraduate' 
                        ? 'bg-blue-100 text-blue-800 border-blue-200' 
                        : 'bg-purple-100 text-purple-800 border-purple-200'
                    }`}>
                      {program.level === 'undergraduate' ? 'UG' : 'PG'}
                    </span>
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full border border-border">
                      {getDepartmentName(program.department)}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                {program.overview}
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Entry Salary:</span>
                  <span className="text-accent font-semibold">
                    {program.salary_scope.india.entry_level}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {program.core_subjects.slice(0, 3).map((subject, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full border border-accent/20"
                    >
                      {subject.split(' ')[0]}
                    </span>
                  ))}
                  {program.core_subjects.length > 3 && (
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                      +{program.core_subjects.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="discord-card p-12 text-center">
          <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No programs found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or filters to find more programs.
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            Clear Filters
          </button>
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
