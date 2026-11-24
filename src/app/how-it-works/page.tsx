import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "How It Works — The CROWND Performance Commerce Engine",
  description:
    "Learn how CROWND aligns brands and micro-creators through verified post-delivery attribution, custom coupon codes, and guaranteed return window clearance.",
};

export default function HowItWorksPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <section className="border-b border-border bg-surface py-14 sm:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="max-w-3xl space-y-4">
            <Badge variant="accent">Attribution Mechanics</Badge>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How CROWND Works
            </h1>
            <p className="text-sm leading-relaxed text-muted sm:text-base">
              A transparent, end-to-end framework designed to eliminate marketing risk for brands
              and ensure micro-creators are fairly paid for verified commercial outcomes.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/for-brands">
                <Button variant="secondary" size="sm">
                  Deep Dive: For Brands
                </Button>
              </Link>
              <Link href="/for-creators">
                <Button variant="secondary" size="sm">
                  Deep Dive: For Creators
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The 4-Stage Lifecycle Explained */}
      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-content space-y-12 px-4 sm:px-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Core Architecture
            </span>
            <h2 className="mt-1 font-serif text-2xl font-bold text-foreground">
              The Lifecycle of a Performance Campaign
            </h2>
          </div>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="grid grid-cols-1 gap-6 rounded border border-border bg-surface p-6 shadow-hairline md:grid-cols-12">
              <div className="md:col-span-3">
                <span className="font-mono text-xs font-bold text-accent">PHASE 01</span>
                <h3 className="mt-1 font-serif text-lg font-bold text-foreground">
                  Campaign Definition
                </h3>
                <span className="mt-1 block text-xs text-muted">Initiated by Brand</span>
              </div>
              <div className="space-y-3 text-xs leading-relaxed text-muted md:col-span-9">
                <p>
                  A brand publishes a campaign specifying the featured product, the commission rate
                  (e.g., 15% net revenue or a fixed amount per unit), and the required return window
                  (typically 14 or 30 days depending on merchant policy).
                </p>
                <div className="rounded border border-border-subtle bg-surface-subtle p-3 text-foreground">
                  <strong>Key Guardrail:</strong> No flat upfront fees or non-refundable retainer
                  deposits are charged.
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid grid-cols-1 gap-6 rounded border border-border bg-surface p-6 shadow-hairline md:grid-cols-12">
              <div className="md:col-span-3">
                <span className="font-mono text-xs font-bold text-accent">PHASE 02</span>
                <h3 className="mt-1 font-serif text-lg font-bold text-foreground">
                  Creator Application &amp; Pairing
                </h3>
                <span className="mt-1 block text-xs text-muted">Mutual Alignment</span>
              </div>
              <div className="space-y-3 text-xs leading-relaxed text-muted md:col-span-9">
                <p>
                  Micro-creators browse the Campaign Listings and apply to campaigns where they have
                  genuine personal affinity or relevant audience overlap. Brands review creator
                  profiles with transparent historical metrics.
                </p>
                <div className="rounded border border-border-subtle bg-surface-subtle p-3 text-foreground">
                  <strong>Key Guardrail:</strong> Creators are never penalized for having smaller
                  followings if their niche alignment is exceptional.
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid grid-cols-1 gap-6 rounded border border-border bg-surface p-6 shadow-hairline md:grid-cols-12">
              <div className="md:col-span-3">
                <span className="font-mono text-xs font-bold text-accent">PHASE 03</span>
                <h3 className="mt-1 font-serif text-lg font-bold text-foreground">
                  Tracked Promotion &amp; Order Logging
                </h3>
                <span className="mt-1 block text-xs text-muted">Attribution Active</span>
              </div>
              <div className="space-y-3 text-xs leading-relaxed text-muted md:col-span-9">
                <p>
                  Approved creators receive unique referral links and custom vanity coupon codes.
                  When community members purchase, the transaction is immediately logged in the
                  merchant dashboard with status <code className="text-accent">pending</code>.
                </p>
                <div className="rounded border border-border-subtle bg-surface-subtle p-3 text-foreground">
                  <strong>Key Guardrail:</strong> Both links and coupon codes are tracked
                  concurrently to ensure cross-device attribution.
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="grid grid-cols-1 gap-6 rounded border border-border bg-surface p-6 shadow-hairline md:grid-cols-12">
              <div className="md:col-span-3">
                <span className="font-mono text-xs font-bold text-accent">PHASE 04</span>
                <h3 className="mt-1 font-serif text-lg font-bold text-foreground">
                  Delivery &amp; Return Clearance
                </h3>
                <span className="mt-1 block text-xs text-muted">Guaranteed Payout</span>
              </div>
              <div className="space-y-3 text-xs leading-relaxed text-muted md:col-span-9">
                <p>
                  Once the package is delivered to the customer, the campaign&apos;s return timer
                  begins (e.g. 14 days). If the item is not returned or refunded within this window,
                  the order transitions to <code className="text-success-text">return_cleared</code>
                  , and the creator&apos;s commission moves into eligible balance.
                </p>
                <div className="rounded border border-success-border bg-success-surface p-3 text-success-text">
                  <strong>The CROWND Guarantee:</strong> Brands never pay commission on returned
                  merchandise, and creators receive 100% verified earnings without clawbacks.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Return Window Math Example */}
      <section className="border-b border-border bg-surface py-16">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="mb-8 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Financial Transparency
            </span>
            <h2 className="mt-1 font-serif text-2xl font-bold text-foreground">
              A Concrete Example of Post-Delivery Attribution
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Here is how a typical specialty coffee campaign settles financially:
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-2 rounded border border-border bg-surface-subtle p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                1. Order Placed
              </span>
              <div className="text-sm font-medium text-foreground">Customer buys $100 beans</div>
              <p className="text-xs text-muted">
                Order status: <strong>Pending</strong>. Creator commission ($15 at 15%) is reserved
                in escrow, not yet disbursed.
              </p>
            </div>

            <div className="space-y-2 rounded border border-border bg-surface-subtle p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                2. Shipping &amp; Delivery
              </span>
              <div className="text-sm font-medium text-foreground">Carrier confirms delivery</div>
              <p className="text-xs text-muted">
                14-day return clearance window initiates. Customer has two weeks to review or return
                goods according to brand policy.
              </p>
            </div>

            <div className="space-y-2 rounded border border-border bg-surface-subtle p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                3. Day 15: Clearance
              </span>
              <div className="text-sm font-medium text-success-text">No return filed</div>
              <p className="text-xs text-muted">
                Order transitions to <strong>Return Cleared</strong>. Creator receives $15.00
                directly into withdrawable balance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="mx-auto max-w-content space-y-4 px-4 sm:px-6">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Explore your role on CROWND
          </h2>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/for-brands">
              <Button variant="primary" size="lg">
                View Brand Capabilities
              </Button>
            </Link>
            <Link href="/for-creators">
              <Button variant="secondary" size="lg">
                View Creator Benefits
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
