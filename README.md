# Auth Scaffold — Next.js 15 App Router + TypeScript

A production-ready authentication starter with protected routes, modular components, and a clear API integration path.

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/dashboard`, which bounces back to `/login` since no session exists yet.

**Demo credentials:** any email + any password (except `"wrong"` which simulates an error).

---

## Folder Structure

```
/
├── app/                        # Next.js App Router pages & API routes
│   ├── (auth)/                 # Route group — shares AuthLayout, no URL segment
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── dashboard/page.tsx      # Protected page example
│   ├── api/                    # Future API route handlers go here
│   ├── layout.tsx              # Root layout — mounts AuthProvider
│   ├── page.tsx                # Root redirect → /dashboard
│   └── globals.css
│
├── components/
│   ├── auth/                   # Form components (LoginForm, SignupForm, etc.)
│   ├── ui/                     # Reusable primitives (Button, Input, Alert)
│   └── layout/                 # Page shell components (AuthLayout, DashboardLayout)
│
├── services/
│   └── auth.service.ts         # All auth API calls (currently mocked)
│
├── hooks/
│   ├── useAuthRedirect.ts      # Redirect away if already authenticated
│   └── useRequireAuth.ts       # Redirect to login if not authenticated
│
├── lib/
│   └── validations.ts          # Zod schemas for all auth forms
│
├── store/
│   └── authStore.ts            # Auth context + useReducer state (useAuth hook)
│
├── types/
│   └── auth.ts                 # TypeScript interfaces (User, AuthTokens, etc.)
│
├── utils/
│   ├── cn.ts                   # Tailwind class merger
│   └── token.ts                # localStorage helpers for tokens/user
│
├── constants/
│   ├── routes.ts               # Route strings + protected/guest-only lists
│   └── auth.ts                 # Token key names, refresh thresholds
│
├── public/                     # Static assets
└── middleware.ts               # Edge middleware — route protection
```

---

## Authentication Flow

```
User visits /dashboard
      │
      ▼
middleware.ts (Edge)
  ├─ Has auth cookie? ──No──► Redirect to /login?callbackUrl=/dashboard
  └─ Yes ──────────────────► Page renders
                                    │
                            useRequireAuth() (client hook)
                              └─ Double-checks isAuthenticated in store
                                  └─ If false → router.replace("/login")
```

### Login sequence

1. User submits `LoginForm`
2. `loginUser()` in `services/auth.service.ts` is called
3. On success: `login(user, tokens)` from `useAuth()` runs
   - Saves tokens + user to `localStorage`
   - Updates React state (`isAuthenticated: true`)
4. `router.push("/dashboard")` navigates to the protected page

---

## How Protected Routes Work

Two complementary layers:

| Layer | Where | How |
|---|---|---|
| **Edge middleware** | `middleware.ts` | Reads `auth_access_token` cookie, redirects before the page loads |
| **Client hook** | `useRequireAuth()` | Reads `isAuthenticated` from store, guards against client-side navigation |

> **Why two layers?** Middleware only reads cookies, not `localStorage`. The client hook handles cases where the user navigates via `<Link>` after the initial load.

---

## Where to Add API Integration

### 1. Replace mock service calls

Open `services/auth.service.ts`. Every function has a `// TODO: replace with real API call` comment:

```ts
// Before (mock):
return { user: { id: "usr_001", ... }, tokens: { ... } };

// After (real):
const res = await apiClient.post<AuthResponse>("/auth/login", payload);
return res.data;
```

### 2. Create an API client

Create `lib/apiClient.ts`:

```ts
import axios from "axios";
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from "@/utils/token";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token on every request
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 — refresh or logout
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      // Attempt refresh, then retry or logout
    }
    return Promise.reject(error);
  }
);
```

### 3. Set the HttpOnly cookie (for middleware)

When your login API route responds, set a cookie so middleware can read it at the edge:

```ts
// app/api/auth/login/route.ts
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const body = await request.json();
  const data = await yourBackendLogin(body); // call your backend

  const cookieStore = await cookies();
  cookieStore.set("auth_access_token", data.tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60, // 15 minutes
    path: "/",
  });

  return Response.json(data);
}
```

---

## Creating API Routes in Next.js App Router

```
app/
└── api/
    └── auth/
        ├── login/route.ts         → POST /api/auth/login
        ├── signup/route.ts        → POST /api/auth/signup
        ├── logout/route.ts        → POST /api/auth/logout
        ├── refresh/route.ts       → POST /api/auth/refresh
        └── forgot-password/route.ts
```

Each `route.ts` exports named HTTP method handlers:

```ts
// app/api/auth/login/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  // validate → call DB/external API → return response
  return NextResponse.json({ user, tokens }, { status: 200 });
}
```

---

## Token Strategy (Recommended)

| Concern | Recommendation |
|---|---|
| **Access token storage** | HttpOnly cookie (set by Next.js API route) |
| **Refresh token** | HttpOnly cookie with longer maxAge |
| **Expiry** | 15 min access / 7 day refresh |
| **Refresh trigger** | Axios interceptor on 401, or proactive check using `REFRESH_THRESHOLD_MS` |
| **Logout** | Call `/api/auth/logout` to clear server-side session + clear both cookies |

> The current scaffold uses `localStorage` for the client store hydration and cookies for middleware. When you add real API routes, move all token persistence to HttpOnly cookies and remove the `utils/token.ts` localStorage helpers.

---

## Environment Variables

Create a `.env.local` file (not committed):

```env
NEXT_PUBLIC_API_URL=http://localhost:8000   # your backend base URL
```
