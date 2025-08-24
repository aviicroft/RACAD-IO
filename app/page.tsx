"use client";

import { useState, useEffect } from "react";
import { ChatInterface } from "@/components/chat-interface";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen gradient-animated flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-white font-semibold text-lg">Loading RACAD IO...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-animated">
      <ChatInterface />
    </div>
  );
}
