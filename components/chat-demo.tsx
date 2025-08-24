import { ChatMessage } from "./chat-message"

export function ChatDemo() {
  const handleFAQSelect = (faq: { question: string; answer: string }) => {
    // This could trigger a new chat message or expand the FAQ
    console.log('Selected FAQ:', faq)
    alert(`You selected: ${faq.question}\n\nAnswer: ${faq.answer}`)
  }
  // Using fixed timestamps to prevent hydration mismatches between server and client
  const demoMessages = [
    {
      role: "user" as const,
      content: "Who is Bhavani?",
      timestamp: new Date("2024-01-15T10:00:00Z"), // Fixed timestamp
    },
    {
      role: "assistant" as const,
      content: "🌟 Meet Bhavani, the amazing 'Fire Engine' who's Avi's closest companion and source of endless happiness! She's more than just adorable — she's a powerhouse of determination and focus 🎯. Her ability to keep Avi smiling through everything is truly magical, and her goal-oriented mindset is absolutely inspiring. She deserves every bit of appreciation and more! 💖✨",
      timestamp: new Date("2024-01-15T10:01:00Z"), // Fixed timestamp
      metadata: {
        confidence: 1.0,
        source: "special_response",
        category: "Personal",
        relatedFAQs: []
      }
    },
    {
      role: "user" as const,
      content: "What are the admission requirements for computer science?",
      timestamp: new Date("2024-01-15T10:02:00Z"), // Fixed timestamp
    },
    {
      role: "assistant" as const,
      content: "The admission requirements for Computer Science at our college include:\n\n• High school diploma or equivalent\n• Minimum GPA of 3.0\n• SAT Math score of 600+ or ACT Math score of 25+\n• Completed high school courses in Mathematics (Algebra II, Pre-Calculus)\n• Basic programming experience (recommended)\n\nYou can find more detailed information on our website: [Admissions Page](https://example.com/admissions)\n\nWould you like me to help you with the application process?",
      timestamp: new Date("2024-01-15T10:03:00Z"), // Fixed timestamp
      metadata: {
        confidence: 0.95,
        source: "faq_enhanced",
        category: "Admissions",
        link: "https://example.com/admissions",
        relatedFAQs: [
          {
            question: "What is the application deadline?",
            answer: "Applications are due by March 1st for fall admission.",
            category: "Admissions",
            link: "https://example.com/deadlines"
          },
          {
            question: "Are there scholarships available?",
            answer: "Yes, we offer merit-based and need-based scholarships.",
            category: "Financial Aid",
            link: "https://example.com/scholarships"
          }
        ]
      }
    },
    {
      role: "user" as const,
      content: "Thanks! That's very helpful.",
      timestamp: new Date("2024-01-15T10:04:00Z"), // Fixed timestamp
    },
    {
      role: "assistant" as const,
      content: "You're welcome! I'm glad I could help with the admission requirements. If you have any other questions about the application process, financial aid, or campus life, feel free to ask. Good luck with your application! 🎓",
      timestamp: new Date("2024-01-15T10:05:00Z"), // Fixed timestamp
      metadata: {
        confidence: 0.88,
        source: "conversational",
        relatedFAQs: [
          {
            question: "What is campus life like?",
            answer: "Our campus offers a vibrant community with over 100 student organizations.",
            category: "Campus Life",
            link: "https://example.com/campus-life"
          }
        ]
      }
    }
  ]

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          ChatGPT-Style Chat Interface Demo
        </h1>
        <p className="text-muted-foreground">
          Hover over bot messages to see interactive actions (Copy, Share, TTS, Feedback)
        </p>
      </div>
      
      <div className="space-y-4">
        {demoMessages.map((message, index) => (
          <ChatMessage
            key={index}
            role={message.role}
            content={message.content}
            timestamp={message.timestamp}
            metadata={message.metadata}
            onFAQSelect={handleFAQSelect}
          />
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-muted/30 rounded-lg border border-border">
        <h3 className="font-semibold text-foreground mb-2">✨ New Features Added:</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <strong>Bhavani Special Response:</strong> Ask about Bhavani to see 8 different impressive variations! 💖✨</li>
          <li>• <strong>Copy Button:</strong> Copy responses to clipboard with visual feedback</li>
          <li>• <strong>Share Button:</strong> Share responses via native share API or copy to clipboard</li>
          <li>• <strong>TTS Button:</strong> Text-to-speech with pulse animation while playing</li>
          <li>• <strong>Feedback Buttons:</strong> Thumbs up/down with toggle states and visual feedback</li>
          <li>• <strong>Hover Actions:</strong> Actions appear on hover for clean UI</li>
          <li>• <strong>Enhanced Styling:</strong> Professional ChatGPT-style appearance with smooth animations</li>
        </ul>
      </div>
    </div>
  )
}
