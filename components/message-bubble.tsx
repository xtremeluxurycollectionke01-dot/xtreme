// components/message-bubble.tsx
import { Message, Reaction } from "@/types/chat";
import { formatDistanceToNow } from "date-fns";
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  onReact: (messageId: string, emoji: string) => void;
}

const formatText = (text: string, style?: string) => {
  if (style === "bold") {
    return <span className="font-bold">{text}</span>;
  }
  if (style === "italic") {
    return <span className="italic">{text}</span>;
  }
  if (style === "code") {
    return <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs">{text}</code>;
  }
  // Handle markdown-like syntax
  let formatted = text;
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");
  formatted = formatted.replace(/`(.*?)`/g, "<code class='bg-gray-100 px-1 py-0.5 rounded font-mono text-xs'>$1</code>");
  return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
};

const commonEmojis = ["👍", "❤️", "😄", "🎉", "📚", "🤔"];

export function MessageBubble({ message, isOwn, onReact }: MessageBubbleProps) {
  const [showReactions, setShowReactions] = useState(false);

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] ${isOwn ? "items-end" : "items-start"}`}>
        <div className="flex items-center gap-2">
          {!isOwn && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-700">
              {message.sender.avatarInitial}
            </div>
          )}
          <div
            className={`group relative rounded-2xl px-4 py-2 text-sm ${
              isOwn ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
            }`}
          >
            <div className="whitespace-pre-wrap break-words">{formatText(message.text, message.style)}</div>
            <div className={`mt-1 text-right text-[10px] ${isOwn ? "text-gray-300" : "text-gray-500"}`}>
              {formatDistanceToNow(message.timestamp, { addSuffix: true })}
            </div>

            {/* Reaction button */}
            <button
              onClick={() => setShowReactions(!showReactions)}
              className={`absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100 ${
                isOwn ? "left-auto right-0" : "left-0 right-auto"
              }`}
            >
              <span className="rounded-full bg-gray-200 px-1.5 py-0.5 text-xs text-gray-600">+</span>
            </button>

            {/* Reaction picker */}
            {showReactions && (
              <div
                className={`absolute bottom-full mb-2 flex gap-1 rounded-full bg-white p-1 shadow-lg ring-1 ring-gray-200 ${
                  isOwn ? "right-0" : "left-0"
                }`}
              >
                {commonEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      onReact(message.id, emoji);
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
        </div>

        {/* Reactions display */}
        {message.reactions.length > 0 && (
          <div className={`mt-1 flex flex-wrap gap-1 ${!isOwn ? "ml-8" : "mr-2 justify-end"}`}>
            {message.reactions.map((reaction: { emoji: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; userName: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, idx: Key | null | undefined) => (
              <span
                key={idx}
                className="inline-flex items-center gap-0.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600"
              >
                {reaction.emoji}
                {reaction.userName !== "You" && <span className="text-[10px]">{reaction.userName}</span>}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}