// components/bottom-nav.tsx
/*import { Users, Quote } from "lucide-react";

interface BottomNavProps {
  activeTab: "users" | "quotes";
  onTabChange: (tab: "users" | "quotes") => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div className="border-t border-gray-100 bg-white">
      <div className="flex">
        <button
          onClick={() => onTabChange("users")}
          className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors ${
            activeTab === "users" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Users size={20} />
          <span>Chats</span>
        </button>

        <button
          onClick={() => onTabChange("quotes")}
          className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors ${
            activeTab === "quotes" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Quote size={20} />
          <span>Quotes</span>
        </button>
      </div>
    </div>
  );
}*/

// components/bottom-nav.tsx (updated)
import { MessageSquare, Users, Quote, Sparkles } from "lucide-react";

interface BottomNavProps {
  activeTab: "status" | "users" | "quotes";
  onTabChange: (tab: "status" | "users" | "quotes") => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div className="border-t border-gray-100 bg-white">
      <div className="flex">

        <button
          onClick={() => onTabChange("users")}
          className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors ${
            activeTab === "users" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Users size={20} />
          <span>Chats</span>
        </button>

                <button
          onClick={() => onTabChange("status")}
          className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors ${
            activeTab === "status" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Sparkles size={20} />
          <span>Posts</span>
        </button>

        <button
          onClick={() => onTabChange("quotes")}
          className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors ${
            activeTab === "quotes" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Quote size={20} />
          <span>Thoughts</span>
        </button>
      </div>
    </div>
  );
}