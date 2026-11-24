import React from "react";
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Privacy Policy — CROWND",
  description:
    "Learn how CROWND collects, protects, and handles personal data, attribution tokens, and account information in accordance with privacy regulations.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <section className="border-b border-border bg-surface py-14 sm:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="max-w-3xl space-y-3">
            <Badge variant="accent">Legal &amp; Trust</Badge>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Privacy Policy
            </h1>
            <p className="text-xs text-muted">
              Last updated: November 24, 2026 • Effective immediately
            </p>
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <div className="py-16">
        <div className="mx-auto max-w-3xl space-y-8 px-4 text-xs leading-relaxed text-foreground sm:px-6 sm:text-sm">
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground">1. Introduction</h2>
            <p className="text-muted">
              CROWND Technologies (&ldquo;CROWND&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or
              &ldquo;us&rdquo;) provides a performance-based creator-commerce platform that connects
              commercial brands with content creators. This Privacy Policy explains our practices
              regarding the collection, use, disclosure, and protection of personal data when you
              visit our website, create an account, or participate in creator campaigns.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground">
              2. Information We Collect
            </h2>
            <div className="space-y-2 text-muted">
              <p>
                <strong>2.1 Account Credentials:</strong> When you register as a Brand or Creator,
                we collect your full name or company name, email address, cryptographic password
                hash, and account role.
              </p>
              <p>
                <strong>2.2 Profile &amp; Campaign Information:</strong> For Creators, we collect
                your social media handles, primary niche, and self-reported audience metrics. For
                Brands, we collect your company details, website URL, product descriptions, and
                campaign terms.
              </p>
              <p>
                <strong>2.3 Attribution &amp; Referral Telemetry:</strong> When end-customers visit
                a brand website via a creator&apos;s tracked link or redeem a personalized coupon
                code, we collect an anonymized hash of their IP address, browser user-agent string,
                HTTP referrer, and transaction order number to verify commercial attribution.
              </p>
              <p>
                <strong>2.4 Technical &amp; Operational Data:</strong> We log browser request
                headers, device type, and interaction logs strictly for platform security, fraud
                prevention, and service reliability.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc space-y-1.5 pl-5 text-muted">
              <li>To provide, maintain, and authenticate your account on the CROWND platform.</li>
              <li>To attribute customer purchases to specific creators and brand campaigns.</li>
              <li>To calculate and disburse commissions once return clearance periods elapse.</li>
              <li>
                To detect and prevent fraudulent referrals, self-dealing, or automated bot traffic.
              </li>
              <li>
                To communicate security updates, campaign changes, and platform announcements.
              </li>
              <li>To fulfill statutory tax, accounting, and anti-money laundering (AML) duties.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground">
              4. Cookies &amp; Local Storage
            </h2>
            <p className="text-muted">
              We employ essential first-party session cookies to maintain your authenticated login
              state across browser requests. We also use browser local storage exclusively to
              persist your visual theme preference (Light, Dark, or System). We do not deploy
              cross-site third-party advertising cookies or participate in data-broker behavioral
              tracking.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground">
              5. Data Protection &amp; Security
            </h2>
            <p className="text-muted">
              All data transmitted to and from CROWND is encrypted in transit using Transport Layer
              Security (TLS 1.3). Database records are guarded by strict Row Level Security (RLS)
              policies inside PostgreSQL, ensuring that user profiles, campaign details, and
              financial transactions can only be inspected by authorized account holders.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground">
              6. Your Statutory Rights (GDPR &amp; CCPA)
            </h2>
            <p className="text-muted">
              Depending on your location, you hold legal rights regarding your personal data,
              including the right to request access to your records, obtain an export of your data
              in a structured format, request correction of inaccurate details, or request deletion
              of your account and personal data where statutory retention obligations permit.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-foreground">7. Contact Information</h2>
            <p className="text-muted">
              For any questions regarding this Privacy Policy or to exercise your privacy rights,
              please reach out through our official platform channels or email:{" "}
              <strong className="text-foreground">privacy@crownd.example.com</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
