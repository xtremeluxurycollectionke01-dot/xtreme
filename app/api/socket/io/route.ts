// app/api/socket/io/route.ts
import { NextRequest } from "next/server";
import { Server as SocketServer } from "socket.io";
import { createServer } from "http";
import { verifyToken } from "@/lib/auth";
import {dbConnect } from "@/lib/mongodb";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";

let io: SocketServer | null = null;
let isSocketInitialized = false;

export async function GET(req: NextRequest) {
  if (!isSocketInitialized) {
    // Create HTTP server
    const httpServer = createServer();
    
    // Initialize Socket.IO
    io = new SocketServer(httpServer, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL,
        credentials: true,
      },
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    // Authentication middleware
    io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error("Authentication error: No token provided"));
        }

        const payload = await verifyToken(token);
        if (!payload || !payload.id) {
          return next(new Error("Authentication error: Invalid token"));
        }

        socket.data.userId = payload.id;
        next();
      } catch (error) {
        console.error("Socket auth error:", error);
        next(new Error("Authentication error: " ));
      }
    });

    // Connection handler
    io.on("connection", (socket) => {
      const userId = socket.data.userId;
      console.log(`User ${userId} connected`);

      // Join user's personal room
      socket.join(`user:${userId}`);

      // Handle sending messages
      socket.on("send_message", async (data) => {
        try {
          const { receiverId, content } = data;
          
          console.log(`Sending message from ${userId} to ${receiverId}: ${content}`);

          if (!receiverId || !content) {
            socket.emit("message_error", { error: "Missing required fields" });
            return;
          }

          // Ensure database connection
          await dbConnect();

          // Create message
          const message = await Message.create({
            sender: userId,
            receiver: receiverId,
            content: content.trim(),
          });

          console.log("Message created:", message._id);

          // Populate sender info
          const populatedMessage = await Message.findById(message._id)
            .populate("sender", "name email role")
            .populate("receiver", "name email role")
            .lean();

          // Update or create conversation
          const participants = [userId, receiverId];
          let conversation = await Conversation.findOne({
            participants: { $all: participants, $size: 2 }
          });

          if (conversation) {
            conversation.lastMessage = content;
            conversation.lastMessageAt = new Date();
            
            // Increment unread count for receiver
            const unreadMap = conversation.unreadCount || new Map();
            const currentUnread = unreadMap.get(receiverId) || 0;
            unreadMap.set(receiverId, currentUnread + 1);
            conversation.unreadCount = unreadMap;
            await conversation.save();
          } else {
            conversation = await Conversation.create({
              participants,
              lastMessage: content,
              lastMessageAt: new Date(),
              unreadCount: new Map([[receiverId, 1]])
            });
          }

          console.log("Conversation updated:", conversation._id);

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
          socket.emit("message_error", { error: "Failed to send message: " });
        }
      });

      // Handle marking messages as read
      socket.on("mark_read", async (data) => {
        try {
          const { senderId } = data;

          await dbConnect();

          // Update all unread messages
          const result = await Message.updateMany(
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

          console.log(`Marked ${result.modifiedCount} messages as read`);

          // Update conversation unread count
          const conversation = await Conversation.findOne({
            participants: { $all: [userId, senderId], $size: 2 }
          });

          if (conversation) {
            const unreadMap = conversation.unreadCount || new Map();
            unreadMap.set(userId, 0);
            conversation.unreadCount = unreadMap;
            await conversation.save();
          }

          // Notify sender that messages were read
          io?.to(`user:${senderId}`).emit("messages_read", {
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

    // Start server on a specific port for Socket.IO
    const PORT = process.env.SOCKET_PORT || 3000;
    httpServer.listen(PORT, () => {
      console.log(`Socket.IO server running on port ${PORT}`);
    });
    
    isSocketInitialized = true;
  }

  return new Response("Socket.IO server running", { status: 200 });
}