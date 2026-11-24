import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, CheckCircle2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="border-b border-border py-16 sm:py-24">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-2">
              <Badge variant="accent">Performance-Based Commerce</Badge>
              <span className="text-xs text-muted">Stage A Foundation</span>
            </div>

            <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-5xl sm:leading-[1.15]">
              From followers to verified, real-world results.
            </h1>

            <p className="text-base leading-relaxed text-muted sm:text-lg">
              CROWND connects brands with authentic micro-creators. Brands pay strictly for
              verified, delivered purchases. Micro-creators earn guaranteed, transparent commissions
              without arbitrary follower gates.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/signup">
                <Button variant="primary" size="lg">
                  Launch a Campaign
                  <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button variant="secondary" size="lg">
                  How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Value Pillars */}
      <section className="border-b border-border bg-surface py-12 sm:py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="space-y-3">
              <div className="flex h-9 w-9 items-center justify-center rounded border border-border bg-surface-subtle text-accent">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="font-serif text-base font-semibold text-foreground">
                Verified Sales Only
              </h2>
              <p className="text-xs leading-relaxed text-muted">
                Zero upfront influencer waste. Commissions unlock only after product delivery and
                the customer return window has concluded.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex h-9 w-9 items-center justify-center rounded border border-border bg-surface-subtle text-accent">
                <TrendingUp className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="font-serif text-base font-semibold text-foreground">
                Fair Micro-Creator Access
              </h2>
              <p className="text-xs leading-relaxed text-muted">
                You don&apos;t need 100k followers to earn. If you have genuine community trust and
                audience alignment, your performance speaks for itself.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex h-9 w-9 items-center justify-center rounded border border-border bg-surface-subtle text-accent">
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="font-serif text-base font-semibold text-foreground">
                Explainable Matching
              </h2>
              <p className="text-xs leading-relaxed text-muted">
                Transparent campaign fit scoring connects local businesses to the creators best
                positioned to convey the product value authentically.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
