// components/Chat/ChatButton.tsx
"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatModal from "./ChatModal";
import { useAuth } from "@/components/AuthProvider";

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black p-4 rounded-full shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 group"
        style={{
          boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)",
        }}
      >
        {isOpen ? (
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        ) : (
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
        )}
      </button>

      <ChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}