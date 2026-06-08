// scripts/socket-server.js
/*const { Server } = require('socket.io');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });

// Import models
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Socket Server: MongoDB connected');
  } catch (error) {
    console.error('Socket Server: MongoDB connection error:', error);
    process.exit(1);
  }
};

// Verify JWT token - FIXED to match your token structure
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    console.log('Decoded token:', decoded); // Debug log
    
    // Your token has { id, email, name, role }
    // Make sure to return the user ID correctly
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role
    };
  } catch (error) {
    console.error('Token verification error:', error.message);
    return null;
  }
};

// Initialize Socket.IO server
const initSocketServer = () => {
  const io = new Server({
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      credentials: true,
    },
    path: "/api/socket/io",
    addTrailingSlash: false,
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      console.log('Received token for authentication:', token ? `${token.substring(0, 20)}...` : 'No token');
      
      if (!token) {
        console.log('No token provided');
        return next(new Error("Authentication error: No token provided"));
      }

      const payload = verifyToken(token);
      if (!payload || !payload.id) {
        console.log('Invalid token payload:', payload);
        return next(new Error("Authentication error: Invalid token"));
      }

      console.log('Socket authenticated for user:', payload.id);
      socket.data.userId = payload.id;
      socket.data.userEmail = payload.email;
      socket.data.userName = payload.name;
      next();
    } catch (error) {
      console.error("Socket auth error:", error);
      next(new Error("Authentication error: " + error.message));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId;
    console.log(`✅ User ${userId} (${socket.data.userName}) connected`);

    // Join user's personal room
    socket.join(`user:${userId}`);

    // Handle sending messages
    socket.on("send_message", async (data) => {
      try {
        const { receiverId, content } = data;
        
        console.log(`📤 Sending message from ${userId} to ${receiverId}: ${content}`);

        if (!receiverId || !content) {
          socket.emit("message_error", { error: "Missing required fields" });
          return;
        }

        // Ensure database connection
        if (mongoose.connection.readyState !== 1) {
          await connectDB();
        }

        // Create message
        const message = await Message.create({
          sender: userId,
          receiver: receiverId,
          content: content.trim(),
        });

        console.log("✅ Message created:", message._id);

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
          console.log("✅ Conversation updated:", conversation._id);
        } else {
          conversation = await Conversation.create({
            participants,
            lastMessage: content,
            lastMessageAt: new Date(),
            unreadCount: new Map([[receiverId, 1]])
          });
          console.log("✅ New conversation created:", conversation._id);
        }

        // Emit to receiver
        io.to(`user:${receiverId}`).emit("new_message", {
          message: populatedMessage,
          conversationId: conversation._id
        });

        // Emit back to sender for confirmation
        socket.emit("message_sent", {
          message: populatedMessage,
          conversationId: conversation._id
        });

      } catch (error) {
        console.error("❌ Error sending message:", error);
        socket.emit("message_error", { error: "Failed to send message: " + error.message });
      }
    });

    // Handle marking messages as read
    socket.on("mark_read", async (data) => {
      try {
        const { senderId } = data;
        console.log(`📖 Marking messages as read from ${senderId} to ${userId}`);

        if (mongoose.connection.readyState !== 1) {
          await connectDB();
        }

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

        console.log(`✅ Marked ${result.modifiedCount} messages as read`);

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
        //io.to(`user:${senderId}`).emit("messages_read", {
        //  by: userId,
        //  from: senderId
        //});
        io.to(`user:${senderId}`).emit("messages_read", {
        by: userId,
        from: senderId
      });

      } catch (error) {
        console.error("❌ Error marking messages as read:", error);
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
      console.log(`❌ User ${userId} disconnected`);
    });
  });

  const PORT = process.env.SOCKET_PORT || 3001;
  io.listen(PORT);
  console.log(`🚀 Socket.IO server running on port ${PORT}`);
  
  return io;
};

// Start the server
const start = async () => {
  await connectDB();
  initSocketServer();
};

start().catch(console.error);*/

const { Server } = require("socket.io");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: ".env" });

// ======================
// MODELS (IMPORTANT)
// ======================
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const User = require("../models/User");

// ======================
// DB CONNECTION
// ======================
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4, // 🔥 fixes Atlas DNS issues
    });

    console.log("Socket Server: MongoDB connected");
  } catch (error) {
    console.error("Socket Server: MongoDB connection error:", error);
    process.exit(1);
  }
};

// ======================
// JWT VERIFY
// ======================
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    };
  } catch (error) {
    console.error("Token verification error:", error.message);
    return null;
  }
};

// ======================
// SOCKET SERVER INIT
// ======================
const initSocketServer = () => {
  const io = new Server({
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL,
      credentials: true,
    },
    path: "/api/socket/io",
  });

  // ======================
  // AUTH MIDDLEWARE
  // ======================
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication error: No token"));
      }

      const payload = verifyToken(token);

      if (!payload?.id) {
        return next(new Error("Authentication error: Invalid token"));
      }

      socket.data.userId = payload.id;
      socket.data.userName = payload.name;
      socket.data.userEmail = payload.email;

      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  // ======================
  // CONNECTION
  // ======================
  io.on("connection", (socket) => {
    const userId = socket.data.userId;

    console.log(`✅ User ${userId} connected`);

    socket.join(`user:${userId}`);

    // ======================
    // SEND MESSAGE
    // ======================
    socket.on("send_message", async (data) => {
      try {
        const { receiverId, content } = data;

        if (!receiverId || !content?.trim()) return;

        await connectDB();

        const message = await Message.create({
          sender: userId,
          receiver: receiverId,
          content: content.trim(),
        });

        const populatedMessage = await Message.findById(message._id)
          .populate("sender", "name email role")
          .populate("receiver", "name email role")
          .lean();

        // ======================
        // CONVERSATION HANDLING
        // ======================
        const participants = [userId, receiverId].sort();

        let conversation = await Conversation.findOne({
          participants: { $all: participants, $size: 2 },
        });

        if (!conversation) {
          conversation = await Conversation.create({
            participants,
            lastMessage: content,
            lastMessageAt: new Date(),
            unreadCount: {
              [receiverId]: 1,
            },
          });
        } else {
          conversation.lastMessage = content;
          conversation.lastMessageAt = new Date();

          const unread = conversation.unreadCount || {};
          unread[receiverId] = (unread[receiverId] || 0) + 1;

          conversation.unreadCount = unread;

          await conversation.save();
        }

        // ======================
        // EMIT TO RECEIVER
        // ======================
        io.to(`user:${receiverId}`).emit("new_message", {
          message: populatedMessage,
          conversationId: conversation._id,
        });

        // ======================
        // CONFIRM TO SENDER
        // ======================
        socket.emit("message_sent", {
          message: populatedMessage,
          conversationId: conversation._id,
        });
      } catch (error) {
        console.error("❌ send_message error:", error);
        socket.emit("message_error", {
          error: error.message || "Failed to send message",
        });
      }
    });

    // ======================
    // MARK AS READ
    // ======================
    socket.on("mark_read", async ({ senderId }) => {
      try {
        await connectDB();

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

        if (conversation) {
          const unread = conversation.unreadCount || {};
          unread[userId] = 0;

          conversation.unreadCount = unread;
          await conversation.save();
        }

        io.to(`user:${senderId}`).emit("messages_read", {
          by: userId,
          from: senderId,
        });
      } catch (error) {
        console.error("❌ mark_read error:", error);
      }
    });

    // ======================
    // TYPING EVENTS
    // ======================
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

    // ======================
    // DISCONNECT
    // ======================
    socket.on("disconnect", () => {
      console.log(`❌ User ${userId} disconnected`);
    });
  });

  const PORT = process.env.SOCKET_PORT || 3001;
  io.listen(PORT);

  console.log(`🚀 Socket.IO server running on port ${PORT}`);

  return io;
};

// ======================
// START SERVER
// ======================
const start = async () => {
  await connectDB();
  initSocketServer();
};

start().catch(console.error);