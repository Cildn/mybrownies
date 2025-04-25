// middleware.ts (at project root)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("admin_remember_me_token")?.value;
  const { pathname } = req.nextUrl;

  // if going to login and we have a token → dashboard
  if (pathname === "/signin" && token) {
    return NextResponse.redirect(new URL("/admins/dashboard", req.url));
  }

  // if going to any /admins/* and no token → login
  if (pathname.startsWith("/admins") && !token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admins/:path*"],
};
