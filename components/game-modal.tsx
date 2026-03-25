// components/game-modal.tsx
import { useState } from "react";

interface GameModalProps {
  onClose: () => void;
  onGameEnd: (winner: string, score: number) => void;
}

type GameType = "wordladder" | "hangman" | "riddle";

export function GameModal({ onClose, onGameEnd }: GameModalProps) {
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [gameState, setGameState] = useState<any>(null);
  const [score, setScore] = useState(0);

  const startWordLadder = () => {
    setSelectedGame("wordladder");
    setGameState({
      currentWord: "cold",
      targetWord: "warm",
      attempts: 0,
      message: "Change one letter at a time to reach 'warm'",
    });
  };

  const handleWordLadderGuess = (guess: string) => {
    if (!gameState) return;
    const newAttempts = gameState.attempts + 1;
    if (guess.toLowerCase() === gameState.targetWord) {
      const finalScore = Math.max(10 - newAttempts, 1);
      onGameEnd("user", finalScore);
      setSelectedGame(null);
      setGameState(null);
    } else if (guess.length === 4 && guess !== gameState.currentWord) {
      setGameState({
        ...gameState,
        currentWord: guess,
        attempts: newAttempts,
        message: `Now at "${guess}". Keep going!`,
      });
    } else {
      setGameState({
        ...gameState,
        message: `"${guess}" is not valid. Change one letter at a time.`,
      });
    }
  };

  const startRiddle = () => {
    setSelectedGame("riddle");
    setGameState({
      riddles: [
        { question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", answer: "echo" },
        { question: "The more you take, the more you leave behind. What am I?", answer: "footsteps" },
      ],
      currentIndex: 0,
      score: 0,
    });
  };

  const handleRiddleAnswer = (answer: string) => {
    if (!gameState) return;
    const currentRiddle = gameState.riddles[gameState.currentIndex];
    if (answer.toLowerCase() === currentRiddle.answer.toLowerCase()) {
      const newScore = gameState.score + 1;
      if (gameState.currentIndex + 1 >= gameState.riddles.length) {
        onGameEnd("user", newScore);
        setSelectedGame(null);
        setGameState(null);
      } else {
        setGameState({
          ...gameState,
          currentIndex: gameState.currentIndex + 1,
          score: newScore,
        });
      }
    } else {
      alert("Wrong answer! Try again.");
    }
  };

  if (!selectedGame) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Text Games</h3>
          <div className="space-y-2">
            <button
              onClick={startWordLadder}
              className="w-full rounded-lg border border-gray-200 p-3 text-left text-sm transition-colors hover:bg-gray-50"
            >
              <span className="font-medium">Word Ladder</span>
              <p className="mt-1 text-xs text-gray-500">Change one letter at a time to reach the target word</p>
            </button>
            <button
              onClick={startRiddle}
              className="w-full rounded-lg border border-gray-200 p-3 text-left text-sm transition-colors hover:bg-gray-50"
            >
              <span className="font-medium">Riddle Challenge</span>
              <p className="mt-1 text-xs text-gray-500">Solve text-based riddles</p>
            </button>
          </div>
          <button onClick={onClose} className="mt-4 w-full rounded-lg bg-gray-100 py-2 text-sm text-gray-600">
            Close
          </button>
        </div>
      </div>
    );
  }

  if (selectedGame === "wordladder") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
          <h3 className="mb-2 text-lg font-medium text-gray-900">Word Ladder</h3>
          <p className="mb-4 text-sm text-gray-500">{gameState.message}</p>
          <div className="mb-4 rounded-lg bg-gray-100 p-4 text-center">
            <span className="font-mono text-2xl font-bold text-gray-800">{gameState.currentWord}</span>
            <span className="mx-2 text-gray-400">→</span>
            <span className="font-mono text-2xl text-gray-500">{gameState.targetWord}</span>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.target as any).guess.value;
              handleWordLadderGuess(input);
              (e.target as any).guess.value = "";
            }}
          >
            <input
              name="guess"
              type="text"
              maxLength={4}
              placeholder="Enter a 4-letter word"
              className="mb-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              autoFocus
            />
            <button type="submit" className="w-full rounded-lg bg-gray-800 py-2 text-sm text-white">
              Guess
            </button>
          </form>
          <button
            onClick={() => {
              setSelectedGame(null);
              setGameState(null);
            }}
            className="mt-2 w-full rounded-lg bg-gray-100 py-2 text-sm text-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (selectedGame === "riddle") {
    const currentRiddle = gameState.riddles[gameState.currentIndex];
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
          <h3 className="mb-2 text-lg font-medium text-gray-900">Riddle {gameState.currentIndex + 1}</h3>
          <p className="mb-4 text-sm text-gray-600">{currentRiddle.question}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.target as any).answer.value;
              handleRiddleAnswer(input);
              (e.target as any).answer.value = "";
            }}
          >
            <input
              name="answer"
              type="text"
              placeholder="Your answer..."
              className="mb-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              autoFocus
            />
            <button type="submit" className="w-full rounded-lg bg-gray-800 py-2 text-sm text-white">
              Submit
            </button>
          </form>
          <button
            onClick={() => {
              setSelectedGame(null);
              setGameState(null);
            }}
            className="mt-2 w-full rounded-lg bg-gray-100 py-2 text-sm text-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return null;
}