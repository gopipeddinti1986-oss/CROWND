"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { resetPasswordAction } from "@/lib/auth/actions";
import { Lock, ArrowRight } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);

    startTransition(async () => {
      const res = await resetPasswordAction(formData);
      if (!res.success) {
        setError(res.error || "Failed to update password. Please try again.");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push(res.redirectUrl || "/dashboard");
        }, 2000);
      }
    });
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-14rem)] max-w-content items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md space-y-6 rounded border border-border bg-surface p-6 shadow-hairline sm:p-8">
        {/* Header */}
        <div className="space-y-1.5 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-surface-subtle text-accent">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">
            Set New Password
          </h1>
          <p className="text-xs text-muted">
            Choose a strong password to secure your CROWND account.
          </p>
        </div>

        {error && (
          <Alert variant="danger" title="Update Failed">
            {error}
          </Alert>
        )}

        {success ? (
          <div className="space-y-4 text-center">
            <Alert variant="success" title="Password Updated">
              Your password has been changed successfully. Redirecting you to your dashboard...
            </Alert>
            <Link href="/dashboard" className="block">
              <Button variant="primary" size="md" className="w-full">
                Continue to Dashboard
                <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="New Password"
              id="new-password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText="Minimum 8 characters with at least one uppercase letter and one number."
              placeholder="••••••••"
            />

            <Input
              label="Confirm New Password"
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isPending}
            >
              Update Password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
