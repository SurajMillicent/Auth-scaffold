"use client";

/**
 * Redirects to /dashboard when the user is already authenticated.
 * Use this in guest-only pages (login, signup, forgot-password).
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/authStore";
import { ROUTES } from "@/constants/routes";

export function useAuthRedirect(redirectTo: string = ROUTES.DASHBOARD): void {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);
}
