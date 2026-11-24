import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ShieldCheck, HeartHandshake, Eye, Sparkles, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About CROWND — Mission, Values & Platform Thesis",
  description:
    "CROWND is built to restore economic fairness to creator-commerce. Learn about our mission: From Followers to Real Results.",
};

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <section className="border-b border-border bg-surface py-14 sm:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="accent">Our Mission</Badge>
              <span className="text-xs text-muted">From Followers to Real Results</span>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Re-aligning creator commerce around verified economic value.
            </h1>
            <p className="text-sm leading-relaxed text-muted sm:text-base">
              We started CROWND because the creator marketing industry had become detached from the
              basic realities of retail commerce. We are building the infrastructure that connects
              independent merchants with passionate micro-creators on terms that guarantee fairness,
              transparency, and net profitability.
            </p>
          </div>
        </div>
      </section>

      {/* Origin & Thesis */}
      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-content space-y-8 px-4 sm:px-6">
          <div className="max-w-3xl space-y-4 text-xs leading-relaxed text-muted sm:text-sm">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              The Problem We Set Out to Solve
            </h2>
            <p>
              Over the last decade, influencer marketing became distorted by vanity metrics. Large
              agencies pushed brands into five-figure non-refundable retainers for sponsored posts
              that often resulted in zero sales. Small and local businesses were routinely burned by
              campaigns that looked glamorous on Instagram but failed to deliver positive unit
              economics.
            </p>
            <p>
              At the same time, millions of dedicated micro-creators with between 1,000 and 25,000
              followers were entirely locked out of brand sponsorships. Despite maintaining intense
              community loyalty and genuine domain expertise, they were ignored by legacy talent
              rosters that only cared about arbitrary follower milestones.
            </p>
            <p>
              CROWND was designed as the antidote: a performance-first marketplace where brands pay
              strictly for verified, delivered, and unreturned customer purchases, and where
              creators are rewarded in direct proportion to the genuine commerce they inspire.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Core Principles */}
      <section className="border-b border-border bg-surface py-16">
        <div className="mx-auto max-w-content space-y-10 px-4 sm:px-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Operating Philosophy
            </span>
            <h2 className="mt-1 font-serif text-2xl font-bold text-foreground">
              The Principles That Guide CROWND
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-3 rounded border border-border bg-surface-subtle p-6">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-surface text-accent">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-base font-bold text-foreground">
                1. Performance Over Vanity
              </h3>
              <p className="text-xs leading-relaxed text-muted">
                Impressions, views, and likes are vanity signals. We measure and reward the only
                metric that sustains physical businesses: verified, retained revenue.
              </p>
            </div>

            <div className="space-y-3 rounded border border-border bg-surface-subtle p-6">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-surface text-accent">
                <Eye className="h-4 w-4" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-base font-bold text-foreground">
                2. Radical Transparency
              </h3>
              <p className="text-xs leading-relaxed text-muted">
                Both brands and creators have full ledger access to transaction timestamps, carrier
                delivery verification, and return clearance countdowns. Zero hidden fees.
              </p>
            </div>

            <div className="space-y-3 rounded border border-border bg-surface-subtle p-6">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-surface text-accent">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-base font-bold text-foreground">
                3. Micro-Creator Empowerment
              </h3>
              <p className="text-xs leading-relaxed text-muted">
                We believe the future of commerce belongs to authentic micro-voices with genuine
                peer credibility. If your audience trusts you, your commercial potential is
                limitless.
              </p>
            </div>

            <div className="space-y-3 rounded border border-border bg-surface-subtle p-6">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-surface text-accent">
                <HeartHandshake className="h-4 w-4" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-base font-bold text-foreground">
                4. Mutual Protection
              </h3>
              <p className="text-xs leading-relaxed text-muted">
                Brands are protected against return losses, and creators are protected against
                retroactive commission deductions. Once an order clears the return window, payment
                is final.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="mx-auto max-w-content space-y-4 px-4 sm:px-6">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Join the performance commerce movement
          </h2>
          <p className="mx-auto max-w-md text-xs leading-relaxed text-muted">
            Create an account today as a brand partner or micro-creator.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/signup">
              <Button variant="primary" size="lg">
                Create Free Account
                <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button variant="secondary" size="lg">
                Learn How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
