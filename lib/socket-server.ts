// lib/socket-server.ts
/*import { Server as SocketServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { verifyToken } from "./auth";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";
import { dbConnect } from "./mongodb";
import mongoose from "mongoose";

let io: SocketServer | null = null;

export function initSocketServer(server: HTTPServer) {
  if (io) return io;

  io = new SocketServer(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      credentials: true,
    },
    path: "/api/socket/io",
  });

  // Middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }

      const payload = await verifyToken(token);
      if (!payload) {
        return next(new Error("Authentication error"));
      }

      socket.data.userId = payload.id;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId;
    console.log(`User ${userId} connected`);

    // Join user's personal room
    socket.join(`user:${userId}`);

    // Handle sending messages
    socket.on("send_message", async (data) => {
      try {
        const { receiverId, content } = data;

        await dbConnect();

        // Create message
        const message = await Message.create({
          sender: userId,
          receiver: receiverId,
          content: content.trim(),
        });

        // Populate sender info
        const populatedMessage = await Message.findById(message._id)
          .populate("sender", "name email")
          .populate("receiver", "name email");

        // Update or create conversation
        const participants = [userId, receiverId].sort();
        let conversation = await Conversation.findOne({
          participants: { $all: participants }
        });

        if (conversation) {
          conversation.lastMessage = content;
          conversation.lastMessageAt = new Date();
          
          // Increment unread count for receiver
          const currentUnread = conversation.unreadCount.get(receiverId) || 0;
          conversation.unreadCount.set(receiverId, currentUnread + 1);
          await conversation.save();
        } else {
          conversation = await Conversation.create({
            participants,
            lastMessage: content,
            lastMessageAt: new Date(),
            unreadCount: new Map([[receiverId, 1]])
          });
        }

        // Emit to receiver
        io?.to(`user:${receiverId}`).emit("new_message", {
          message: populatedMessage,
          conversationId: conversation._id
        });

        // Emit back to sender for confirmation
        socket.emit("message_sent", {
          message: populatedMessage,
          conversationId: conversation._id
        });

      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("message_error", { error: "Failed to send message" });
      }
    });

    // Handle marking messages as read
    socket.on("mark_read", async (data) => {
      try {
        const { senderId } = data;

        await dbConnect();

        // Update all unread messages
        await Message.updateMany(
          {
            sender: senderId,
            receiver: userId,
            read: false
          },
          {
            read: true,
            readAt: new Date()
          }
        );

        // Update conversation unread count
        const conversation = await Conversation.findOne({
          participants: { $all: [userId, senderId] }
        });

        if (conversation) {
          conversation.unreadCount.set(userId, 0);
          await conversation.save();
        }

        // Notify sender that messages were read
        io?.to(`user:senderId`).emit("messages_read", {
          by: userId,
          from: senderId
        });

      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    });

    // Handle typing indicators
    socket.on("typing_start", ({ receiverId }) => {
      socket.to(`user:${receiverId}`).emit("user_typing", {
        userId,
        isTyping: true
      });
    });

    socket.on("typing_end", ({ receiverId }) => {
      socket.to(`user:${receiverId}`).emit("user_typing", {
        userId,
        isTyping: false
      });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected`);
    });
  });

  return io;
}

export function getSocketIO() {
  return io;
}*/


import { Server as SocketServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { verifyToken } from "./auth";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";
import { dbConnect } from "./mongodb";

let io: SocketServer | null = null;

export function initSocketServer(server: HTTPServer) {
  if (io) return io;

  io = new SocketServer(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      credentials: true,
    },
    path: "/api/socket/io",
  });

  // AUTH MIDDLEWARE
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Authentication error"));

      const payload = await verifyToken(token);
      if (!payload) return next(new Error("Authentication error"));

      socket.data.userId = payload.id;
      next();
    } catch {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId;

    console.log(`User ${userId} connected`);

    socket.join(`user:${userId}`);

    // =========================
    // SEND MESSAGE
    // =========================
    socket.on("send_message", async (data) => {
      try {
        const { receiverId, content } = data;

        if (!receiverId || !content?.trim()) return;

        await dbConnect();

        const message = await Message.create({
          sender: userId,
          receiver: receiverId,
          content: content.trim(),
        });

        const populatedMessage = await Message.findById(message._id)
          .populate("sender", "name email")
          .populate("receiver", "name email");

        // stable participant order
        const participants = [userId, receiverId].sort();

        let conversation = await Conversation.findOne({
          participants: { $all: participants, $size: 2 },
        });

        if (!conversation) {
          conversation = await Conversation.create({
            participants,
            lastMessage: content,
            lastMessageAt: new Date(),
            unreadCount: new Map([[receiverId, 1]]),
          });
        } else {
          conversation.lastMessage = content;
          conversation.lastMessageAt = new Date();

          const unread = conversation.unreadCount ?? new Map();
          const current = unread.get(receiverId) || 0;

          unread.set(receiverId, current + 1);
          conversation.unreadCount = unread;

          await conversation.save();
        }

        // send to receiver
        io!.to(`user:${receiverId}`).emit("new_message", {
          message: populatedMessage,
          conversationId: conversation._id,
        });

        // confirm to sender
        socket.emit("message_sent", {
          message: populatedMessage,
          conversationId: conversation._id,
        });

      } catch (err) {
        console.error(err);
        socket.emit("message_error", { error: "Failed to send message" });
      }
    });

    // =========================
    // MARK AS READ
    // =========================
    socket.on("mark_read", async ({ senderId }) => {
      try {
        await dbConnect();

        await Message.updateMany(
          {
            sender: senderId,
            receiver: userId,
            read: false,
          },
          {
            read: true,
            readAt: new Date(),
          }
        );

        const conversation = await Conversation.findOne({
          participants: { $all: [userId, senderId] },
        });

        if (conversation?.unreadCount) {
          conversation.unreadCount.set(userId, 0);
          await conversation.save();
        }

        // FIXED BUG HERE 👇
        io!.to(`user:${senderId}`).emit("messages_read", {
          by: userId,
          from: senderId,
        });

      } catch (err) {
        console.error("mark_read error:", err);
      }
    });

    // =========================
    // TYPING
    // =========================
    socket.on("typing_start", ({ receiverId }) => {
      socket.to(`user:${receiverId}`).emit("user_typing", {
        userId,
        isTyping: true,
      });
    });

    socket.on("typing_end", ({ receiverId }) => {
      socket.to(`user:${receiverId}`).emit("user_typing", {
        userId,
        isTyping: false,
      });
    });

    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected`);
    });
  });

  return io;
}

export function getSocketIO() {
  return io;
}