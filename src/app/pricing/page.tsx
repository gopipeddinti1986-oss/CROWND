import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Pricing & Fee Schedule — Transparent Performance Commerce",
  description:
    "CROWND performance-based pricing: 0% upfront risk for brands, zero platform fees for creators. Pay only when products are sold and return windows clear.",
};

export default function PricingPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <section className="border-b border-border bg-surface py-14 sm:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="accent">Early Access Fee Schedule</Badge>
              <span className="text-xs text-muted">Proposed Stage A Model</span>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Pay for net results, never for speculation.
            </h1>
            <p className="text-xs leading-relaxed text-muted sm:text-sm">
              We align our incentives directly with yours. Brands pay zero monthly subscription
              fees; we charge a modest platform servicing fee only when a customer purchase is
              verified, delivered, and completely clears the return window.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Creator Tier */}
            <div className="flex flex-col justify-between space-y-6 rounded border border-border bg-surface p-8 shadow-hairline">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="neutral">For Micro-Creators</Badge>
                  <span className="text-xs text-muted">100% Free</span>
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">Creator Partner</h2>
                  <p className="mt-1 text-xs text-muted">
                    Everything you need to apply to campaigns, generate tracked links, and receive
                    guaranteed earnings.
                  </p>
                </div>
                <div className="flex items-baseline gap-1 pt-2">
                  <span className="font-serif text-4xl font-bold text-foreground">$0</span>
                  <span className="text-xs text-muted">/ month forever</span>
                </div>

                <ul className="space-y-2.5 border-t border-border pt-2 text-xs text-muted">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>Zero deduction from your set campaign commission rate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>Unlimited campaign applications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>Personalized vanity discount codes &amp; tracking links</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>Direct ledger visibility into order status &amp; return clearance</span>
                  </li>
                </ul>
              </div>

              <Link href="/signup">
                <Button variant="primary" size="lg" className="w-full">
                  Join as Creator
                  <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </div>

            {/* Brand Performance Tier */}
            <div className="flex flex-col justify-between space-y-6 rounded border border-accent bg-surface p-8 shadow-hairline">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="accent">For Brands &amp; Businesses</Badge>
                  <span className="text-xs font-semibold text-accent">Zero Upfront Risk</span>
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    Performance Merchant
                  </h2>
                  <p className="mt-1 text-xs text-muted">
                    Launch campaigns and pay strictly when products are delivered and the return
                    period concludes without refund.
                  </p>
                </div>
                <div className="flex items-baseline gap-2 pt-2">
                  <span className="font-serif text-4xl font-bold text-foreground">5%</span>
                  <span className="text-xs text-muted">
                    platform servicing fee per verified order
                  </span>
                </div>

                <ul className="space-y-2.5 border-t border-border pt-2 text-xs text-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>Zero monthly subscription or onboarding fees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>$0 fee if customer cancels or returns the product</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>You set the exact commission percentage (e.g. 10%–25%)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>Dual coupon code and link tracking telemetry</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>Custom return clearance windows (14 to 30 days)</span>
                  </li>
                </ul>
              </div>

              <Link href="/signup">
                <Button variant="primary" size="lg" className="w-full">
                  Create Brand Account
                  <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="border-t border-border bg-surface py-16">
        <div className="mx-auto max-w-content space-y-8 px-4 sm:px-6">
          <div className="max-w-2xl">
            <h3 className="font-serif text-2xl font-bold text-foreground">
              Compare Marketing Models
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              How CROWND compares to traditional influencer marketing agencies and legacy affiliate
              networks.
            </p>
          </div>

          <div className="overflow-x-auto rounded border border-border bg-surface">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-surface-subtle font-semibold uppercase text-muted">
                <tr>
                  <th className="p-4">Feature</th>
                  <th className="p-4 text-accent">CROWND Platform</th>
                  <th className="p-4">Traditional Influencer Agency</th>
                  <th className="p-4">Legacy Affiliate Network</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-4 font-semibold text-foreground">Upfront Cost</td>
                  <td className="p-4 font-semibold text-accent">$0.00</td>
                  <td className="p-4 text-muted">$3,000 – $10,000+ retainer</td>
                  <td className="p-4 text-muted">$500 – $2,000 setup fee</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-foreground">Return Protection</td>
                  <td className="p-4 font-semibold text-accent">100% Protected (Post-delivery)</td>
                  <td className="p-4 text-muted">None (Paid before delivery)</td>
                  <td className="p-4 text-muted">Manual monthly reconciliation</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-foreground">Micro-Creator Access</td>
                  <td className="p-4 font-semibold text-accent">Open &amp; Explainable Matching</td>
                  <td className="p-4 text-muted">Exclusively high-follower tier</td>
                  <td className="p-4 text-muted">Passive coupon scraping sites</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-foreground">Creator Payment Certainty</td>
                  <td className="p-4 font-semibold text-accent">Locked in escrow on delivery</td>
                  <td className="p-4 text-muted">Slow net-60/net-90 invoicing</td>
                  <td className="p-4 text-muted">Frequent unexplained clawbacks</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
