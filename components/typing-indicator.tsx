// components/typing-indicator.tsx
export function TypingIndicator({ name }: { name: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-700">
        {name[0]}
      </div>
      <div className="rounded-2xl bg-gray-100 px-4 py-2">
        <div className="flex gap-1">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.3s]"></span>
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.15s]"></span>
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500"></span>
        </div>
      </div>
    </div>
  );
}