import { ChatMessageMarkdown } from "./chat-message-markdown"

export function MarkdownDemo() {
  const handleFAQSelect = (faq: { question: string; answer: string }) => {
    // This could trigger a new chat message or expand the FAQ
    console.log('Selected FAQ:', faq)
    alert(`You selected: ${faq.question}\n\nAnswer: ${faq.answer}`)
  }
  const demoMessages = [
    {
      role: "user" as const,
      content: "Can you show me how to create a React component with TypeScript?",
      timestamp: new Date("2024-01-15T10:00:00Z"),
    },
    {
      role: "assistant" as const,
      content: `# React Component with TypeScript 🚀

Here's how to create a **professional React component** using TypeScript:

## Basic Component Structure

\`\`\`typescript
import React, { useState, useEffect } from 'react'

interface ButtonProps {
  text: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  variant = 'primary',
  disabled = false
}) => {
  const [isHovered, setIsHovered] = useState(false)
  
  useEffect(() => {
    // Component mount logic
    console.log('Button mounted')
    
    return () => {
      // Cleanup logic
      console.log('Button unmounted')
    }
  }, [])
  
  return (
    <button
      className={\`btn btn-\${variant} \${isHovered ? 'hover' : ''}\`}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {text}
    </button>
  )
}
\`\`\`

## Key Features

- **Type Safety**: Full TypeScript support with interfaces
- **State Management**: Uses React hooks for state
- **Event Handling**: Proper event handlers with types
- **Styling**: CSS classes with dynamic variants

## Usage Example

\`\`\`tsx
import { Button } from './Button'

function App() {
  const handleClick = () => {
    alert('Button clicked!')
  }
  
  return (
    <div>
      <Button 
        text="Click Me!" 
        onClick={handleClick}
        variant="primary"
      />
      <Button 
        text="Disabled Button" 
        onClick={handleClick}
        variant="secondary"
        disabled={true}
      />
    </div>
  )
}
\`\`\`

## Best Practices

1. **Always define interfaces** for your props
2. **Use meaningful names** for variables and functions
3. **Implement proper error handling**
4. **Add JSDoc comments** for complex logic
5. **Test your components** thoroughly

> 💡 **Pro Tip**: Use the \`React.FC\` type for functional components and always provide default values for optional props!

## Component Checklist

- [ ] Props interface defined
- [ ] TypeScript types added
- [ ] State management implemented
- [ ] Event handlers typed
- [ ] Styling classes applied
- [ ] Error boundaries added
- [ ] Unit tests written

This approach ensures your components are **type-safe**, **maintainable**, and **professional**! 🎯`,
      timestamp: new Date("2024-01-15T10:01:00Z"),
      metadata: {
        confidence: 0.98,
        source: "ai_generated",
        category: "Programming",
        relatedFAQs: []
      }
    },
    {
      role: "user" as const,
      content: "Thanks! Can you also show me a data table example?",
      timestamp: new Date("2024-01-15T10:02:00Z"),
    },
    {
      role: "assistant" as const,
      content: `# Data Table Example 📊

Here's a **professional data table** component with sorting and pagination:

## Table Component

\`\`\`typescript
interface User {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  lastLogin: Date
}

interface DataTableProps {
  data: User[]
  columns: Column[]
  pageSize?: number
  sortable?: boolean
}

export const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  pageSize = 10,
  sortable = true
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  
  // Pagination logic
  const totalPages = Math.ceil(data.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentData = data.slice(startIndex, endIndex)
  
  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sortField) return currentData
    
    return [...currentData].sort((a, b) => {
      const aValue = a[sortField as keyof User]
      const bValue = b[sortField as keyof User]
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [currentData, sortField, sortDirection])
  
  return (
    <div className="data-table">
      <table className="min-w-full">
        <thead>
          <tr>
            {columns.map(column => (
              <th 
                key={column.key}
                className="px-4 py-2 border-b border-gray-200"
                onClick={() => sortable && handleSort(column.key)}
              >
                {column.label}
                {sortable && sortField === column.key && (
                  <span className="ml-2">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map(user => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{user.id}</td>
              <td className="px-4 py-2 border-b">{user.name}</td>
              <td className="px-4 py-2 border-b">{user.email}</td>
              <td className="px-4 py-2 border-b">{user.role}</td>
              <td className="px-4 py-2 border-b">
                <span className={\`status-\${user.status}\`}>
                  {user.status}
                </span>
              </td>
              <td className="px-4 py-2 border-b">
                {user.lastLogin.toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Pagination */}
      <div className="pagination">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button 
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  )
}
\`\`\`

## Sample Data

| ID | Name | Email | Role | Status | Last Login |
|----|------|-------|------|--------|------------|
| 1 | John Doe | john@example.com | Admin | Active | 2024-01-15 |
| 2 | Jane Smith | jane@example.com | User | Active | 2024-01-14 |
| 3 | Bob Johnson | bob@example.com | Editor | Inactive | 2024-01-10 |

## Features

- ✅ **Sortable columns** with visual indicators
- ✅ **Pagination** with configurable page size
- ✅ **Responsive design** for mobile devices
- ✅ **Hover effects** for better UX
- ✅ **Type-safe** with TypeScript interfaces
- ✅ **Accessible** with proper ARIA labels

## Styling

\`\`\`css
.data-table {
  @apply shadow-lg rounded-lg overflow-hidden;
}

.data-table th {
  @apply bg-gray-100 text-gray-700 font-semibold cursor-pointer;
}

.data-table th:hover {
  @apply bg-gray-200;
}

.status-active {
  @apply bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs;
}

.status-inactive {
  @apply bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs;
}

.pagination {
  @apply flex items-center justify-between p-4 bg-gray-50;
}
\`\`\`

This table component provides a **professional**, **interactive** data display that's perfect for admin dashboards and data-heavy applications! 🎯✨`,
      timestamp: new Date("2024-01-15T10:03:00Z"),
      metadata: {
        confidence: 0.95,
        source: "ai_generated",
        category: "UI Components",
        relatedFAQs: []
      }
    }
  ]

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          🚀 Markdown-Supported Chat Interface
        </h1>
        <p className="text-muted-foreground">
          Professional Markdown rendering with syntax highlighting, tables, and interactive features
        </p>
      </div>
      
      <div className="space-y-4">
        {demoMessages.map((message, index) => (
          <ChatMessageMarkdown
            key={index}
            role={message.role}
            content={message.content}
            timestamp={message.timestamp}
            metadata={message.metadata}
            onFAQSelect={handleFAQSelect}
          />
        ))}
      </div>
      
      <div className="mt-8 p-6 bg-muted/30 rounded-lg border border-border">
        <h3 className="font-semibold text-foreground mb-4 text-lg">✨ Markdown Features Showcased:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-foreground mb-2">📝 Text Formatting</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Bold text</strong> and <em>italic text</em></li>
              <li>• ~~Strikethrough~~ and `inline code`</li>
              <li>• Headings (H1, H2, H3)</li>
              <li>• Blockquotes with left border</li>
              <li>• Horizontal rules and dividers</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-2">💻 Code & Data</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Syntax-highlighted code blocks</li>
              <li>• Copy button for each code block</li>
              <li>• Language detection and labels</li>
              <li>• Responsive data tables</li>
              <li>• Ordered and unordered lists</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-2">🔗 Interactive Elements</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Clickable external links</li>
              <li>• Hover effects on code blocks</li>
              <li>• Responsive table scrolling</li>
              <li>• Copy confirmation feedback</li>
              <li>• Smooth animations</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-2">🎨 Professional Styling</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Dark theme code highlighting</li>
              <li>• Consistent spacing and typography</li>
              <li>• Professional color scheme</li>
              <li>• Mobile-responsive design</li>
              <li>• Accessibility features</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
