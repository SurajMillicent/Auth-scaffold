import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";

/**
 * Root route → redirect to /dashboard (middleware handles unauthenticated case).
 */
export default function RootPage() {
  redirect(ROUTES.DASHBOARD);
}
