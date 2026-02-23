import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import dbConnect from "./mongodb";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export async function signToken(payload: TokenPayload): Promise<string> {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth-token")?.value;
  
  if (!token) return null;
  
  const payload = await verifyToken(token);
  if (!payload) return null;
  
  await dbConnect();
  const user = await User.findById(payload.id).select("-password");
  
  return user;
}

export async function requireAuth(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  
  if (!token) {
    return null;
  }
  
  const payload = await verifyToken(token);
  if (!payload) {
    return null;
  }
  
  await dbConnect();
  const user = await User.findById(payload.id).select("-password");
  
  return user;
}

export async function requireAdmin(request: NextRequest) {
  const user = await requireAuth(request);
  
  if (!user || user.role !== "admin") {
    return null;
  }
  
  return user;
}