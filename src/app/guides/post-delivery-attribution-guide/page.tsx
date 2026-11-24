import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Demystifying Post-Delivery Attribution — CROWND Guide",
  description:
    "A deep dive into the mechanics of e-commerce returns, delivery verification, and escrow-backed commission clearance that protects both merchants and creators.",
};

export default function PostDeliveryAttributionGuide() {
  return (
    <article className="w-full">
      {/* Header */}
      <header className="border-b border-border bg-surface py-14 sm:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="max-w-3xl space-y-4">
            <Link
              href="/guides"
              className="inline-flex items-center gap-1 text-xs text-muted transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Back to all guides
            </Link>
            <div className="flex items-center gap-2">
              <Badge variant="accent">Attribution &amp; Finance</Badge>
              <span className="text-xs text-muted">8 min read • November 2026</span>
            </div>
            <h1 className="font-serif text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
              Demystifying Post-Delivery Attribution: Why Return Windows Are the Key to Fair
              E-Commerce Partnerships
            </h1>
            <p className="text-sm leading-relaxed text-muted sm:text-base">
              Why traditional affiliate systems create endless billing disputes, and how
              carrier-verified delivery milestones solve the return dilemma once and for all.
            </p>
          </div>
        </div>
      </header>

      {/* Body Content */}
      <div className="py-16">
        <div className="mx-auto max-w-3xl space-y-8 px-4 text-sm leading-relaxed text-foreground sm:px-6">
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              The Fundamental Flaw of Click Attribution
            </h2>
            <p>
              Traditional affiliate marketing networks were conceived in the late 1990s. Their
              technical foundation was straightforward: if a customer clicks an affiliate link, a
              cookie is dropped. If that user checks out within 30 days, the affiliate is credited.
            </p>
            <p>In modern physical commerce, this model falls apart in two critical scenarios:</p>
            <ol className="list-decimal space-y-2 pl-6 text-xs text-muted">
              <li>
                <strong>Cookie Destruction &amp; Privacy Sandboxes:</strong> Modern mobile browsers
                frequently strip third-party cookies or restrict tracking lifetimes, breaking the
                attribution chain and denying creators legitimate compensation.
              </li>
              <li>
                <strong>Checkout-Time Payout Hazards:</strong> Paying commission at checkout assumes
                the transaction is complete. In reality, delivery delays, carrier damage, porch
                piracy, and customer remorse mean a significant percentage of orders never become
                retained revenue.
              </li>
            </ol>
          </section>

          <section className="space-y-4 rounded border border-border bg-surface p-6 shadow-hairline">
            <h3 className="font-serif text-lg font-bold text-foreground">
              The Post-Delivery Attribution State Machine
            </h3>
            <p className="text-xs leading-relaxed text-muted">
              To solve these structural failures, CROWND implements a deterministic state machine
              for every attributed transaction:
            </p>
            <div className="space-y-3 pt-2 text-xs">
              <div className="rounded border border-border-subtle bg-surface-subtle p-3">
                <strong className="text-foreground">State 1: PENDING (Order Placed)</strong>
                <p className="mt-0.5 text-muted">
                  The order is recorded via referral link parameter or promo code redemption. The
                  commission is calculated and reserved in escrow.
                </p>
              </div>

              <div className="rounded border border-border-subtle bg-surface-subtle p-3">
                <strong className="text-foreground">State 2: IN TRANSIT</strong>
                <p className="mt-0.5 text-muted">
                  Package is en route. The clearance clock remains paused until the carrier logs a
                  successful delivery scan.
                </p>
              </div>

              <div className="rounded border border-border-subtle bg-surface-subtle p-3">
                <strong className="text-foreground">State 3: RETURN WINDOW ACTIVE</strong>
                <p className="mt-0.5 text-muted">
                  Upon verified delivery, the brand&apos;s return policy timer (14, 21, or 30 days)
                  commences. Both brand and creator can monitor the countdown in real time.
                </p>
              </div>

              <div className="rounded border border-success-border bg-success-surface p-3 text-success-text">
                <strong className="text-success-text">
                  State 4: RETURN CLEARED (Final Settlement)
                </strong>
                <p className="mt-0.5">
                  The window elapses without return or dispute. The commission automatically unlocks
                  and shifts to the creator&apos;s withdrawable balance with zero risk of clawback.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Mutual Protection: The Escrow Principle
            </h2>
            <p>
              By treating the return clearance period as a first-class citizen of the transaction
              lifecycle, both sides operate with total peace of mind:
            </p>
            <p>
              Brands never worry that an influencer campaign will generate artificial orders that
              are subsequently refunded while commissions remain unrecoverable. Creators,
              conversely, are guaranteed that once the return deadline passes, their money cannot be
              withheld due to internal accounting delays.
            </p>
          </section>

          {/* Footer Call to Action */}
          <div className="mt-12 space-y-3 rounded border border-border bg-surface p-6 text-center">
            <h3 className="font-serif text-lg font-bold text-foreground">
              Experience the certainty of verified attribution
            </h3>
            <p className="mx-auto max-w-md text-xs text-muted">
              Whether you are a growing brand or a dedicated micro-creator, CROWND establishes
              commerce partnerships grounded in real-world results.
            </p>
            <div className="pt-2">
              <Link href="/signup">
                <Button variant="primary" size="md">
                  Join CROWND
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
