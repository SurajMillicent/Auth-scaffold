/**
 * /dashboard — Protected page (sample).
 *
 * Protection layers:
 *   1. Edge middleware (middleware.ts) — redirects unauthenticated requests.
 *   2. useRequireAuth() hook — client-side safety net for SPA navigations.
 */
"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAuth } from "@/store/authStore";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function DashboardPage() {
  useRequireAuth();

  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading…
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name ?? "there"} 👋
          </h1>
          <p className="text-gray-500 mt-1">Here&apos;s a summary of your account.</p>
        </div>

        {/* Sample stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Projects", value: "3" },
            { label: "Tasks open", value: "12" },
            { label: "Team members", value: "5" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
            >
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
            </div>
          ))}
        </div>

        {/* User details card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-700 mb-3">Account details</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex gap-2">
              <dt className="text-gray-500 w-24">Name</dt>
              <dd className="text-gray-900">{user?.name}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-gray-500 w-24">Email</dt>
              <dd className="text-gray-900">{user?.email}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-gray-500 w-24">Role</dt>
              <dd className="text-gray-900 capitalize">{user?.role}</dd>
            </div>
          </dl>
        </div>
      </div>
    </DashboardLayout>
  );
}
