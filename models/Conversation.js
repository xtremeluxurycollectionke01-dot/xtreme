/*const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

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
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique conversation between users
ConversationSchema.index({ participants: 1 }, { unique: true });

module.exports =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", ConversationSchema);*/

  /*const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    lastMessage: {
      type: String,
      trim: true,
    },

    lastMessageAt: {
      type: Date,
    },

    unreadCount: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", ConversationSchema);*/


  const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    // ✅ Prevents duplicate conversations forever
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

    // store unread counts per userId
    unreadCount: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// ⚠️ DO NOT add:
// mongoose.Schema({ participants: 1 }, { unique: true });

module.exports =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", ConversationSchema);