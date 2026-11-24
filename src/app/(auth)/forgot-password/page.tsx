"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { forgotPasswordAction } from "@/lib/auth/actions";
import { ArrowLeft, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append("email", email);

    startTransition(async () => {
      const res = await forgotPasswordAction(formData);
      if (!res.success) {
        setError(res.error || "Failed to process request. Please try again.");
      } else {
        setSuccessMessage(res.message || "Password reset instructions sent.");
      }
    });
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-14rem)] max-w-content items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md space-y-6 rounded border border-border bg-surface p-6 shadow-hairline sm:p-8">
        {/* Header */}
        <div className="space-y-1.5 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-surface-subtle text-accent">
            <KeyRound className="h-5 w-5" aria-hidden="true" />
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">
            Reset Password
          </h1>
          <p className="text-xs text-muted">
            Enter your registered email and we&apos;ll send you a secure link to reset your
            password.
          </p>
        </div>

        {error && (
          <Alert variant="danger" title="Request Failed">
            {error}
          </Alert>
        )}

        {successMessage ? (
          <div className="space-y-4">
            <Alert variant="success" title="Check Your Email">
              {successMessage}
            </Alert>
            <Link href="/login" className="block">
              <Button variant="secondary" size="md" className="w-full">
                <ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden="true" />
                Return to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Registered Email Address"
              id="forgot-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isPending}
            >
              Send Reset Link
            </Button>
          </form>
        )}

        {/* Footer */}
        <div className="border-t border-border pt-4 text-center text-xs text-muted">
          Remembered your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-accent hover:underline focus-visible:outline-accent"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
