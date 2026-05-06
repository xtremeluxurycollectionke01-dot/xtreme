// lib/auth-edge.ts
// This file is safe for Edge runtime (middleware)
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

export interface EdgeTokenPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function verifyTokenEdge(token: string): Promise<EdgeTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as EdgeTokenPayload;
  } catch (error) {
    return null;
  }
}

// Lightweight session check - no DB access
export function getTokenFromRequest(request: Request): string | null {
  // Check cookies
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map(cookie => {
        const [key, ...value] = cookie.split('=');
        return [key, value.join('=')];
      })
    );
    return cookies['auth-token'] || null;
  }
  
  // Check authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
}