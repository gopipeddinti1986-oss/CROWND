import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Briefcase, ShieldCheck, Percent, Layers, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "For Brands — Performance Creator Partnerships Without Inventory Risk",
  description:
    "Discover how small and local brands scale genuine customer acquisition through verified post-delivery creator commerce on CROWND.",
};

export default function ForBrandsPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <section className="border-b border-border bg-surface py-14 sm:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="accent">For Businesses &amp; Brands</Badge>
              <span className="text-xs text-muted">Eliminate Upfront Marketing Waste</span>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Pay strictly for verified, retained sales.
            </h1>
            <p className="text-sm leading-relaxed text-muted sm:text-base">
              Traditional influencer agencies demand thousands of dollars for non-guaranteed
              impressions. CROWND introduces true performance-based creator commerce: you set your
              commission terms, and payments clear only after products are safely delivered and the
              customer return window concludes.
            </p>
            <div className="pt-2">
              <Link href="/signup">
                <Button variant="primary" size="lg">
                  Create a Brand Account
                  <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Brand Pillars */}
      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-content space-y-10 px-4 sm:px-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Commercial Advantages
            </span>
            <h2 className="mt-1 font-serif text-2xl font-bold text-foreground">
              Built specifically for small and growing merchants
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-3 rounded border border-border bg-surface p-6 shadow-hairline">
              <div className="flex h-9 w-9 items-center justify-center rounded border border-border bg-surface-subtle text-accent">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-base font-semibold text-foreground">
                Zero Return Exposure
              </h3>
              <p className="text-xs leading-relaxed text-muted">
                If a customer cancels an order or returns an item within your store policy window,
                no creator commission is disbursed. Your margins remain protected against refunds.
              </p>
            </div>

            <div className="space-y-3 rounded border border-border bg-surface p-6 shadow-hairline">
              <div className="flex h-9 w-9 items-center justify-center rounded border border-border bg-surface-subtle text-accent">
                <Percent className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-base font-semibold text-foreground">
                Custom Commission Control
              </h3>
              <p className="text-xs leading-relaxed text-muted">
                You define whether creators earn a percentage of net sales (e.g. 12% to 25%) or a
                fixed dollar reward per unit sold. Complete control over your customer acquisition
                cost (CAC).
              </p>
            </div>

            <div className="space-y-3 rounded border border-border bg-surface p-6 shadow-hairline">
              <div className="flex h-9 w-9 items-center justify-center rounded border border-border bg-surface-subtle text-accent">
                <Briefcase className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-base font-semibold text-foreground">
                Micro-Creator Community Power
              </h3>
              <p className="text-xs leading-relaxed text-muted">
                Micro-creators (1,000 to 25,000 followers) frequently maintain 3x to 5x higher
                conversion rates than celebrity accounts because their recommendations are seen as
                genuine peer advice.
              </p>
            </div>

            <div className="space-y-3 rounded border border-border bg-surface p-6 shadow-hairline">
              <div className="flex h-9 w-9 items-center justify-center rounded border border-border bg-surface-subtle text-accent">
                <Layers className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-base font-semibold text-foreground">
                Transparent Attribution Telemetry
              </h3>
              <p className="text-xs leading-relaxed text-muted">
                Dual-layer tracking monitors both personalized click-through URLs and custom coupon
                codes, capturing cross-device transactions accurately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="mx-auto max-w-content space-y-4 px-4 sm:px-6">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Ready to launch your performance campaign?
          </h2>
          <p className="mx-auto max-w-md text-xs leading-relaxed text-muted">
            Join hundreds of local businesses and direct-to-consumer brands that acquire customers
            sustainably through CROWND.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/signup">
              <Button variant="primary" size="lg">
                Register as a Brand
                <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/creators">
              <Button variant="secondary" size="lg">
                Browse Creators Directory
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
