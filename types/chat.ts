// types/chat.ts (updated)
export interface User {
  id: string;
  name: string;
  avatarInitial: string;
  status?: "online" | "offline" | "away";
  lastActive?: Date;
  bio?: string;
}

export interface Reaction {
  emoji: string;
  userId: string;
  userName: string;
}

export interface Message {
  id: string;
  text: string;
  sender: User;
  timestamp: Date;
  reactions: Reaction[];
  style?: "bold" | "italic" | "code";
}

export interface TextGame {
  id: string;
  name: string;
  description: string;
  play: () => void;
}