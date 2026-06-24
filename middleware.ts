/**
 * Next.js Edge Middleware — Route Protection
 *
 * Runs on every request before the page renders.
 * - Unauthenticated users hitting protected routes → redirect to /login
 * - Authenticated users hitting guest-only routes → redirect to /dashboard
 *
 * ── TOKEN STRATEGY ───────────────────────────────────────────────────────────
 * This scaffold reads the access token from a cookie named `auth_access_token`.
 * When you integrate the real backend:
 *   1. Set an HttpOnly cookie on the server after login (more secure than
 *      localStorage for middleware access).
 *   2. Validate the JWT here, or call a lightweight `/api/auth/verify` edge fn.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { NextResponse, type NextRequest } from "next/server";
import { PROTECTED_ROUTES, GUEST_ONLY_ROUTES, ROUTES } from "@/constants/routes";

const TOKEN_COOKIE = "auth_access_token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read token from cookie (set by your login API route or SSR layer)
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const isAuthenticated = Boolean(token);

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isGuestOnly = GUEST_ONLY_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Block unauthenticated access to protected pages
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname); // preserve intended destination
    return NextResponse.redirect(loginUrl);
  }

  // Redirect already-authenticated users away from auth pages
  if (isGuestOnly && isAuthenticated) {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
  }

  return NextResponse.next();
}

export const config = {
  /** Run middleware on all routes except static assets and Next.js internals. */
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
