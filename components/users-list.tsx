// components/users-list.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/chat";
import { formatDistanceToNow } from "date-fns";

// Dummy users data
const dummyUsers: User[] = [
  {
    id: "user1",
    name: "Alex Morgan",
    avatarInitial: "A",
    status: "online",
    lastActive: new Date(),
    bio: "book lover | minimalist",
  },
  {
    id: "user2",
    name: "Jamie Chen",
    avatarInitial: "J",
    status: "offline",
    lastActive: new Date(Date.now() - 1000 * 60 * 30),
    bio: "writer & poet",
  },
  {
    id: "user3",
    name: "Taylor Swift",
    avatarInitial: "T",
    status: "online",
    lastActive: new Date(),
    bio: "music in text form 🎵",
  },
  {
    id: "user4",
    name: "Jordan Lee",
    avatarInitial: "J",
    status: "away",
    lastActive: new Date(Date.now() - 1000 * 60 * 15),
    bio: "coding and coffee",
  },
  {
    id: "user5",
    name: "Casey Kim",
    avatarInitial: "C",
    status: "offline",
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2),
    bio: "philosophy nerd",
  },
  {
    id: "user6",
    name: "Riley Patil",
    avatarInitial: "R",
    status: "online",
    lastActive: new Date(),
    bio: "words are my playground",
  },
];

// Dummy last message previews
const lastMessages: Record<string, { text: string; timestamp: Date; unread: boolean }> = {
  user1: {
    text: "Have you read that new article about minimalism?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    unread: true,
  },
  user2: {
    text: "I just finished writing a new poem!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unread: false,
  },
  user3: {
    text: "Text-only spaces are so refreshing",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    unread: false,
  },
  user4: {
    text: "Want to play a text game later?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unread: false,
  },
  user5: {
    text: "What's your favorite book right now?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    unread: true,
  },
  user6: {
    text: "The beauty of text is in its simplicity",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    unread: false,
  },
};

export function UsersList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = dummyUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.bio?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserClick = (userId: string) => {
    router.push(`/chat/${userId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="h-full">
      {/* Search bar */}
      <div className="sticky top-0 bg-white px-4 pt-3 pb-2">
        <input
          type="text"
          placeholder="Search users or bio..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm placeholder:text-gray-400 focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
      </div>

      {/* Users list */}
      <div className="divide-y divide-gray-100">
        {filteredUsers.map((user) => {
          const lastMsg = lastMessages[user.id];
          return (
            <button
              key={user.id}
              onClick={() => handleUserClick(user.id)}
              className="flex w-full items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50"
            >
              {/* Avatar */}
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-700">
                  {user.avatarInitial}
                </div>
                <div
                  className={`absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full ring-2 ring-white ${getStatusColor(
                    user.status || "offline"
                  )}`}
                />
              </div>

              {/* User info */}
              <div className="flex-1 text-left">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  {lastMsg && (
                    <span className="text-[10px] text-gray-400">
                      {formatDistanceToNow(lastMsg.timestamp, { addSuffix: true })}
                    </span>
                  )}
                </div>
                {user.bio && <p className="mt-0.5 text-xs text-gray-500">{user.bio}</p>}
                {lastMsg && (
                  <p className="mt-1 truncate text-xs text-gray-400">
                    {lastMsg.unread && <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />}
                    {lastMsg.text}
                  </p>
                )}
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-400">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}