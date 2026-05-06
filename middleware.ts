/*import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/login", "/register"];
  const isPublicRoute = publicRoutes.some(route =>
    pathname.startsWith(route)
  );

  const protectedRoutes = ["/cart", "/checkout", "/profile", "/orders", "/admin"];
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  // If trying to access protected route without token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If logged in and trying to access login/register
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/cart/:path*",
    "/checkout/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/admin/:path*",
  ],
};*/

// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge, getTokenFromRequest } from '@/lib/auth-edge';

export async function middleware(request: NextRequest) {
  const token = getTokenFromRequest(request);
  const { pathname } = request.nextUrl;

  // Define routes
  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  const protectedRoutes = ['/cart', '/checkout', '/profile', '/orders', '/admin'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // API routes don't need middleware protection (they check auth themselves)
  const isApiRoute = pathname.startsWith('/api/');
  
  // Static files and Next.js internals
  const isStaticAsset = pathname.startsWith('/_next/') || 
                        pathname.startsWith('/favicon.ico') ||
                        pathname.includes('.');

  // If trying to access protected route without token
  if (isProtectedRoute && !token && !isApiRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If logged in and trying to access login/register
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Skip tracking for API routes and static assets
  const shouldTrack = !isApiRoute && !isStaticAsset && !isPublicRoute;

  if (shouldTrack) {
    // Get or create session ID
    let sessionId = request.cookies.get('sessionId')?.value;
    const response = NextResponse.next();
    
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      response.cookies.set('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });
    }

    // Try to get user info from token (Edge-safe)
    let userId = null;
    let userName = 'Guest';
    let userRole = 'guest';

    if (token) {
      try {
        const payload = await verifyTokenEdge(token);
        if (payload) {
          userId = payload.id;
          userName = payload.name;
          userRole = payload.role;
        }
      } catch (error) {
        // Invalid token, continue as guest
        console.error('Error verifying token in middleware:', error);
      }
    }

    // Fire and forget tracking (don't await)
    const trackingData = {
      page: pathname === '/' ? 'home' : pathname.slice(1),
      userId,
      userName,
      userRole,
      sessionId,
      referrer: request.headers.get('referer') || null,
      userAgent: request.headers.get('user-agent') || null,
      ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0] || 
                  request.headers.get('x-real-ip') || 
                  'unknown'
    };

    // Use fetch with Promise.resolve to avoid blocking
    fetch(`${request.nextUrl.origin}/api/metrics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trackingData),
      // Don't wait for response
    }).catch(error => console.error('Failed to track view:', error));

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/cart/:path*',
    '/checkout/:path*',
    '/profile/:path*',
    '/orders/:path*',
    '/admin/:path*',
    '/products/:path*',
    '/about/:path*',
    '/contact/:path*',
  ],
};