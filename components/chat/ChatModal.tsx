// components/Chat/ChatModal.tsx
/*"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Search, Send, User as UserIcon, ChevronLeft } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { io, Socket } from "socket.io-client";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Message {
  _id: string;
  content: string;
  sender: User;
  receiver: User;
  createdAt: string;
  read: boolean;
}

interface Conversation {
  _id: string;
  otherUser: User;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatModal({ isOpen, onClose }: ChatModalProps) {
  const { user: currentUser } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [showUserList, setShowUserList] = useState(true);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /*useEffect(() => {
    if (!isOpen || !currentUser) return;

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth-token="))
      ?.split("=")[1];

    const newSocket = io({
      path: "/api/socket/io",
      auth: { token },
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
    });

    newSocket.on("new_message", ({ message }) => {
      if (
        selectedUser &&
        (message.sender._id === selectedUser._id ||
          message.receiver._id === selectedUser._id)
      ) {
        setMessages((prev) => [...prev, message]);
        markMessagesAsRead(selectedUser._id);
      }
      loadConversations();
    });

    newSocket.on("user_typing", ({ userId, isTyping }) => {
      if (selectedUser && userId === selectedUser._id) {
        setOtherUserTyping(isTyping);
      }
    });

    setSocket(newSocket);

    loadConversations();
    loadUsers();

    return () => {
      newSocket.close();
    };
  }, [isOpen, currentUser]);*
  // components/Chat/ChatModal.tsx - Update the socket initialization
useEffect(() => {
  if (!isOpen || !currentUser) return;

  const getToken = () => {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(row => row.startsWith('auth-token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  };

  const token = getToken();
  
  if (!token) {
    console.error("No auth token found");
    return;
  }

  const newSocket = io({
    path: "/api/socket/io",
    auth: { token },
    transports: ['websocket', 'polling'], // Add this
  });

  newSocket.on("connect", () => {
    console.log("Socket connected successfully");
  });

  newSocket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  newSocket.on("new_message", ({ message }) => {
    console.log("New message received:", message);
    if (
      selectedUser &&
      (message.sender._id === selectedUser._id ||
        message.receiver._id === selectedUser._id)
    ) {
      setMessages((prev) => [...prev, message]);
      markMessagesAsRead(selectedUser._id);
    }
    loadConversations(); // Refresh conversations to update last message
  });

  newSocket.on("message_sent", ({ message }) => {
    console.log("Message sent confirmation:", message);
    // Add the message to the local state immediately
    if (selectedUser && message.receiver._id === selectedUser._id) {
      setMessages((prev) => [...prev, message]);
    }
  });

  newSocket.on("message_error", ({ error }) => {
    console.error("Message error:", error);
    // Show error to user
    alert("Failed to send message: " + error);
  });

  newSocket.on("user_typing", ({ userId, isTyping }) => {
    if (selectedUser && userId === selectedUser._id) {
      setOtherUserTyping(isTyping);
    }
  });

  setSocket(newSocket);

  loadConversations();
  loadUsers();

  return () => {
    if (newSocket) {
      newSocket.disconnect();
    }
  };
}, [isOpen, currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = async () => {
    try {
      const response = await fetch("/api/chat/conversations");
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/chat/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const loadMessages = async (userId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/chat/messages?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
        markMessagesAsRead(userId);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async (senderId: string) => {
    if (socket) {
      socket.emit("mark_read", { senderId });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !socket) return;

    socket.emit("send_message", {
      receiverId: selectedUser._id,
      content: newMessage.trim(),
    });

    setNewMessage("");
    handleStopTyping();
  };

  const handleStartTyping = () => {
    if (!isTyping && selectedUser && socket) {
      setIsTyping(true);
      socket.emit("typing_start", { receiverId: selectedUser._id });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        handleStopTyping();
      }, 2000);
    }
  };

  const handleStopTyping = () => {
    if (isTyping && selectedUser && socket) {
      setIsTyping(false);
      socket.emit("typing_end", { receiverId: selectedUser._id });
    }
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setShowUserList(false);
    loadMessages(user._id);
  };

  const handleBackToUsers = () => {
    setSelectedUser(null);
    setShowUserList(true);
    setMessages([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      <div
        className="absolute inset-0 bg-black/10 transition-opacity"
        onClick={onClose}
      />

      <div className="pointer-events-auto w-full sm:w-[400px] h-[600px] bg-gradient-to-b from-gray-900 to-black rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col border border-yellow-500/20">
        {/* Header *
        <div className="p-4 border-b border-yellow-500/20 bg-black/50 backdrop-blur rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {!showUserList && selectedUser && (
                <button
                  onClick={handleBackToUsers}
                  className="text-yellow-500 hover:text-yellow-400 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <h3 className="text-lg font-semibold text-white">
                {showUserList ? "Messages" : selectedUser?.name}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content *
        {showUserList ? (
          <div className="flex-1 overflow-y-auto">
            {/* New Chat Button *
            <div className="p-3">
              <button
                onClick={() => setShowUserList(false)}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold py-2 px-4 rounded-lg hover:shadow-lg transition-all"
              >
                New Chat
              </button>
            </div>

            {/* Conversations List *
            <div className="divide-y divide-yellow-500/10">
              {conversations.map((conv) => (
                <button
                  key={conv._id}
                  onClick={() => handleSelectUser(conv.otherUser)}
                  className="w-full p-4 hover:bg-white/5 transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {conv.otherUser.name}
                        </p>
                        <p className="text-sm text-gray-400 truncate w-48">
                          {conv.lastMessage}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(conv.lastMessageAt).toLocaleDateString()}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="inline-block mt-1 w-5 h-5 rounded-full bg-yellow-500 text-black text-xs font-semibold flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}

              {conversations.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400">No messages yet</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Start a new chat to connect with others
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Users List for New Chat *
            {!selectedUser ? (
              <div className="flex-1 overflow-y-auto">
                <div className="p-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                </div>

                <div className="divide-y divide-yellow-500/10">
                  {users.map((user) => (
                    <button
                      key={user._id}
                      onClick={() => handleSelectUser(user)}
                      className="w-full p-4 hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-black" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                          <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Messages Area *
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="inline-block w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <>
                      {messages.map((msg) => (
                        <div
                          key={msg._id}
                          className={`flex ${
                            msg.sender._id === currentUser?._id
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] px-4 py-2 rounded-lg ${
                              msg.sender._id === currentUser?._id
                                ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black"
                                : "bg-gray-800 text-white"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs opacity-75 mt-1">
                              {new Date(msg.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      {otherUserTyping && (
                        <div className="flex justify-start">
                          <div className="bg-gray-800 text-white px-4 py-2 rounded-lg">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Message Input *
                <form onSubmit={handleSendMessage} className="p-4 border-t border-yellow-500/20">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleStartTyping}
                      placeholder="Type a message..."
                      className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black p-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}*/


// components/Chat/ChatModal.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, Search, Send, User as UserIcon, ChevronLeft } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { io, Socket } from "socket.io-client";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Message {
  _id: string;
  content: string;
  sender: User;
  receiver: User;
  createdAt: string;
  read: boolean;
}

interface Conversation {
  _id: string;
  otherUser: User;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatModal({ isOpen, onClose }: ChatModalProps) {
  const { user: currentUser, token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [showUserList, setShowUserList] = useState(true);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Load conversations - defined first with useCallback
  const loadConversations = useCallback(async () => {
    try {
      const response = await fetch("/api/chat/conversations");
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  }, []);

  // Load users
  const loadUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/chat/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error loading users:", error);
    }
  }, []);

  // Load messages
  const loadMessages = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/chat/messages?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark messages as read
  const markMessagesAsRead = useCallback((senderId: string) => {
    if (socketRef.current && socketConnected) {
      socketRef.current.emit("mark_read", { senderId });
    }
  }, [socketConnected]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize socket and load data
  useEffect(() => {
    if (!isOpen || !currentUser || !token) {
      console.log("Cannot initialize chat:", { isOpen, hasUser: !!currentUser, hasToken: !!token });
      return;
    }

    let isMounted = true;

    // Load initial data
    loadConversations();
    loadUsers();

    // Initialize socket connection
    console.log("Initializing socket with token:", token.substring(0, 20) + "...");
    
    const newSocket = io('http://localhost:3000', {
      path: "/api/socket/io",
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected successfully with ID:", newSocket.id);
      if (isMounted) {
        setSocketConnected(true);
        socketRef.current = newSocket;
      }
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      if (isMounted) {
        setSocketConnected(false);
      }
    });

    newSocket.on("new_message", ({ message, conversationId }) => {
      console.log("New message received:", message);
      if (isMounted) {
        // Add message to state if it's for the current conversation
        if (selectedUser && message.sender._id === selectedUser._id) {
          setMessages((prev) => [...prev, message]);
          // Mark as read immediately
          if (newSocket) {
            newSocket.emit("mark_read", { senderId: message.sender._id });
          }
        }
        // Refresh conversations list
        loadConversations();
      }
    });

    newSocket.on("message_sent", ({ message, conversationId }) => {
      console.log("Message sent confirmation:", message);
      if (isMounted) {
        // Add the sent message to the messages list
        if (selectedUser && message.receiver._id === selectedUser._id) {
          setMessages((prev) => [...prev, message]);
        }
        // Refresh conversations list
        loadConversations();
      }
    });

    newSocket.on("message_error", ({ error }) => {
      console.error("Message error:", error);
      if (isMounted) {
        alert("Failed to send message: " + error);
      }
    });

    newSocket.on("user_typing", ({ userId, isTyping }) => {
      if (isMounted && selectedUser && userId === selectedUser._id) {
        setOtherUserTyping(isTyping);
      }
    });

    setSocket(newSocket);
    socketRef.current = newSocket;

    // Cleanup
    return () => {
      isMounted = false;
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [isOpen, currentUser, token, loadConversations, loadUsers, selectedUser]);

  // Handle sending message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Send button clicked - Debug:", {
      messageContent: newMessage,
      trimmedContent: newMessage.trim(),
      hasContent: !!newMessage.trim(),
      selectedUser: selectedUser?._id,
      hasSocket: !!socket,
      socketConnected,
      socketId: socket?.id
    });
    
    if (!newMessage.trim()) {
      console.log("No message content");
      return;
    }
    
    if (!selectedUser) {
      console.log("No user selected");
      alert("Please select a user to chat with");
      return;
    }
    
    if (!socket || !socketConnected) {
      console.error("Socket not connected! Current state:", { socket: !!socket, socketConnected });
      alert("Chat connection not ready. Please wait and try again.");
      return;
    }

    const messageContent = newMessage.trim();
    console.log("Sending message to:", selectedUser._id, "content:", messageContent);

    // Emit message
    socket.emit("send_message", {
      receiverId: selectedUser._id,
      content: messageContent,
    });

    // Clear input and stop typing
    setNewMessage("");
    handleStopTyping();
  };

  const handleStartTyping = () => {
    if (!isTyping && selectedUser && socket && socketConnected) {
      setIsTyping(true);
      socket.emit("typing_start", { receiverId: selectedUser._id });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        handleStopTyping();
      }, 2000);
    }
  };

  const handleStopTyping = () => {
    if (isTyping && selectedUser && socket && socketConnected) {
      setIsTyping(false);
      socket.emit("typing_end", { receiverId: selectedUser._id });
    }
  };

  const handleSelectUser = (user: User) => {
    console.log("Selecting user:", user._id, user.name);
    setSelectedUser(user);
    setShowUserList(false);
    loadMessages(user._id);
    // Mark messages as read when selecting a user
    markMessagesAsRead(user._id);
  };

  const handleBackToUsers = () => {
    setSelectedUser(null);
    setShowUserList(true);
    setMessages([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      <div
        className="absolute inset-0 bg-black/10 transition-opacity"
        onClick={onClose}
      />

      <div className="pointer-events-auto w-full sm:w-[400px] h-[600px] bg-gradient-to-b from-gray-900 to-black rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col border border-yellow-500/20">
        {/* Header */}
        <div className="p-4 border-b border-yellow-500/20 bg-black/50 backdrop-blur rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {!showUserList && selectedUser && (
                <button
                  onClick={handleBackToUsers}
                  className="text-yellow-500 hover:text-yellow-400 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <h3 className="text-lg font-semibold text-white">
                {showUserList ? "Messages" : selectedUser?.name}
              </h3>
              {!socketConnected && (
                <span className="text-xs text-yellow-500 ml-2">(Connecting...)</span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {showUserList ? (
          <div className="flex-1 overflow-y-auto">
            {/* New Chat Button */}
            <div className="p-3">
              <button
                onClick={() => setShowUserList(false)}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold py-2 px-4 rounded-lg hover:shadow-lg transition-all"
              >
                New Chat
              </button>
            </div>

            {/* Conversations List */}
            <div className="divide-y divide-yellow-500/10">
              {conversations.map((conv) => (
                <button
                  key={conv._id}
                  onClick={() => handleSelectUser(conv.otherUser)}
                  className="w-full p-4 hover:bg-white/5 transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {conv.otherUser.name}
                        </p>
                        <p className="text-sm text-gray-400 truncate w-48">
                          {conv.lastMessage || "No messages yet"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleDateString() : "New"}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="inline-block mt-1 w-5 h-5 rounded-full bg-yellow-500 text-black text-xs font-semibold flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}

              {conversations.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400">No messages yet</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Start a new chat to connect with others
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Users List for New Chat */}
            {!selectedUser ? (
              <div className="flex-1 overflow-y-auto">
                <div className="p-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                </div>

                <div className="divide-y divide-yellow-500/10">
                  {users.map((user) => (
                    <button
                      key={user._id}
                      onClick={() => handleSelectUser(user)}
                      className="w-full p-4 hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-black" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                          <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="inline-block w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <>
                      {messages.length === 0 && (
                        <div className="text-center py-12">
                          <p className="text-gray-400">No messages yet</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Send a message to start the conversation
                          </p>
                        </div>
                      )}
                      {messages.map((msg) => (
                        <div
                          key={msg._id}
                          className={`flex ${
                            msg.sender._id === currentUser?._id
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] px-4 py-2 rounded-lg ${
                              msg.sender._id === currentUser?._id
                                ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black"
                                : "bg-gray-800 text-white"
                            }`}
                          >
                            <p className="text-sm break-words">{msg.content}</p>
                            <p className="text-xs opacity-75 mt-1">
                              {new Date(msg.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      {otherUserTyping && (
                        <div className="flex justify-start">
                          <div className="bg-gray-800 text-white px-4 py-2 rounded-lg">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-yellow-500/20">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleStartTyping}
                      placeholder={socketConnected ? "Type a message..." : "Connecting to chat..."}
                      disabled={!socketConnected}
                      className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || !socketConnected}
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black p-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}