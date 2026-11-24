import React from "react";
import Link from "next/link";
import { MailCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  return <VerifyEmailContent searchParams={searchParams} />;
}

async function VerifyEmailContent({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const params = await searchParams;
  const email = params.email || "your email address";

  return (
    <div className="mx-auto flex min-h-[calc(100vh-14rem)] max-w-content items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md space-y-6 rounded border border-border bg-surface p-6 text-center shadow-hairline sm:p-8">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-accent-subtle text-accent">
          <MailCheck className="h-6 w-6" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">
            Verify Your Email
          </h1>
          <p className="text-xs leading-relaxed text-muted">We have sent a verification link to:</p>
          <p className="inline-block break-all rounded border border-border bg-surface-subtle px-3 py-1.5 text-xs font-semibold text-foreground">
            {email}
          </p>
          <p className="pt-2 text-xs leading-relaxed text-muted">
            Click the link in the message to activate your CROWND account. If you don&apos;t see it
            within a few minutes, please check your spam or junk folder.
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-6">
          <Link href="/login" className="w-full">
            <Button variant="primary" size="md" className="w-full">
              Proceed to Sign In
              <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
          <Link href="/signup" className="w-full">
            <Button variant="outline" size="sm" className="w-full">
              Use a different email address
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
