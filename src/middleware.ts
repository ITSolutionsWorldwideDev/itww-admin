// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/auth"; // ✅ Use your existing JWT verify function

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  console.log('pathname == ', pathname);

  // ✅ Skip middleware for static assets & API routes
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.svg")
  ) {
    return NextResponse.next();
  }

  /* const token =
    req.cookies.get("token")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  const isAuthRoute = pathname.startsWith("/auth");

  console.log('token == ', token);
  console.log('isAuthRoute == ', isAuthRoute);

  // ✅ If no token, only allow auth routes
  if (!token) {
    if (!isAuthRoute) {
      return NextResponse.redirect(new URL("/auth/sign-in", req.url));
    }
    return NextResponse.next();
  }

  // ✅ If token exists, verify it
  const valid = await verifyJWT(token);
  console.log('valid == ', valid);
  if (!valid) {
    // invalid or expired token → redirect to sign-in
    const response = NextResponse.redirect(new URL("/auth/sign-in", req.url));
    response.cookies.delete("token");
    return response;
  }

  // ✅ If already logged in, prevent access to sign-in/signup
  if (isAuthRoute) {
    return NextResponse.redirect(new URL("/home", req.url));
  } */

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.svg).*)"],
};


/* // src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || req.headers.get("authorization");

  const isAuthRoute = req.nextUrl.pathname.startsWith("/auth");
  if (!token && !isAuthRoute) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/home", req.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
 */