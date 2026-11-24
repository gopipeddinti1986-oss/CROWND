import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, CheckCircle2, Sparkles, Briefcase, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "CROWND — Performance-Based Creator Commerce",
  description:
    "From Followers to Real Results. The performance-first platform connecting brands with micro-creators through verified, post-delivery attribution.",
};

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="border-b border-border py-16 sm:py-24">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="max-w-3xl space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="accent">Performance-Based Commerce</Badge>
              <span className="text-xs text-muted">Zero Upfront Influencer Waste</span>
            </div>

            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-5xl sm:leading-[1.12]">
              From followers to verified, real-world revenue.
            </h1>

            <p className="text-base leading-relaxed text-muted sm:text-lg">
              Brands pay strictly for confirmed, delivered purchases that clear customer return
              windows. Micro-creators earn guaranteed, transparent commissions on genuine product
              conversions.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link href="/signup">
                <Button variant="primary" size="lg">
                  Get Started
                  <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button variant="secondary" size="lg">
                  How It Works
                </Button>
              </Link>
              <Link href="/campaigns">
                <Button variant="outline" size="lg">
                  Browse Active Campaigns
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Contrast: Old Sponsorship vs CROWND */}
      <section className="border-b border-border bg-surface py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="mb-10 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              The Paradigm Shift
            </span>
            <h2 className="mt-2 font-serif text-2xl font-bold text-foreground sm:text-3xl">
              Why the traditional sponsorship model is broken
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
              Upfront flat fees force brands to gamble marketing budgets on vanity impressions,
              while diligent micro-creators are overlooked because they don&apos;t have 100,000
              followers.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* The Old Model */}
            <div className="space-y-4 rounded border border-border-subtle bg-surface-subtle p-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-danger">
                <span className="h-2 w-2 rounded-full bg-danger" aria-hidden="true" />
                The Traditional Agency / Flat-Fee Model
              </div>
              <ul className="space-y-3 text-xs text-muted">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-danger">✕</span>
                  <span>
                    Brands pay thousands upfront before a single customer visits the store.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-danger">✕</span>
                  <span>Attribution relies on easily manipulated views and bots.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-danger">✕</span>
                  <span>
                    If items are returned or refunded, the brand absorbs 100% of the loss.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-danger">✕</span>
                  <span>High follower thresholds shut out authentic community voices.</span>
                </li>
              </ul>
            </div>

            {/* The CROWND Model */}
            <div className="border-accent/40 bg-accent-subtle/30 space-y-4 rounded border p-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-accent">
                <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden="true" />
                The CROWND Performance Model
              </div>
              <ul className="space-y-3 text-xs text-foreground">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-accent">✓</span>
                  <span>
                    Zero upfront influencer fees. Brands pay solely when products are sold.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-accent">✓</span>
                  <span>
                    Attribution unlocks only after delivery and the 14–30 day return window.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-accent">✓</span>
                  <span>
                    Explainable creator matching based on niche alignment and conversion power.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-accent">✓</span>
                  <span>
                    Micro-creators with 1,000 engaged followers can earn sustainable revenue.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Operational Lifecycle */}
      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="mb-10 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              How It Operates
            </span>
            <h2 className="mt-2 font-serif text-2xl font-bold text-foreground sm:text-3xl">
              Attribution built for real-world commerce
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
              Four verified stages guarantee that every dollar spent by a brand represents true
              retained revenue.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-3 rounded border border-border bg-surface p-5 shadow-hairline">
              <div className="flex h-8 w-8 items-center justify-center rounded border border-border bg-surface-subtle font-mono text-xs font-bold text-accent">
                01
              </div>
              <h3 className="font-serif text-sm font-semibold text-foreground">
                Campaign Creation
              </h3>
              <p className="text-xs leading-relaxed text-muted">
                Brand defines product terms, target niche, return window (e.g., 14 days), and fixed
                or percentage commission.
              </p>
            </div>

            <div className="space-y-3 rounded border border-border bg-surface p-5 shadow-hairline">
              <div className="flex h-8 w-8 items-center justify-center rounded border border-border bg-surface-subtle font-mono text-xs font-bold text-accent">
                02
              </div>
              <h3 className="font-serif text-sm font-semibold text-foreground">
                Micro-Creator Pairing
              </h3>
              <p className="text-xs leading-relaxed text-muted">
                Creators with organic community trust apply or receive invitations based on niche
                authenticity.
              </p>
            </div>

            <div className="space-y-3 rounded border border-border bg-surface p-5 shadow-hairline">
              <div className="flex h-8 w-8 items-center justify-center rounded border border-border bg-surface-subtle font-mono text-xs font-bold text-accent">
                03
              </div>
              <h3 className="font-serif text-sm font-semibold text-foreground">
                Tracked Customer Purchases
              </h3>
              <p className="text-xs leading-relaxed text-muted">
                Followers purchase using verified coupon codes or referral links. The order is
                logged as pending.
              </p>
            </div>

            <div className="space-y-3 rounded border border-border bg-surface p-5 shadow-hairline">
              <div className="flex h-8 w-8 items-center justify-center rounded border border-border bg-surface-subtle font-mono text-xs font-bold text-accent">
                04
              </div>
              <h3 className="font-serif text-sm font-semibold text-foreground">
                Post-Return Clearance
              </h3>
              <p className="text-xs leading-relaxed text-muted">
                Once delivery is confirmed and the return policy concludes, commissions unlock
                instantly for creator payout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Audience Perspectives: Brands & Creators */}
      <section className="border-b border-border bg-surface py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* For Brands */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-accent">
                <Briefcase className="h-4 w-4" aria-hidden="true" />
                <span>FOR SMALL &amp; LOCAL BRANDS</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground">
                Scale customer acquisition with zero inventory risk.
              </h3>
              <p className="text-xs leading-relaxed text-muted sm:text-sm">
                As an independent brand or local business, marketing cash flow is precious. CROWND
                ensures that creator collaborations function as pure performance channels rather
                than speculative ad spend.
              </p>
              <div className="pt-2">
                <Link href="/for-brands">
                  <Button variant="secondary" size="md">
                    Explore Brand Features
                    <ArrowUpRight className="ml-1 h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* For Creators */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-accent">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <span>FOR MICRO-CREATORS</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground">
                Monetize your credibility, not just your head count.
              </h3>
              <p className="text-xs leading-relaxed text-muted sm:text-sm">
                Follower counts are an outdated proxy for influence. If your community values your
                recommendations, you can earn substantial monthly revenue by sharing products you
                genuinely use and believe in.
              </p>
              <div className="pt-2">
                <Link href="/for-creators">
                  <Button variant="secondary" size="md">
                    Explore Creator Opportunities
                    <ArrowUpRight className="ml-1 h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conversion / Call to Action */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="space-y-4 rounded border border-border bg-surface p-8 text-center shadow-hairline sm:p-12">
            <span className="font-serif text-xs italic text-accent">
              &ldquo;From Followers to Real Results.&rdquo;
            </span>
            <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
              Ready to experience performance-based commerce?
            </h2>
            <p className="mx-auto max-w-md text-xs leading-relaxed text-muted sm:text-sm">
              Create your account in under two minutes. Whether you are launching your first product
              campaign or monetizing your audience, CROWND provides the foundation.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-3">
              <Link href="/signup">
                <Button variant="primary" size="lg">
                  Join CROWND Today
                  <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/faq">
                <Button variant="secondary" size="lg">
                  Read Frequently Asked Questions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
