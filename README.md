# RACAD-IO Chatbot

An intelligent AI-powered chatbot for college information, built with Next.js and featuring a modern, immersive chat interface.

## Features

### 🎨 **Immersive Chat UI**
- **Modern Design**: Beautiful, responsive interface built with ShadCN UI components
- **Gradient Backgrounds**: Subtle gradients and backdrop blur effects for depth
- **Smooth Animations**: Fluid transitions and micro-interactions throughout the interface
- **Dark/Light Mode**: Automatic theme switching based on system preferences

### 💬 **Advanced Chat Experience**
- **Real-time Streaming**: Instant, streaming responses from the AI
- **Message History**: Persistent chat sessions with automatic saving
- **Smart Typing Indicators**: Animated loading states during AI responses
- **Message Timestamps**: Track when conversations happened

### 📱 **Responsive & Accessible**
- **Mobile-First**: Optimized for all device sizes
- **Keyboard Navigation**: Full keyboard accessibility support
- **Screen Reader Friendly**: Proper ARIA labels and semantic HTML
- **Touch Gestures**: Intuitive mobile interactions

### 🗂️ **Chat Management**
- **Session History**: Browse and manage all your previous conversations
- **Smart Naming**: Automatic session titles based on first message
- **Quick Actions**: Delete sessions, start new chats with one click
- **Local Storage**: All data persists locally in your browser

### 🎯 **College Information Focus**
- **Admissions**: Application processes, requirements, deadlines
- **Courses**: Program details, curriculum, specializations
- **Fees**: Tuition, scholarships, payment options
- **Facilities**: Campus amenities, libraries, labs
- **Rules**: Academic policies, conduct guidelines
- **Events**: Campus activities, seminars, workshops
- **Contacts**: Department information, staff details

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: ShadCN UI, Radix UI primitives
- **Styling**: Tailwind CSS 4 with custom design system
- **Icons**: Lucide React for consistent iconography
- **State Management**: React hooks with localStorage persistence

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
college-chatbot/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── ui/               # ShadCN UI components
│   │   ├── button.tsx    # Button component
│   │   ├── card.tsx      # Card components
│   │   ├── input.tsx     # Input component
│   │   └── scroll-area.tsx # Scroll area component
│   ├── chat-interface.tsx # Main chat interface
│   ├── chat-history.tsx   # Chat session sidebar
│   ├── chat-input.tsx     # Message input component
│   └── chat-message.tsx   # Individual message display
├── lib/                   # Utility functions
│   └── utils.ts          # Helper functions and class utilities
└── public/                # Static assets
```

## Key Components

### ChatInterface
The main component that orchestrates the entire chat experience, managing sessions, messages, and the overall layout.

### ChatHistory
A sidebar component that displays all chat sessions with options to create new chats, delete sessions, and switch between conversations.

### ChatMessage
Individual message components with proper styling for user and AI messages, including avatars and timestamps.

### ChatInput
The message input area with modern styling, emoji support, and attachment options.

## Customization

### Colors & Themes
Modify the CSS variables in `app/globals.css` to customize the color scheme:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96%;
  --muted: 210 40% 96%;
  /* ... more variables */
}
```

### Component Styling
All components use Tailwind CSS classes and can be customized by modifying the className props or extending the base components.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using Next.js and modern web technologies.
