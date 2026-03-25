// components/chat-interface.tsx (updated)
"use client";

import { useState, useRef, useEffect } from "react";
import { Message, User, Reaction } from "@/types/chat";
import { MessageBubble } from "./message-bubble";
import { ChatInput } from "./chat-input";
import { TypingIndicator } from "./typing-indicator";
import { GameModal } from "./game-modal";

interface ChatInterfaceProps {
  otherUserId: string;
  otherUser: { name: string; avatarInitial: string };
}

const currentUser: User = {
  id: "currentUser",
  name: "You",
  avatarInitial: "Y",
};

// Generate dummy messages based on other user
const getInitialMessages = (otherUserName: string): Message[] => {
  return [
    {
      id: "1",
      text: `Hey! Great to connect with you on TextChat. How's your day going?`,
      sender: { id: "other", name: otherUserName, avatarInitial: otherUserName[0] },
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      reactions: [],
    },
    {
      id: "2",
      text: "I'm loving this text-only experience. So focused and intentional.",
      sender: currentUser,
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      reactions: [],
    },
    {
      id: "3",
      text: "Right? No distractions, just pure conversation. Did you try the text games yet?",
      sender: { id: "other", name: otherUserName, avatarInitial: otherUserName[0] },
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      reactions: [{ emoji: "🎮", userId: currentUser.id, userName: currentUser.name }],
    },
    {
      id: "4",
      text: "Not yet! I saw you can type /game to start. Want to play something?",
      sender: currentUser,
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      reactions: [],
    },
    {
      id: "5",
      text: "*excited* Yes! Let's play Word Ladder later. It's so satisfying to solve.",
      sender: { id: "other", name: otherUserName, avatarInitial: otherUserName[0] },
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      reactions: [],
    },
  ];
};

export function ChatInterface({ otherUserId, otherUser }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(() => getInitialMessages(otherUser.name));
  const [isTyping, setIsTyping] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [gameResult, setGameResult] = useState<{ winner: string; score: number } | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text: string, style?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: currentUser,
      timestamp: new Date(),
      reactions: [],
      style: style as any,
    };
    setMessages((prev) => [...prev, newMessage]);

    // Simulate typing indicator and reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAutoReply(text, otherUser.name),
        sender: { id: "other", name: otherUser.name, avatarInitial: otherUser.avatarInitial },
        timestamp: new Date(),
        reactions: [],
      };
      setMessages((prev) => [...prev, replyMessage]);
    }, 1500);
  };

  const getAutoReply = (userMessage: string, otherName: string): string => {
    const lowerMsg = userMessage.toLowerCase();
    if (lowerMsg.includes("game") || lowerMsg.includes("play")) {
      return "Want to play a text game? Type /game to start! 🎮";
    }
    if (lowerMsg.includes("reaction")) {
      return "You can react to any message with text emojis! Just click the + button.";
    }
    if (lowerMsg.includes("style") || lowerMsg.includes("bold")) {
      return "I see you're using text styles! *asterisks* for italic, **double** for bold.";
    }
    if (lowerMsg.includes("quote")) {
      return `That reminds me of a great quote I saw on the quotes feed. You should check it out!`;
    }
    return `That's interesting! Tell me more about it.`;
  };

  const handleReact = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find((r) => r.emoji === emoji && r.userId === currentUser.id);
          if (existingReaction) {
            return {
              ...msg,
              reactions: msg.reactions.filter((r) => !(r.emoji === emoji && r.userId === currentUser.id)),
            };
          } else {
            return {
              ...msg,
              reactions: [...msg.reactions, { emoji, userId: currentUser.id, userName: currentUser.name }],
            };
          }
        }
        return msg;
      })
    );
  };

  const handleGameStart = () => {
    setShowGameModal(true);
  };

  const handleGameEnd = (winner: string, score: number) => {
    setGameResult({ winner, score });
    setShowGameModal(false);
    // Send game result as a system-like message
    const gameMessage: Message = {
      id: Date.now().toString(),
      text: `🎮 Game ended! ${winner === "user" ? "You" : otherUser.name} won with ${score} points!`,
      sender: {
        id: "system",
        name: "Game Bot",
        avatarInitial: "🎮",
      },
      timestamp: new Date(),
      reactions: [],
    };
    setMessages((prev) => [...prev, gameMessage]);
    setTimeout(() => {
      setGameResult(null);
    }, 5000);
  };

  const otherUserObj: User = {
    id: otherUserId,
    name: otherUser.name,
    avatarInitial: otherUser.avatarInitial,
  };

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.sender.id === currentUser.id}
              onReact={handleReact}
            />
          ))}
          {isTyping && <TypingIndicator name={otherUser.name} />}
          {gameResult && (
            <div className="rounded-lg bg-gray-50 p-3 text-center text-sm text-gray-600">
              🎉 {gameResult.winner === "user" ? "You won!" : `${otherUser.name} won!`} Final score: {gameResult.score}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 p-4">
        <ChatInput onSendMessage={handleSendMessage} onGameStart={handleGameStart} />
      </div>

      {/* Game Modal */}
      {showGameModal && <GameModal onClose={() => setShowGameModal(false)} onGameEnd={handleGameEnd} />}
    </div>
  );
}