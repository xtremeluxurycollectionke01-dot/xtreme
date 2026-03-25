// components/status-update.tsx
"use client";

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react";
import { Status, StatusType } from "@/types/status";
import { formatDistanceToNow } from "date-fns";

interface StatusUpdateProps {
  status: Status;
  onReact: (statusId: string, emoji: string) => void;
  onView: (statusId: string) => void;
}

const statusTypeIcons = {
  thinking: "💭",
  reading: "📖",
  doing: "🎯",
  feeling: "🌟",
  custom: "✨",
};

export function StatusUpdate({ status, onReact, onView }: StatusUpdateProps) {
  const [showReactions, setShowReactions] = useState(false);
  const isExpired = new Date() > status.expiresAt;

  if (isExpired) return null;

  return (
    <div className="group relative rounded-lg border border-gray-100 bg-white p-3 transition-all hover:shadow-sm">
      <div className="flex items-start gap-3">
        {/* Avatar with status ring */}
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-700">
            {status.userAvatar}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 text-xs">
            {statusTypeIcons[status.type]}
          </div>
        </div>

        {/* Status content */}
        <div className="flex-1 cursor-pointer" onClick={() => onView(status.id)}>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-sm font-medium text-gray-900">{status.userName}</span>
            <span className="text-[10px] text-gray-400">
              {formatDistanceToNow(status.createdAt, { addSuffix: true })}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-700">
            {status.emoji && <span className="mr-1">{status.emoji}</span>}
            {status.text}
          </p>
          
          {/* Reaction preview */}
          {status.reactions.length > 0 && (
            <div className="mt-2 flex gap-1">
              {status.reactions.slice(0, 3).map((reaction: { emoji: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, idx: Key | null | undefined) => (
                <span key={idx} className="text-xs text-gray-500">
                  {reaction.emoji}
                </span>
              ))}
              {status.reactions.length > 3 && (
                <span className="text-xs text-gray-400">+{status.reactions.length - 3}</span>
              )}
            </div>
          )}
        </div>

        {/* Quick reaction button */}
        <button
          onClick={() => setShowReactions(!showReactions)}
          className="opacity-0 transition-opacity group-hover:opacity-100"
        >
          <span className="text-xs text-gray-400">❤️</span>
        </button>
      </div>

      {/* Reaction picker */}
      {showReactions && (
        <div className="absolute right-3 top-12 z-10 flex gap-1 rounded-full bg-white p-1 shadow-lg ring-1 ring-gray-200">
          {["❤️", "👍", "😮", "📚", "💭"].map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                onReact(status.id, emoji);
                setShowReactions(false);
              }}
              className="rounded-full p-1 text-sm transition-colors hover:bg-gray-100"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}