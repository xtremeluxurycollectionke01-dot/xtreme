// components/status-feed.tsx
"use client";

import { useState, useEffect } from "react";
import { Status } from "@/types/status";
import { StatusUpdate } from "./status-update";
import { StatusModal } from "./status-modal";
import { formatDistanceToNow } from "date-fns";

// Dummy status data
const dummyStatuses: Status[] = [
  {
    id: "1",
    userId: "user1",
    userName: "Alex Morgan",
    userAvatar: "A",
    text: "the beauty of text is that it lets your imagination paint the pictures",
    type: "thinking",
    emoji: "💭",
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 23),
    reactions: [{ emoji: "❤️", userId: "current", userName: "You" }],
  },
  {
    id: "2",
    userId: "user2",
    userName: "Jamie Chen",
    userAvatar: "J",
    text: "The Midnight Library by Matt Haig",
    type: "reading",
    emoji: "📖",
    createdAt: new Date(Date.now() - 1000 * 60 * 120),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 22),
    reactions: [],
  },
  {
    id: "3",
    userId: "user3",
    userName: "Taylor Swift",
    userAvatar: "T",
    text: "inspired by autumn leaves falling",
    type: "feeling",
    emoji: "🌟",
    createdAt: new Date(Date.now() - 1000 * 60 * 180),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 21),
    reactions: [{ emoji: "👍", userId: "other", userName: "Alex" }],
  },
];

export function StatusFeed() {
  const [statuses, setStatuses] = useState<Status[]>(dummyStatuses);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);

  // Clean up expired statuses every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setStatuses(prev => prev.filter(s => new Date() < s.expiresAt));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handlePostStatus = (text: string, type: any, emoji?: string) => {
    const newStatus: Status = {
      id: Date.now().toString(),
      userId: "current",
      userName: "You",
      userAvatar: "Y",
      text,
      type,
      emoji,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      reactions: [],
    };
    setStatuses(prev => [newStatus, ...prev]);
  };

  const handleReact = (statusId: string, emoji: string) => {
    setStatuses(prev =>
      prev.map(status => {
        if (status.id === statusId) {
          const existingReaction = status.reactions.find((r: { emoji: string; userId: string; }) => r.emoji === emoji && r.userId === "current");
          if (existingReaction) {
            return {
              ...status,
              reactions: status.reactions.filter((r: { emoji: string; userId: string; }) => !(r.emoji === emoji && r.userId === "current")),
            };
          } else {
            return {
              ...status,
              reactions: [...status.reactions, { emoji, userId: "current", userName: "You" }],
            };
          }
        }
        return status;
      })
    );
  };

  const handleViewStatus = (statusId: string) => {
    const status = statuses.find(s => s.id === statusId);
    if (status) setSelectedStatus(status);
  };

  return (
    <div className="border-b border-gray-100 bg-white">
      {/* Your own status section */}
      <div className="px-4 py-3">
        <button
          onClick={() => setShowStatusModal(true)}
          className="flex w-full items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-3 transition-colors hover:border-gray-400"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-700">
            Y
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm text-gray-500">Share a text status...</p>
            <p className="text-xs text-gray-400">What are you thinking, reading, or feeling?</p>
          </div>
          <span className="text-gray-400">✍️</span>
        </button>
      </div>

      {/* Statuses list */}
      {statuses.length > 0 && (
        <div className="space-y-2 px-4 pb-3">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Recent updates
          </p>
          {statuses.map(status => (
            <StatusUpdate
              key={status.id}
              status={status}
              onReact={handleReact}
              onView={handleViewStatus}
            />
          ))}
        </div>
      )}

      {/* Status modal */}
      {showStatusModal && (
        <StatusModal
          onClose={() => setShowStatusModal(false)}
          onPost={handlePostStatus}
        />
      )}

      {/* Full status view modal */}
      {selectedStatus && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-lg">
                {selectedStatus.userAvatar}
              </div>
              <div>
                <p className="font-medium text-gray-900">{selectedStatus.userName}</p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(selectedStatus.createdAt, { addSuffix: true })}
                </p>
              </div>
            </div>
            <p className="mb-6 text-lg leading-relaxed text-gray-800">
              {selectedStatus.emoji && <span className="mr-2 text-2xl">{selectedStatus.emoji}</span>}
              {selectedStatus.text}
            </p>
            <button
              onClick={() => setSelectedStatus(null)}
              className="w-full rounded-lg border border-gray-200 py-2 text-sm text-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}