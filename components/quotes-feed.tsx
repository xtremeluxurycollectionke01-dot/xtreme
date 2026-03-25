// components/quotes-feed.tsx
"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface Quote {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
  likes: number;
  userLiked: boolean;
}

// Dummy quotes data
const dummyQuotes: Quote[] = [
  {
    id: "1",
    text: "In a world of noise, text is the signal. Every word matters when there are no distractions.",
    author: "Alex Morgan",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    likes: 12,
    userLiked: false,
  },
  {
    id: "2",
    text: "The beauty of text-only communication is that it forces us to be intentional with our words. No emojis to hide behind, just pure expression.",
    author: "Jamie Chen",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    likes: 34,
    userLiked: true,
  },
  {
    id: "3",
    text: "Reading text without images is like listening to music without videos. Your imagination fills in the gaps, making it more personal.",
    author: "Taylor Swift",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    likes: 28,
    userLiked: false,
  },
  {
    id: "4",
    text: "Words are the original virtual reality. They create worlds in our minds without needing pixels or polygons.",
    author: "Jordan Lee",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    likes: 19,
    userLiked: false,
  },
  {
    id: "5",
    text: "Text-based games remind us that gameplay matters more than graphics. A good story needs no special effects.",
    author: "Casey Kim",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    likes: 45,
    userLiked: true,
  },
  {
    id: "6",
    text: "When you remove images and videos, conversations become deeper. You actually read what people say, not just scroll past.",
    author: "Riley Patil",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
    likes: 67,
    userLiked: false,
  },
];

export function QuotesFeed() {
  const [quotes, setQuotes] = useState<Quote[]>(dummyQuotes);
  const [newQuote, setNewQuote] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddQuote = () => {
    if (newQuote.trim()) {
      const quote: Quote = {
        id: Date.now().toString(),
        text: newQuote.trim(),
        author: "You",
        timestamp: new Date(),
        likes: 0,
        userLiked: false,
      };
      setQuotes([quote, ...quotes]);
      setNewQuote("");
      setIsAdding(false);
    }
  };

  const handleLike = (quoteId: string) => {
    setQuotes((prev) =>
      prev.map((quote) => {
        if (quote.id === quoteId) {
          return {
            ...quote,
            likes: quote.userLiked ? quote.likes - 1 : quote.likes + 1,
            userLiked: !quote.userLiked,
          };
        }
        return quote;
      })
    );
  };

  return (
    <div className="h-full">
      {/* Add quote button */}
      <div className="sticky top-0 bg-white px-4 pt-3 pb-2">
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-500 transition-colors hover:border-gray-400 hover:bg-gray-100"
          >
            ✍️ Share your thought...
          </button>
        ) : (
          <div className="space-y-2">
            <textarea
              value={newQuote}
              onChange={(e) => setNewQuote(e.target.value)}
              placeholder="Write your quote here..."
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-300"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddQuote}
                disabled={!newQuote.trim()}
                className="flex-1 rounded-lg bg-gray-800 px-3 py-2 text-sm text-white transition-colors hover:bg-gray-700 disabled:opacity-50"
              >
                Post Quote
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewQuote("");
                }}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quotes list */}
      <div className="divide-y divide-gray-100">
        {quotes.map((quote) => (
          <div key={quote.id} className="px-4 py-4">
            <div className="mb-2 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-700">
                  {quote.author[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{quote.author}</p>
                  <p className="text-[10px] text-gray-400">
                    {formatDistanceToNow(quote.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>

            <p className="mb-3 text-sm leading-relaxed text-gray-700">{quote.text}</p>

            <button
              onClick={() => handleLike(quote.id)}
              className="flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-gray-700"
            >
              <span>{quote.userLiked ? "❤️" : "🤍"}</span>
              <span>{quote.likes} likes</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}