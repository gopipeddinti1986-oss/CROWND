import React from "react";
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Terms and Conditions — CROWND",
  description:
    "Official Terms and Conditions governing participation, performance attribution, return clearance windows, and commission settlements on CROWND.",
};

export default function TermsPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <section className="border-b border-border bg-surface py-14 sm:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="max-w-3xl space-y-3">
            <Badge variant="accent">Legal &amp; Governance</Badge>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Terms &amp; Conditions
            </h1>
            <p className="text-xs text-muted">
              Last updated: November 24, 2026 • Please read carefully before participating
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <div className="py-16">
        <div className="mx-auto max-w-3xl space-y-8 px-4 text-xs leading-relaxed text-foreground sm:px-6 sm:text-sm">
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground">1. Agreement to Terms</h2>
            <p className="text-muted">
              These Terms and Conditions (&ldquo;Terms&rdquo;) constitute a legally binding
              agreement between you (whether personally or on behalf of an entity) and CROWND
              Technologies (&ldquo;CROWND&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
              &ldquo;our&rdquo;), governing your access to and use of the CROWND platform, including
              brand campaigns, referral links, and reward tracking services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground">
              2. User Roles &amp; Account Responsibility
            </h2>
            <div className="space-y-2 text-muted">
              <p>
                <strong>2.1 Registration:</strong> Users must register as either a
                &ldquo;Brand&rdquo; or a &ldquo;Creator&rdquo;. You agree to provide accurate,
                truthful, and current information and to maintain the security of your credentials.
              </p>
              <p>
                <strong>2.2 Creator Endorsement Standards:</strong> Creators agree to comply with
                all applicable advertising laws, including Federal Trade Commission (FTC)
                endorsement guides. All sponsored links and promotional codes must clearly and
                conspicuously disclose the material commercial relationship to the audience (e.g.
                #ad, #sponsored, or explicit verbal disclosure).
              </p>
              <p>
                <strong>2.3 Brand Fulfillment Standards:</strong> Brands agree to accurately report
                product fulfillment, carrier tracking scans, and return requests in good faith, and
                warrant that all listed products comply with safety and consumer protection
                regulations.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground">
              3. Attribution &amp; The Return Clearance Window
            </h2>
            <div className="space-y-2 text-muted">
              <p>
                <strong>3.1 Verified Purchase Definition:</strong> A purchase is attributed and
                eligible for commission settlement only when: (a) the order was placed via the
                creator&apos;s valid tracked link or code; (b) the order was delivered by a
                registered carrier; and (c) the campaign&apos;s specified return period has expired
                with no refund, return, or chargeback recorded.
              </p>
              <p>
                <strong>3.2 Exclusions:</strong> Orders that are cancelled prior to dispatch,
                returned by the customer, refunded in full, or flagged for fraudulent activity do
                not constitute verified sales. No commission or platform fee shall be payable on
                unverified or refunded transactions.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground">
              4. Commission Settlement &amp; Disbursements
            </h2>
            <p className="text-muted">
              Commissions are calculated according to the campaign terms established by the brand at
              the time of publication. Once an order successfully transitions to &ldquo;Return
              Cleared&rdquo; status, the commission balance is guaranteed and non-revocable by the
              merchant, subject only to platform anti-fraud compliance reviews.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground">
              5. Prohibited Conduct &amp; Fraud Prevention
            </h2>
            <p className="text-muted">
              Users are strictly prohibited from: (a) generating automated, scripted, or bot-driven
              referral clicks; (b) purchasing items through one&apos;s own referral link for the
              purpose of commission self-dealing; (c) bidding on brand trademark keywords in search
              engine advertising without express brand consent; and (d) misrepresenting product
              specifications, guarantees, or clinical claims. Violations result in immediate account
              termination and forfeiture of un-disbursed balances.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground">
              6. Limitation of Liability
            </h2>
            <p className="text-muted">
              CROWND acts as a software infrastructure intermediary connecting brands and creators.
              CROWND shall not be liable for direct, indirect, incidental, or consequential damages
              arising from product defects, carrier shipping delays, merchant insolvency, or
              customer disputes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground">7. Governing Law</h2>
            <p className="text-muted">
              These Terms shall be governed by and construed in accordance with the laws of the
              jurisdiction in which CROWND Technologies operates, without regard to conflict of law
              principles.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
