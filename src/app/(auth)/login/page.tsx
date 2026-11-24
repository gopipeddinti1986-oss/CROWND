"use client";

import React, { useState, useTransition, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { loginAction } from "@/lib/auth/actions";
import { ArrowRight, Lock } from "lucide-react";
import { LoadingSpinner } from "@/components/feedback/loading-state";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    urlError === "auth-code-exchange-failed"
      ? "Authentication link expired or was invalid. Please try logging in directly."
      : null
  );
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("redirect", redirect);

    startTransition(async () => {
      const res = await loginAction(formData);
      if (!res.success) {
        setError(res.error || "Failed to log in. Please check your credentials.");
      } else if (res.redirectUrl) {
        router.push(res.redirectUrl);
        router.refresh();
      }
    });
  };

  return (
    <div className="w-full max-w-md space-y-6 rounded border border-border bg-surface p-6 shadow-hairline sm:p-8">
      {/* Header */}
      <div className="space-y-1.5 text-center">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-surface-subtle text-accent">
          <Lock className="h-5 w-5" aria-hidden="true" />
        </div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">
          Sign in to CROWND
        </h1>
        <p className="text-xs text-muted">
          Access your performance dashboard, campaigns, and earnings.
        </p>
      </div>

      {error && (
        <Alert variant="danger" title="Sign In Error">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          id="login-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@domain.com"
        />

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="block text-xs font-semibold uppercase tracking-wider text-muted"
            >
              Password <span className="text-danger">*</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-accent hover:underline focus-visible:outline-accent"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="mt-2 w-full"
          isLoading={isPending}
        >
          Sign In
          <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
        </Button>
      </form>

      {/* Footer */}
      <div className="border-t border-border pt-4 text-center text-xs text-muted">
        Don&apos;t have an account yet?{" "}
        <Link
          href="/signup"
          className="font-semibold text-accent hover:underline focus-visible:outline-accent"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-14rem)] max-w-content items-center justify-center px-4 py-12 sm:px-6">
      <Suspense
        fallback={
          <div className="flex w-full max-w-md flex-col items-center justify-center p-8 text-center">
            <LoadingSpinner size="md" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
