// components/chat-input.tsx
import { useState, KeyboardEvent } from "react";

interface ChatInputProps {
  onSendMessage: (text: string, style?: string) => void;
  onGameStart: () => void;
}

type TextStyle = "normal" | "bold" | "italic" | "code";

export function ChatInput({ onSendMessage, onGameStart }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [style, setStyle] = useState<TextStyle>("normal");

  const handleSend = () => {
    if (message.trim()) {
      if (message.trim() === "/game") {
        onGameStart();
        setMessage("");
        return;
      }
      onSendMessage(message, style !== "normal" ? style : undefined);
      setMessage("");
      setStyle("normal");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-2">
      {/* Style buttons */}
      <div className="flex gap-1">
        <button
          onClick={() => setStyle("normal")}
          className={`rounded-md px-2 py-1 text-xs ${
            style === "normal" ? "bg-gray-200 text-gray-900" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          Normal
        </button>
        <button
          onClick={() => setStyle("bold")}
          className={`rounded-md px-2 py-1 text-xs font-bold ${
            style === "bold" ? "bg-gray-200 text-gray-900" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          Bold
        </button>
        <button
          onClick={() => setStyle("italic")}
          className={`rounded-md px-2 py-1 text-xs italic ${
            style === "italic" ? "bg-gray-200 text-gray-900" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          Italic
        </button>
        <button
          onClick={() => setStyle("code")}
          className={`rounded-md px-2 py-1 font-mono text-xs ${
            style === "code" ? "bg-gray-200 text-gray-900" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          Code
        </button>
        <button
          onClick={onGameStart}
          className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200"
        >
          🎮 Game
        </button>
      </div>

      {/* Input area */}
      <div className="flex gap-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={style === "normal" ? "Type a message..." : `Type ${style} text...`}
          rows={2}
          className={`flex-1 resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-300 ${
            style === "bold" ? "font-bold" : style === "italic" ? "italic" : style === "code" ? "font-mono" : ""
          }`}
        />
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="self-end rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:opacity-50 disabled:hover:bg-gray-800"
        >
          Send
        </button>
      </div>
      <p className="text-center text-[10px] text-gray-400">
        Type <span className="font-mono">/game</span> to play · Use **bold**, *italic*, or `code` in any message
      </p>
    </div>
  );
}