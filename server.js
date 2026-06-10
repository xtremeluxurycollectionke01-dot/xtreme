// server.js
/*const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`> Next.js server ready on http://localhost:${PORT}`);
    console.log(`> Socket.IO server should be running separately on port ${process.env.SOCKET_PORT || 3001}`);
    console.log(`> Run: npm run dev:socket to start the socket server`);
  });
});*/

// server.js
/*const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Import models (adjust path as needed)
const Message = require('./models/Message');
const Conversation = require('./models/Conversation');

// ======================
// MongoDB Connection (SINGLE CONNECTION)
// ======================
let isConnected = false;

const connectDB = async () => {
  // Already connected
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('MongoDB already connected, reusing connection');
    return;
  }

  // Reset if connection is in broken state
  if (mongoose.connection.readyState === 0) {
    console.log('MongoDB connection broken, reconnecting...');
    isConnected = false;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4, // Fixes Atlas DNS issues
    });
    
    isConnected = mongoose.connection.readyState === 1;
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error; // Let the server fail to start
  }
};

// ======================
// JWT Verification
// ======================
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    );
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    };
  } catch (error) {
    return null;
  }
};

// ======================
// Main Server Startup
// ======================
app.prepare().then(async () => {
  // Connect to MongoDB ONCE at startup
  try {
    await connectDB();
  } catch (error) {
    console.error('Failed to connect to MongoDB, exiting...');
    process.exit(1);
  }
  
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });
  
  // Initialize Socket.IO on the same server
  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      credentials: true,
    },
    path: '/api/socket/io',
  });
  
  // ======================
  // Socket.IO Auth Middleware
  // ======================
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error: No token'));
      }
      
      const payload = verifyToken(token);
      if (!payload?.id) {
        return next(new Error('Authentication error: Invalid token'));
      }
      
      socket.data.userId = payload.id;
      socket.data.userName = payload.name;
      socket.data.userEmail = payload.email;
      
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });
  
  // ======================
  // Socket.IO Connection Handling
  // ======================
  io.on('connection', (socket) => {
    const userId = socket.data.userId;
    console.log(`✅ User ${userId} connected`);
    
    socket.join(`user:${userId}`);
    
    // ======================
    // Send Message (NO DB RECONNECT)
    // ======================
    socket.on('send_message', async (data) => {
      try {
        const { receiverId, content } = data;
        
        if (!receiverId || !content?.trim()) return;
        
        // Use existing connection - don't call connectDB() here!
        const message = await Message.create({
          sender: userId,
          receiver: receiverId,
          content: content.trim(),
        });
        
        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'name email role')
          .populate('receiver', 'name email role')
          .lean();
        
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
        
        // Emit to receiver
        io.to(`user:${receiverId}`).emit('new_message', {
          message: populatedMessage,
          conversationId: conversation._id,
        });
        
        // Confirm to sender
        socket.emit('message_sent', {
          message: populatedMessage,
          conversationId: conversation._id,
        });
        
      } catch (error) {
        console.error('❌ send_message error:', error);
        socket.emit('message_error', {
          error: error.message || 'Failed to send message',
        });
      }
    });
    
    // ======================
    // Mark as Read (NO DB RECONNECT)
    // ======================
    socket.on('mark_read', async ({ senderId }) => {
      try {
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
        
        // Notify sender that messages were read
        io.to(`user:${senderId}`).emit('messages_read', {
          by: userId,
          from: senderId,
        });
        
      } catch (error) {
        console.error('❌ mark_read error:', error);
      }
    });
    
    // ======================
    // Typing Events
    // ======================
    socket.on('typing_start', ({ receiverId }) => {
      socket.to(`user:${receiverId}`).emit('user_typing', {
        userId,
        isTyping: true,
      });
    });
    
    socket.on('typing_end', ({ receiverId }) => {
      socket.to(`user:${receiverId}`).emit('user_typing', {
        userId,
        isTyping: false,
      });
    });
    
    // ======================
    // Disconnect
    // ======================
    socket.on('disconnect', () => {
      console.log(`❌ User ${userId} disconnected`);
    });
  });
  
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`🚀 Server ready on http://localhost:${PORT}`);
    console.log(`📡 Socket.IO attached to same server`);
    console.log(`💾 MongoDB connection status: ${isConnected ? 'Connected' : 'Failed'}`);
  });
});*/




// app/api/socket/io/route.ts
/*import { NextRequest } from "next/server";
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
}*/

/*const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const Message = require("./models/Message");
const Conversation = require("./models/Conversation");

// ======================
// MongoDB Connection
// ======================
let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4,
    });

    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB error:", err);
    throw err;
  }
};

// ======================
// JWT
// ======================
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
    );

    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    };
  } catch {
    return null;
  }
};

// ======================
// Start App
// ======================
app.prepare().then(async () => {
  await connectDB();

  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL,
      credentials: true,
    },
    path: "/api/socket/io",
  });

  // ======================
  // Auth middleware
  // ======================
  /*io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    const user = verifyToken(token);

    if (!user) return next(new Error("Unauthorized"));

    socket.data.userId = user.id;
    next();
  });*

  io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  console.log("🔐 SOCKET TOKEN RECEIVED:", token);

  try {
    const user = verifyToken(token);
    if (!user) return next(new Error("Unauthorized"));

    socket.data.userId = user.id;
    next();
  } catch (e) {
    console.log("JWT ERROR:", e.message);
    return next(new Error("Unauthorized"));
  }
});

  // ======================
  // Connection
  // ======================
  io.on("connection", (socket) => {
    const userId = socket.data.userId;

    socket.join(`user:${userId}`);

    // ======================
    // SEND MESSAGE (FIXED)
    // ======================
    socket.on("send_message", async ({ receiverId, content }) => {
      try {
        if (!receiverId || !content?.trim()) return;

        const message = await Message.create({
          sender: userId,
          receiver: receiverId,
          content: content.trim(),
        });

        const populatedMessage = await Message.findById(message._id)
          .populate("sender receiver", "name email role")
          .lean();

        // ✅ FIX: deterministic key (NO duplicates ever)
        const chatKey = [userId, receiverId].sort().join("_");

        let conversation = await Conversation.findOne({ chatKey });

        if (!conversation) {
          conversation = await Conversation.create({
            participants: [userId, receiverId],
            chatKey,
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

        io.to(`user:${receiverId}`).emit("new_message", {
          message: populatedMessage,
          conversationId: conversation._id,
        });

        socket.emit("message_sent", {
          message: populatedMessage,
          conversationId: conversation._id,
        });
      } catch (err) {
        console.error("send_message error:", err);
      }
    });

    // ======================
    // MARK READ (FIXED)
    // ======================
    socket.on("mark_read", async ({ senderId }) => {
      try {
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

        const chatKey = [userId, senderId].sort().join("_");

        const conversation = await Conversation.findOne({ chatKey });

        if (conversation) {
          const unread = conversation.unreadCount || {};
          unread[userId] = 0;
          conversation.unreadCount = unread;
          await conversation.save();
        }

        io.to(`user:${senderId}`).emit("messages_read", {
          by: userId,
        });
      } catch (err) {
        console.error(err);
      }
    });

    // ======================
    // typing
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

    socket.on("disconnect", () => {
      console.log("disconnected:", userId);
    });
  });

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
});*/


const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const Message = require("./models/Message");
const Conversation = require("./models/Conversation");

// ======================
// Firebase Admin SDK
// ======================
let firebaseInitialized = false;

try {
  //const serviceAccount = require("./serviceAccountKey.json");
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  firebaseInitialized = true;
  console.log("🔥 Firebase Admin initialized");
} catch (err) {
  console.warn("⚠️ Firebase Admin not initialized:", err.message);
  console.warn("Push notifications will be disabled.");
}

// ======================
// MongoDB Connection
// ======================
let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4,
    });

    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB error:", err);
    throw err;
  }
};

// ======================
// JWT
// ======================
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    };
  } catch {
    return null;
  }
};

// ======================
// Push Notification Helper
// ======================
/**
 * Send FCM push notification to a user
 * @param {string} receiverId - MongoDB user ID
 * @param {string} senderId - MongoDB sender ID
 * @param {string} content - Message content
 * @param {string} messageId - MongoDB message document ID
 */
const sendPushNotification = async (receiverId, senderId, content, messageId) => {
  if (!firebaseInitialized) return;

  try {
    const User = require("./models/User");
    const receiver = await User.findById(receiverId).select("fcmTokens");

    if (!receiver || !receiver.fcmTokens || receiver.fcmTokens.length === 0) {
      console.log("📱 No FCM tokens for user:", receiverId);
      return;
    }

    const sender = await User.findById(senderId).select("name");
    const senderName = sender?.name || "Someone";

    const fcmMessage = {
      notification: {
        title: `New message from ${senderName}`,
        body: content.length > 100 ? content.substring(0, 97) + "..." : content,
      },
      data: {
        type: "chat",
        senderId: senderId,
        senderName: senderName,
        messageId: messageId.toString(),
        conversationId: receiverId,
        clickAction: "/messages",
      },
      tokens: receiver.fcmTokens,
      android: {
        priority: "high",
        notification: {
          channelId: "chat_messages",
          sound: "default",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            badge: 1,
          },
        },
      },
    };

    const response = await admin.messaging().sendEachForMulticast(fcmMessage);
    console.log(`📱 FCM sent: ${response.successCount}/${receiver.fcmTokens.length} successful`);

    // Remove invalid tokens
    if (response.failureCount > 0) {
      const invalidTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const errorCode = resp.error?.code;
          if (
            errorCode === "messaging/invalid-registration-token" ||
            errorCode === "messaging/registration-token-not-registered"
          ) {
            invalidTokens.push(receiver.fcmTokens[idx]);
          }
        }
      });

      if (invalidTokens.length > 0) {
        await User.findByIdAndUpdate(receiverId, {
          $pull: { fcmTokens: { $in: invalidTokens } },
        });
        console.log(`🧹 Cleaned ${invalidTokens.length} invalid FCM tokens`);
      }
    }
  } catch (fcmError) {
    console.error("❌ FCM Error:", fcmError.message);
  }
};

// ======================
// Start App
// ======================
app.prepare().then(async () => {
  await connectDB();

  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL,
      credentials: true,
    },
    path: "/api/socket/io",
  });

  // ======================
  // Auth middleware
  // ======================
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    console.log("🔐 SOCKET TOKEN RECEIVED:", token ? "present" : "missing");

    try {
      const user = verifyToken(token);
      if (!user) return next(new Error("Unauthorized"));

      socket.data.userId = user.id;
      next();
    } catch (e) {
      console.log("JWT ERROR:", e.message);
      return next(new Error("Unauthorized"));
    }
  });

  // ======================
  // Connection
  // ======================
  io.on("connection", (socket) => {
    const userId = socket.data.userId;

    socket.join(`user:${userId}`);
    console.log("🟢 User connected:", userId);

    // ======================
    // SEND MESSAGE (FIXED)
    // ======================
    socket.on("send_message", async ({ receiverId, content }) => {
      try {
        if (!receiverId || !content?.trim()) return;

        const trimmedContent = content.trim();

        // 1. Save message to database
        const message = await Message.create({
          sender: userId,
          receiver: receiverId,
          content: trimmedContent,
        });

        // 2. Populate sender/receiver info
        const populatedMessage = await Message.findById(message._id)
          .populate("sender receiver", "name email role avatar")
          .lean();

        // 3. Deterministic chat key (prevents duplicate conversations)
        const chatKey = [userId, receiverId].sort().join("_");

        let conversation = await Conversation.findOne({ chatKey });

        if (!conversation) {
          conversation = await Conversation.create({
            participants: [userId, receiverId],
            chatKey,
            lastMessage: trimmedContent,
            lastMessageAt: new Date(),
            unreadCount: {
              [receiverId]: 1,
            },
          });
        } else {
          conversation.lastMessage = trimmedContent;
          conversation.lastMessageAt = new Date();

          const unread = conversation.unreadCount || {};
          unread[receiverId] = (unread[receiverId] || 0) + 1;
          conversation.unreadCount = unread;

          await conversation.save();
        }

        // 4. Emit real-time message to receiver
        io.to(`user:${receiverId}`).emit("new_message", {
          message: populatedMessage,
          conversationId: conversation._id,
        });

        // 5. Confirm to sender
        socket.emit("message_sent", {
          message: populatedMessage,
          conversationId: conversation._id,
        });

        // 6. Send push notification via FCM
        await sendPushNotification(receiverId, userId, trimmedContent, message._id);

      } catch (err) {
        console.error("send_message error:", err);
        socket.emit("message_error", {
          error: "Failed to send message",
        });
      }
    });

    // ======================
    // MARK READ (FIXED)
    // ======================
    socket.on("mark_read", async ({ senderId }) => {
      try {
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

        const chatKey = [userId, senderId].sort().join("_");

        const conversation = await Conversation.findOne({ chatKey });

        if (conversation) {
          const unread = conversation.unreadCount || {};
          unread[userId] = 0;
          conversation.unreadCount = unread;
          await conversation.save();
        }

        io.to(`user:${senderId}`).emit("messages_read", {
          by: userId,
        });
      } catch (err) {
        console.error("mark_read error:", err);
      }
    });

    // ======================
    // Typing Indicators
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
    // Disconnect
    // ======================
    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", userId);
    });
  });

  const PORT = process.env.PORT || 3000;

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Socket.IO path: /api/socket/io`);
  });
});