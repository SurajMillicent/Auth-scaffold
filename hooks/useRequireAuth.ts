"use client";

/**
 * Redirects to /login when the user is NOT authenticated.
 * Use this as a client-side guard inside protected page components.
 *
 * NOTE: Next.js middleware (middleware.ts) already blocks unauthenticated
 * requests at the edge, so this hook acts as a secondary safety net for
 * client-side navigations that bypass the middleware.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/authStore";
import { ROUTES } from "@/constants/routes";

export function useRequireAuth(redirectTo: string = ROUTES.LOGIN): void {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);
}
