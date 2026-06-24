/**
 * Centralised route constants.
 * Use these instead of raw strings to prevent typos and ease refactoring.
 */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  DASHBOARD: "/dashboard",
} as const;

/** Routes that require an authenticated session. */
export const PROTECTED_ROUTES: string[] = ["/dashboard"];

/** Routes only accessible when NOT authenticated (redirect away if logged in). */
export const GUEST_ONLY_ROUTES: string[] = [
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
  ROUTES.FORGOT_PASSWORD,
];
