import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "The Shift from Follower Count to Verified Conversion — CROWND Guide",
  description:
    "Why traditional flat-fee influencer retainers fail small businesses, and how transitioning to post-delivery verified attribution eliminates marketing risk.",
};

export default function PerformancePartnershipsGuide() {
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
              <Badge variant="accent">Brand Strategy</Badge>
              <span className="text-xs text-muted">7 min read • November 2026</span>
            </div>
            <h1 className="font-serif text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
              The Shift from Follower Count to Verified Conversion: Why Performance Partnerships
              Protect Local Brands
            </h1>
            <p className="text-sm leading-relaxed text-muted sm:text-base">
              For over a decade, influencer marketing functioned like broadcast billboard
              advertising: brands paid astronomical flat fees based entirely on potential
              impressions. Here is why that model is collapsing—and how performance-based
              attribution provides a sustainable alternative.
            </p>
          </div>
        </div>
      </header>

      {/* Body Content */}
      <div className="py-16">
        <div className="mx-auto max-w-3xl space-y-8 px-4 text-sm leading-relaxed text-foreground sm:px-6">
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              The Illusion of Vanity Reach
            </h2>
            <p>
              When a brand pays a creator $2,500 for a dedicated Instagram Reel or TikTok video,
              what is actually being purchased? Under the traditional sponsorship agency model, the
              brand is purchasing <em>speculative attention</em>. If the creator has 250,000
              followers, the brand assumes a baseline fraction will see the content and an even
              smaller fraction will purchase.
            </p>
            <p>
              However, algorithmic platform changes have largely severed the connection between
              follower counts and actual content distribution. A creator with 300,000 followers
              might experience video reach fluctuating between 8,000 and 500,000 views depending
              entirely on algorithmic whim. When that video underperforms, the brand bears 100% of
              the downside.
            </p>
          </section>

          <section className="space-y-4 rounded border border-border bg-surface p-6 shadow-hairline">
            <h3 className="font-serif text-lg font-bold text-foreground">
              The Flaw of Paying Before Delivery
            </h3>
            <p className="text-xs leading-relaxed text-muted">
              In conventional e-commerce retail, no sensible merchant disburses full commissions to
              an affiliate or partner while customer parcels are still in transit. Why? Because
              return rates in direct-to-consumer goods typically average between 8% and 25%.
            </p>
            <p className="text-xs leading-relaxed text-muted">
              When an upfront influencer campaign drives $10,000 of gross orders but generates
              $2,500 in product returns, a merchant who already paid a $3,000 upfront fee has
              effectively eroded their gross margin.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Enter Post-Delivery Attribution
            </h2>
            <p>
              Performance-based creator commerce rebalances the economic agreement between brands
              and creators. Rather than asking independent brands to gamble on upfront production
              costs, the brand offers a compelling commission rate (such as 15% to 25% of net order
              value).
            </p>
            <p>
              The crucial operational distinction on CROWND is that this commission is not unlocked
              immediately upon checkout. Instead, it enters an escrow-backed pending state. Once the
              logistics provider confirms physical package delivery, a predetermined return window
              (for instance, 14 days) counts down.
            </p>
            <ul className="space-y-2 pl-4 text-xs text-muted">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>
                  <strong>Net Margin Security:</strong> The brand is only charged commissions on
                  retained revenue.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>
                  <strong>Creator Certainty:</strong> The creator knows that once the return window
                  closes, their earnings are legally guaranteed and protected against clawbacks.
                </span>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Why Micro-Creators Win Under Performance Terms
            </h2>
            <p>
              Skeptics often assume creators prefer flat fees. While macro-celebrities with low
              conversion rates certainly prefer flat retainers, talented micro-creators frequently
              earn far more under performance terms.
            </p>
            <p>
              Consider a creator with 9,000 devoted followers in the specialty coffee niche. If 80
              followers purchase a $70 home manual brewing kettle, that generates $5,600 in verified
              gross revenue. At a 18% commission rate, the creator earns $1,008 from a single
              video—far more than the $150 or $200 an agency would have offered for an upfront post.
            </p>
          </section>

          {/* Footer Call to Action */}
          <div className="mt-12 space-y-3 rounded border border-border bg-surface p-6 text-center">
            <h3 className="font-serif text-lg font-bold text-foreground">
              Ready to test performance creator partnerships?
            </h3>
            <p className="mx-auto max-w-md text-xs text-muted">
              Launch a campaign on CROWND with zero upfront platform cost and verified post-delivery
              attribution.
            </p>
            <div className="pt-2">
              <Link href="/signup">
                <Button variant="primary" size="md">
                  Create a Brand Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
