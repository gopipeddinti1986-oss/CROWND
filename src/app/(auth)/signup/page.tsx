"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { signUpAction } from "@/lib/auth/actions";
import { ArrowRight, Briefcase, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function SignUpPage() {
  const router = useRouter();

  const [role, setRole] = useState<"brand" | "creator">("creator");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("role", role);
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("password", password);

    startTransition(async () => {
      const res = await signUpAction(formData);
      if (!res.success) {
        setError(res.error || "Failed to create account. Please try again.");
      } else if (res.redirectUrl) {
        router.push(res.redirectUrl);
      }
    });
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-14rem)] max-w-content items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-lg space-y-6 rounded border border-border bg-surface p-6 shadow-hairline sm:p-8">
        {/* Header */}
        <div className="space-y-1.5 text-center">
          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">
            Join CROWND
          </h1>
          <p className="text-xs text-muted">
            Performance creator-commerce. Select your primary account role below.
          </p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Select account type">
          <button
            type="button"
            role="radio"
            aria-checked={role === "creator"}
            onClick={() => setRole("creator")}
            className={cn(
              "flex flex-col items-start rounded border p-3.5 text-left transition-all",
              role === "creator"
                ? "bg-accent/5 border-accent ring-1 ring-accent"
                : "border-border bg-surface hover:bg-surface-subtle"
            )}
          >
            <div className="mb-2 flex h-7 w-7 items-center justify-center rounded bg-surface-subtle text-accent">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </div>
            <span className="text-xs font-semibold text-foreground">I am a Creator</span>
            <span className="mt-0.5 text-[11px] leading-snug text-muted">
              Promote products and earn verified commissions.
            </span>
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={role === "brand"}
            onClick={() => setRole("brand")}
            className={cn(
              "flex flex-col items-start rounded border p-3.5 text-left transition-all",
              role === "brand"
                ? "bg-accent/5 border-accent ring-1 ring-accent"
                : "border-border bg-surface hover:bg-surface-subtle"
            )}
          >
            <div className="mb-2 flex h-7 w-7 items-center justify-center rounded bg-surface-subtle text-accent">
              <Briefcase className="h-4 w-4" aria-hidden="true" />
            </div>
            <span className="text-xs font-semibold text-foreground">I am a Brand</span>
            <span className="mt-0.5 text-[11px] leading-snug text-muted">
              Launch performance campaigns and pay for verified sales.
            </span>
          </button>
        </div>

        {error && (
          <Alert variant="danger" title="Registration Error">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={role === "brand" ? "Company / Brand Name" : "Your Full Name or Handle"}
            id="signup-name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={role === "brand" ? "Aura Goods Co." : "Alex Rivera"}
          />

          <Input
            label="Work or Personal Email"
            id="signup-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
          />

          <Input
            label="Password"
            id="signup-password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Minimum 8 characters with at least one uppercase letter and one number."
            placeholder="••••••••"
          />

          <div className="text-[11px] leading-relaxed text-muted">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-accent hover:underline">
              Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-accent hover:underline">
              Privacy Policy
            </Link>
            .
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isPending}
          >
            Create {role === "brand" ? "Brand" : "Creator"} Account
            <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
          </Button>
        </form>

        {/* Footer */}
        <div className="border-t border-border pt-4 text-center text-xs text-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-accent hover:underline focus-visible:outline-accent"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
