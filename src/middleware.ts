import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const adminToken = req.cookies.get("admin_token")?.value;
  const pathname = req.nextUrl.pathname;

  // Redirect unauthenticated users trying to access /admin routes
  if (pathname.startsWith("/admin")) {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  }

  // Redirect authenticated users trying to access /login or /signin
  if (adminToken && (pathname === "/login" || pathname === "/signin")) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // Allow all other routes to proceed as normal
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/signin"],
};