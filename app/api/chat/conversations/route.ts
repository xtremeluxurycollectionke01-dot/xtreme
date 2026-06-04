// app/api/chat/conversations/route.ts
/*import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {dbConnect } from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    await {dbConnect }();

    const conversations = await Conversation.find({
      participants: session._id
    })
      .populate("participants", "name email")
      .sort({ lastMessageAt: -1 });

    // Format conversations with other user info
    const formattedConversations = conversations.map(conv => {
      const otherUser = conv.participants.find(
        (p: any) => p._id.toString() !== session._id.toString()
      );
      const unreadCount = conv.unreadCount.get(session._id.toString()) || 0;

      return {
        _id: conv._id,
        otherUser: {
          _id: otherUser._id,
          name: otherUser.name,
          email: otherUser.email,
        },
        lastMessage: conv.lastMessage,
        lastMessageAt: conv.lastMessageAt,
        unreadCount,
      };
    });

    return NextResponse.json({ conversations: formattedConversations });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}*/

// app/api/chat/conversations/route.ts
/*import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {dbConnect } from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    await {dbConnect }();

    const conversations = await Conversation.find({
      participants: session._id
    })
      .populate("participants", "name email")
      .sort({ lastMessageAt: -1 });

    // Format conversations with other user info
    const formattedConversations = conversations
      .map(conv => {
        const otherUser = conv.participants.find(
          (p: any) => p._id.toString() !== session._id.toString()
        );
        
        // Skip if other user not found (shouldn't happen but handle gracefully)
        if (!otherUser) return null;
        
        const unreadCount = conv.unreadCount.get(session._id.toString()) || 0;

        return {
          _id: conv._id,
          otherUser: {
            _id: otherUser._id,
            name: otherUser.name,
            email: otherUser.email,
          },
          lastMessage: conv.lastMessage,
          lastMessageAt: conv.lastMessageAt,
          unreadCount,
        };
      })
      .filter(conv => conv !== null); // Remove any null entries

    return NextResponse.json({ conversations: formattedConversations });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}*/


// app/api/chat/conversations/route.ts
/*import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {dbConnect } from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import { Types } from "mongoose";

// Define the populated user type
interface PopulatedUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role?: string;
}

// Define the populated conversation type
interface PopulatedConversation {
  _id: Types.ObjectId;
  participants: PopulatedUser[];
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount: Map<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    await dbConnect ();

    const conversations = await Conversation.find({
      participants: session._id
    })
      .populate("participants", "name email")
      .sort({ lastMessageAt: -1 })
      .lean(); // Use .lean() to get plain JavaScript objects

    // Format conversations with other user info
    const formattedConversations = (conversations as unknown as PopulatedConversation[])
      .map(conv => {
        const otherUser = conv.participants.find(
          (p) => p._id.toString() !== session._id.toString()
        );
        
        // Skip if other user not found (shouldn't happen but handle gracefully)
        if (!otherUser) return null;
        
        const unreadCount = conv.unreadCount?.get(session._id.toString()) || 0;

        return {
          _id: conv._id.toString(),
          otherUser: {
            _id: otherUser._id.toString(),
            name: otherUser.name,
            email: otherUser.email,
          },
          lastMessage: conv.lastMessage || "",
          lastMessageAt: conv.lastMessageAt || new Date(),
          unreadCount,
        };
      })
      .filter(conv => conv !== null);

    return NextResponse.json({ conversations: formattedConversations });
  } catch (error: any) {
    console.error("Error in conversations API:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}*/

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import Conversation from "@/models/Conversation";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    await dbConnect();

    const conversations = await Conversation.find({
      participants: session._id,
    })
      .populate("participants", "name email")
      .sort({ lastMessageAt: -1 })
      .lean();

    const formattedConversations = conversations
      .map((conv: any) => {
        const otherUser = conv.participants.find(
          (p: any) => p._id.toString() !== session._id.toString()
        );

        if (!otherUser) return null;

        // ✅ FIX: object access instead of .get()
        const unreadCount =
          conv.unreadCount?.[session._id.toString()] || 0;

        return {
          _id: conv._id.toString(),
          otherUser: {
            _id: otherUser._id.toString(),
            name: otherUser.name,
            email: otherUser.email,
          },
          lastMessage: conv.lastMessage || "",
          lastMessageAt: conv.lastMessageAt || new Date(),
          unreadCount,
        };
      })
      .filter(Boolean);

    return NextResponse.json({ conversations: formattedConversations });
  } catch (error: any) {
    console.error("Error in conversations API:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}