/**
 * Auth Store — lightweight React context + useReducer implementation.
 *
 * This intentionally avoids heavy state management libraries so you can
 * swap in Zustand, Redux Toolkit, or Jotai without a full rewrite.
 * The store exposes:
 *   - `useAuth()` hook — read state and dispatch actions
 *   - `AuthProvider` — wrap your app root
 */

"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { AuthState, User, AuthTokens } from "@/types/auth";
import { saveTokens, saveUser, clearTokens, getStoredUser, getAccessToken } from "@/utils/token";

// ── State shape ───────────────────────────────────────────────────────────────

const initialState: AuthState = {
  user: null,
  tokens: null,
  isLoading: true, // true on first render while we hydrate from storage
  isAuthenticated: false,
};

// ── Actions ───────────────────────────────────────────────────────────────────

type Action =
  | { type: "SET_USER"; payload: { user: User; tokens: AuthTokens } }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean };

function authReducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGOUT":
      return { ...initialState, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

interface AuthContextValue extends AuthState {
  login: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /** Hydrate auth state from localStorage on mount (client only). */
  useEffect(() => {
    const token = getAccessToken();
    const user = getStoredUser();

    if (token && user) {
      dispatch({
        type: "SET_USER",
        payload: {
          user,
          tokens: {
            accessToken: token,
            refreshToken: "",
            expiresAt: 0,
          },
        },
      });
    } else {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const login = useCallback((user: User, tokens: AuthTokens) => {
    saveTokens(tokens);
    saveUser(user);
    dispatch({ type: "SET_USER", payload: { user, tokens } });
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    dispatch({ type: "LOGOUT" });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
