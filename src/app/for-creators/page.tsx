import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ShieldCheck, TrendingUp, Percent, ArrowRight, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "For Creators — Turn Genuine Community Trust into Verified Revenue",
  description:
    "Join CROWND as a micro-creator. Promote products you love, receive guaranteed commissions on verified purchases, and build sustainable income without arbitrary follower requirements.",
};

export default function ForCreatorsPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <section className="border-b border-border bg-surface py-14 sm:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="accent">For Micro-Creators</Badge>
              <span className="text-xs text-muted">No Follower Gates</span>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Monetize your credibility, not just follower numbers.
            </h1>
            <p className="text-sm leading-relaxed text-muted sm:text-base">
              You don&apos;t need 100,000 followers to earn meaningful creator income. If your
              community trusts your taste and recommendations, CROWND connects you directly with
              curated brands that pay generous performance commissions for every verified sale you
              inspire.
            </p>
            <div className="pt-2">
              <Link href="/signup">
                <Button variant="primary" size="lg">
                  Join as a Creator
                  <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Creator Pillars */}
      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-content space-y-10 px-4 sm:px-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Why Creators Choose CROWND
            </span>
            <h2 className="mt-1 font-serif text-2xl font-bold text-foreground">
              Fair, transparent partnership terms
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-3 rounded border border-border bg-surface p-6 shadow-hairline">
              <div className="flex h-9 w-9 items-center justify-center rounded border border-border bg-surface-subtle text-accent">
                <HeartHandshake className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-base font-semibold text-foreground">
                Fair Access for Micro-Voices
              </h3>
              <p className="text-xs leading-relaxed text-muted">
                Whether you have 1,500 followers or 30,000, your application is evaluated on content
                quality and audience alignment, not arbitrary agency minimums.
              </p>
            </div>

            <div className="space-y-3 rounded border border-border bg-surface p-6 shadow-hairline">
              <div className="flex h-9 w-9 items-center justify-center rounded border border-border bg-surface-subtle text-accent">
                <Percent className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-base font-semibold text-foreground">
                Guaranteed Commission Payouts
              </h3>
              <p className="text-xs leading-relaxed text-muted">
                Every sale attributed to your referral link or custom coupon code is locked in
                escrow. As soon as the customer return window clears, your earnings unlock for
                disbursement.
              </p>
            </div>

            <div className="space-y-3 rounded border border-border bg-surface p-6 shadow-hairline">
              <div className="flex h-9 w-9 items-center justify-center rounded border border-border bg-surface-subtle text-accent">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-base font-semibold text-foreground">
                Authentic Brand Alignment
              </h3>
              <p className="text-xs leading-relaxed text-muted">
                Pick products you would recommend to your closest friends. Promoting products you
                genuinely enjoy preserves your audience trust while driving higher conversion rates.
              </p>
            </div>

            <div className="space-y-3 rounded border border-border bg-surface p-6 shadow-hairline">
              <div className="flex h-9 w-9 items-center justify-center rounded border border-border bg-surface-subtle text-accent">
                <TrendingUp className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-base font-semibold text-foreground">
                Transparent Real-Time Analytics
              </h3>
              <p className="text-xs leading-relaxed text-muted">
                View your link clicks, pending orders, and cleared earnings in real time. Full
                ledger transparency with zero hidden deductions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="mx-auto max-w-content space-y-4 px-4 sm:px-6">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Explore active campaigns now
          </h2>
          <p className="mx-auto max-w-md text-xs leading-relaxed text-muted">
            Discover brands looking for creators like you. Apply to campaigns with one click.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/signup">
              <Button variant="primary" size="lg">
                Create Creator Profile
                <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/campaigns">
              <Button variant="secondary" size="lg">
                Browse Active Campaigns
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
