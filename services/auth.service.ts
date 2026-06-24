/**
 * Auth Service — API integration layer.
 *
 * All functions currently return mock data so the frontend flow can be
 * developed and tested without a running backend.
 *
 * ── HOW TO ADD REAL API CALLS ────────────────────────────────────────────────
 * 1. Replace the `// TODO: replace with real API call` blocks with fetch/axios.
 * 2. Use the `apiClient` from `@/lib/apiClient` (create this file when ready).
 * 3. Map backend response shapes to the types in `@/types/auth`.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type {
  AuthResponse,
  LoginPayload,
  SignupPayload,
  ForgotPasswordPayload,
} from "@/types/auth";

const MOCK_DELAY_MS = 800;

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ── Login ─────────────────────────────────────────────────────────────────────

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  await delay(MOCK_DELAY_MS);

  // TODO: replace with real API call
  // const res = await apiClient.post<AuthResponse>("/auth/login", payload);
  // return res.data;

  if (payload.password === "wrong") {
    throw new Error("Invalid email or password.");
  }

  return {
    user: {
      id: "usr_001",
      email: payload.email,
      name: "Demo User",
      role: "user",
      createdAt: new Date().toISOString(),
    },
    tokens: {
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 min
    },
  };
}

// ── Signup ────────────────────────────────────────────────────────────────────

export async function signupUser(
  payload: SignupPayload
): Promise<AuthResponse> {
  await delay(MOCK_DELAY_MS);

  // TODO: replace with real API call
  // const res = await apiClient.post<AuthResponse>("/auth/signup", payload);
  // return res.data;

  return {
    user: {
      id: "usr_002",
      email: payload.email,
      name: payload.name,
      role: "user",
      createdAt: new Date().toISOString(),
    },
    tokens: {
      accessToken: "mock-access-token-new",
      refreshToken: "mock-refresh-token-new",
      expiresAt: Date.now() + 15 * 60 * 1000,
    },
  };
}

// ── Forgot Password ───────────────────────────────────────────────────────────

export async function requestPasswordReset(
  payload: ForgotPasswordPayload
): Promise<{ message: string }> {
  await delay(MOCK_DELAY_MS);

  // TODO: replace with real API call
  // const res = await apiClient.post("/auth/forgot-password", payload);
  // return res.data;

  return {
    message: `Reset link sent to ${payload.email}`,
  };
}

// ── Logout ────────────────────────────────────────────────────────────────────

export async function logoutUser(): Promise<void> {
  await delay(200);

  // TODO: replace with real API call (invalidate refresh token server-side)
  // await apiClient.post("/auth/logout");
}
