import { Reaction } from "./chat";

// types/status.ts
export interface Status {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  type: "thinking" | "reading" | "doing" | "feeling" | "custom";
  emoji?: string;
  createdAt: Date;
  expiresAt: Date;
  reactions: Reaction[];
}

export type StatusType = "thinking" | "reading" | "doing" | "feeling" | "custom";