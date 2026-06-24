"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/validations";
import { requestPasswordReset } from "@/services/auth.service";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { ROUTES } from "@/constants/routes";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export function ForgotPasswordForm() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  useAuthRedirect();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setServerError(null);
    setSuccessMessage(null);
    try {
      const { message } = await requestPasswordReset(values);
      setSuccessMessage(message);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Request failed.");
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Reset password</h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        {successMessage && (
          <Alert type="success" message={successMessage} className="mb-4" />
        )}
        {serverError && (
          <Alert type="error" message={serverError} className="mb-4" />
        )}

        {!successMessage && (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <Button type="submit" isLoading={isSubmitting}>
              Send reset link
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          Remember your password?{" "}
          <Link href={ROUTES.LOGIN} className="text-indigo-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
