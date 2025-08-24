"use client"

import { useState, useEffect } from "react"
import FAQService, { FAQItem } from "@/lib/faq-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, BookOpen, TrendingUp, Info } from "lucide-react"

interface FAQStats {
  total: number
  categories: { category: string; count: number }[]
}

export function FAQDemo() {
  const [faqService, setFaqService] = useState<FAQService | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<FAQItem[]>([])
  const [stats, setStats] = useState<FAQStats | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [popularFAQs, setPopularFAQs] = useState<FAQItem[]>([])

  useEffect(() => {
    const service = FAQService.getInstance()
    setFaqService(service)
    
    if (service.isServiceReady()) {
      setStats({
        total: service.getTotalFAQCount(),
        categories: service.getCategoryStats()
      })
      setCategories(service.getCategories())
      setPopularFAQs(service.getFAQsByPopularTopics())
    }
  }, [])

  const handleSearch = () => {
    if (!faqService || !searchQuery.trim()) return
    
    const results = faqService.searchFAQs(searchQuery)
    setSearchResults(results)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  if (!faqService) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading FAQ Service...</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">FAQ System Demo</h1>
        <p className="text-muted-foreground">
          Test the FAQ system with {stats?.total || 0} questions across {categories.length} categories
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="discord-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-accent" />
                Total FAQs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{stats.total}</p>
            </CardContent>
          </Card>

          <Card className="discord-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5 text-accent" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{stats.categories.length}</p>
            </CardContent>
          </Card>

          <Card className="discord-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                Top Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium text-foreground">
                {stats.categories.sort((a, b) => b.count - a.count)[0]?.category || 'N/A'}
              </p>
              <p className="text-sm text-muted-foreground">
                {stats.categories.sort((a, b) => b.count - a.count)[0]?.count || 0} questions
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search Section */}
      <Card className="discord-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-accent" />
            Search FAQs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Search for questions about admissions, courses, fees, etc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 discord-input"
            />
            <Button onClick={handleSearch} className="discord-button">
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card className="discord-card">
          <CardHeader>
            <CardTitle>Search Results ({searchResults.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.slice(0, 5).map((faq, index) => (
                <div key={index} className="p-4 bg-muted/30 rounded-lg border border-border">
                  <h3 className="font-medium text-foreground mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{faq.answer}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 bg-accent/20 text-accent rounded-full">
                      {faq.category}
                    </span>
                    {faq.score && (
                      <span className="text-muted-foreground">
                        Relevance: {Math.round(faq.score)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Popular FAQs */}
      {popularFAQs.length > 0 && (
        <Card className="discord-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Popular Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {popularFAQs.map((faq, index) => (
                <div key={index} className="p-3 bg-muted/30 rounded-lg">
                  <h4 className="font-medium text-foreground text-sm">{faq.question}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{faq.answer}</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-accent/20 text-accent rounded-full text-xs">
                    {faq.category}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <Card className="discord-card">
          <CardHeader>
            <CardTitle>All Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="p-3 bg-muted/30 rounded-lg text-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => {
                    setSearchQuery(category)
                    handleSearch()
                  }}
                >
                  <span className="text-sm font-medium text-foreground">{category}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
