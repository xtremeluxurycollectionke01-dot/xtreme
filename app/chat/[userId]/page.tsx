// app/chat/[userId]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { ChatInterface } from "@/components/chat-interface";
import { ArrowLeft } from "lucide-react";

// Dummy user data (in real app, fetch from API)
const getUserById = (id: string) => {
  const users = {
    user1: { name: "Alex Morgan", avatarInitial: "A" },
    user2: { name: "Jamie Chen", avatarInitial: "J" },
    user3: { name: "Taylor Swift", avatarInitial: "T" },
    user4: { name: "Jordan Lee", avatarInitial: "J" },
    user5: { name: "Casey Kim", avatarInitial: "C" },
    user6: { name: "Riley Patil", avatarInitial: "R" },
  };
  return users[id as keyof typeof users] || { name: "User", avatarInitial: "U" };
};

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  const user = getUserById(userId);

  return (
    <div className="flex h-full flex-col">
      {/* Custom header with back button */}
      <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
        <button
          onClick={() => router.back()}
          className="rounded-lg p-1 transition-colors hover:bg-gray-100"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-700">
            {user.avatarInitial}
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-900">{user.name}</h2>
            <p className="text-xs text-gray-500">text-only · distraction free</p>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <ChatInterface otherUserId={userId} otherUser={user} />
    </div>
  );
}