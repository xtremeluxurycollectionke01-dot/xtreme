// components/status-modal.tsx
"use client";

import { useState } from "react";
import { StatusType } from "@/types/status";

interface StatusModalProps {
  onClose: () => void;
  onPost: (text: string, type: StatusType, emoji?: string) => void;
}

const statusTemplates = [
  { type: "thinking", emoji: "💭", text: "thinking about...", placeholder: "What's on your mind?" },
  { type: "reading", emoji: "📖", text: "reading", placeholder: "What book/article are you reading?" },
  { type: "doing", emoji: "🎯", text: "doing", placeholder: "What are you working on?" },
  { type: "feeling", emoji: "🌟", text: "feeling", placeholder: "How are you feeling today?" },
];

export function StatusModal({ onClose, onPost }: StatusModalProps) {
  const [selectedType, setSelectedType] = useState<StatusType>("thinking");
  const [text, setText] = useState("");
  const [customEmoji, setCustomEmoji] = useState("");

  const handleSubmit = () => {
    if (text.trim()) {
      const template = statusTemplates.find(t => t.type === selectedType);
      const emoji = selectedType === "custom" ? customEmoji : template?.emoji;
      onPost(text, selectedType, emoji);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-end bg-black/50 sm:items-center">
      <div className="w-full rounded-t-2xl bg-white p-4 sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Share a status</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {/* Status type selector */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
          {statusTemplates.map((template) => (
            <button
              key={template.type}
              onClick={() => setSelectedType(template.type as StatusType)}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm ${
                selectedType === template.type
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <span>{template.emoji}</span>
              <span>{template.text}</span>
            </button>
          ))}
          <button
            onClick={() => setSelectedType("custom")}
            className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm ${
              selectedType === "custom"
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <span>✨</span>
            <span>custom</span>
          </button>
        </div>

        {/* Custom emoji input */}
        {selectedType === "custom" && (
          <div className="mb-3">
            <input
              type="text"
              placeholder="Choose an emoji (optional)"
              value={customEmoji}
              onChange={(e) => setCustomEmoji(e.target.value)}
              maxLength={2}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>
        )}

        {/* Status text input */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            selectedType === "custom"
              ? "Share what's on your mind..."
              : statusTemplates.find(t => t.type === selectedType)?.placeholder
          }
          rows={3}
          className="mb-3 w-full resize-none rounded-lg border border-gray-200 p-3 text-sm focus:border-gray-300 focus:outline-none"
          autoFocus
        />

        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={!text.trim()}
            className="flex-1 rounded-lg bg-gray-800 py-2 text-sm text-white transition-colors hover:bg-gray-700 disabled:opacity-50"
          >
            Post Status
          </button>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600"
          >
            Cancel
          </button>
        </div>

        <p className="mt-3 text-center text-[10px] text-gray-400">
          Status disappears after 24 hours • Text-only expression
        </p>
      </div>
    </div>
  );
}