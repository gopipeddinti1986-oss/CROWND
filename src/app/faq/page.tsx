import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — CROWND",
  description:
    "Find comprehensive answers about performance creator commerce, post-delivery attribution, return windows, creator earnings, and brand safeguards.",
};

const FAQS = [
  {
    category: "For Brands & Businesses",
    items: [
      {
        q: "What does 'verified purchase' mean on CROWND?",
        a: "A verified purchase is a completed transaction where the product has been physically delivered to the buyer, and the merchant's specified return window (e.g. 14 or 30 days) has elapsed without a return, exchange, or refund request being initiated.",
      },
      {
        q: "What happens if a customer returns a product?",
        a: "If a customer initiates a return or receives a full refund during the return window, the order status changes to 'refunded'. The brand is not charged any creator commission or platform fee for that transaction.",
      },
      {
        q: "Can I customize the commission rate and return period?",
        a: "Yes. When defining a campaign, brands specify their exact commission rate (either a percentage of net sales or a fixed dollar reward per unit) and configure their official return window (typically 14, 21, or 30 days).",
      },
      {
        q: "Are there any monthly subscription fees?",
        a: "No. CROWND charges 0% upfront and no monthly subscription for standard campaign hosting. We charge a 5% platform servicing fee strictly on verified completed orders.",
      },
    ],
  },
  {
    category: "For Micro-Creators",
    items: [
      {
        q: "Do I need a minimum follower count to join?",
        a: "No. CROWND values audience trust and niche alignment over vanity follower counts. Creators with as few as 1,000 engaged followers frequently outperform macro-influencers in conversion rates.",
      },
      {
        q: "How and when do I receive commission payouts?",
        a: "When a customer buys via your link or code, the commission is recorded as 'Pending'. As soon as the carrier confirms delivery and the return window passes, the funds transition to 'Eligible' and are unlocked for direct payout.",
      },
      {
        q: "Can I promote products using both links and coupon codes?",
        a: "Yes. CROWND generates both a custom tracking link and a personalized vanity discount code (e.g. ALEX10). Both are attributed to your account automatically.",
      },
      {
        q: "Does CROWND take a cut of my creator commission?",
        a: "No. Creators keep 100% of the commission stated in the campaign terms. Our platform fee is paid separately by the merchant on verified orders.",
      },
    ],
  },
  {
    category: "Tracking, Attribution & Security",
    items: [
      {
        q: "Does tracking rely on third-party tracking cookies?",
        a: "No. CROWND utilizes server-side attribution and first-party parameter tokens alongside unique promo code matching, ensuring resilient attribution even across privacy-focused browsers.",
      },
      {
        q: "How does CROWND prevent affiliate fraud and self-referrals?",
        a: "Our telemetry monitors anomalous IP clusters, duplicate payment identities, bot traffic, and rapid refund patterns. Suspicious activities are automatically flagged for administrative review before commission clearance.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <section className="border-b border-border bg-surface py-14 sm:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="accent">Help &amp; Documentation</Badge>
              <span className="text-xs text-muted">Platform FAQ</span>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Frequently Asked Questions
            </h1>
            <p className="text-xs leading-relaxed text-muted sm:text-sm">
              Everything you need to know about performance-based creator commerce, return clearance
              windows, commission security, and brand safeguards.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion List */}
      <section className="py-16">
        <div className="mx-auto max-w-content space-y-12 px-4 sm:px-6">
          {FAQS.map((category) => (
            <div key={category.category} className="space-y-6">
              <h2 className="border-b border-border pb-2 font-serif text-xl font-bold text-foreground">
                {category.category}
              </h2>

              <div className="space-y-4">
                {category.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="space-y-2 rounded border border-border bg-surface p-5 shadow-hairline"
                  >
                    <h3 className="flex items-start gap-2 font-serif text-sm font-bold text-foreground">
                      <span className="mt-0.5 font-sans text-xs text-accent">Q.</span>
                      {item.q}
                    </h3>
                    <p className="pl-5 text-xs leading-relaxed text-muted">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still have questions */}
      <section className="border-t border-border bg-surface py-14 text-center">
        <div className="mx-auto max-w-content space-y-4 px-4 sm:px-6">
          <h3 className="font-serif text-xl font-bold text-foreground">
            Still have questions about how CROWND operates?
          </h3>
          <p className="mx-auto max-w-md text-xs leading-relaxed text-muted">
            Read our detailed educational guides or explore active campaigns directly.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/guides">
              <Button variant="secondary" size="md">
                Browse Guides
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="primary" size="md">
                Get Started
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
