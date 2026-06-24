import { AuthLayout } from "@/components/layout/AuthLayout";
import type { ReactNode } from "react";

/**
 * Shared layout for all (auth) group pages.
 * Route group folders like (auth) don't affect the URL path.
 */
export default function AuthGroupLayout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
