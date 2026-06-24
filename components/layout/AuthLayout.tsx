/**
 * Shared wrapper for all auth pages (login, signup, forgot-password).
 * Centres content and provides a consistent background.
 */
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center px-4 py-12">
      {children}
    </main>
  );
}
