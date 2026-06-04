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

const { createServer } = require("http");
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
      process.env.JWT_SECRET || "secret"
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
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      credentials: true,
    },
    path: "/api/socket/io",
  });

  // ======================
  // Auth middleware
  // ======================
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    const user = verifyToken(token);

    if (!user) return next(new Error("Unauthorized"));

    socket.data.userId = user.id;
    next();
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

  server.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
  });
});