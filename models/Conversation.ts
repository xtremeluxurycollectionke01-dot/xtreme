// models/Conversation.ts
/*import mongoose, { Schema, Document, Model } from "mongoose";

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount: Map<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema: Schema<IConversation> = new Schema(
  {
    participants: [{
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }],
    lastMessage: {
      type: String,
      trim: true
    },
    lastMessageAt: {
      type: Date
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: {}
    }
  },
  { 
    timestamps: true 
  }
);

const Conversation: Model<IConversation> = mongoose.models.Conversation || mongoose.model<IConversation>("Conversation", ConversationSchema);
export default Conversation;*/

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  chatKey: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount: Map<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema: Schema<IConversation> = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    // ✅ CRITICAL FIX (prevents duplicates forever)
    chatKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    lastMessage: {
      type: String,
      trim: true,
    },

    lastMessageAt: {
      type: Date,
    },

    unreadCount: {
      type: Map,
      of: Number,
      default: () => new Map(),
    },
  },
  {
    timestamps: true,
  }
);

// ❌ IMPORTANT: DO NOT add participants unique index anymore

const Conversation: Model<IConversation> =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", ConversationSchema);

export default Conversation;