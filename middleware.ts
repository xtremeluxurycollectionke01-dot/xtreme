import { NextResponse } from "next/server";
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
};